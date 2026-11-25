const ROTATION_DELAY = 3000;

export function initServiceCarousel(dialog) {
    const carousel = document.querySelector("#service-carousel");
    const track = carousel.querySelector("#carousel-track");
    const shortcuts = carousel.querySelector(".carousel-shortcuts");
    const footer = carousel.querySelector(".carousel-footer");
    const toggle = carousel.querySelector(".carousel-toggle");
    const position = carousel.querySelector(".carousel-position");
    const choices = shortcuts.querySelectorAll("[data-service-target]");
    const slides = Array.from(track.querySelectorAll(".carousel-slide"));

    slides.forEach((slide, index) => {
        slide.setAttribute("role", "group");
        slide.setAttribute("aria-roledescription", "slide");
        slide.setAttribute("aria-label", `${index + 1} de ${slides.length}`);
        slide.querySelector("img").draggable = false;
    });

    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    const hoverDevice = matchMedia("(hover: hover)");
    const heldPointers = new Set();
    let activeIndex = 0;
    let inView = false;
    let autoRotate = true;
    let lastActivity = performance.now();
    let timer;
    let scrollFrame;
    let drag;

    function updateActiveSlide(index) {
        activeIndex = index;
        slides.forEach((slide, slideIndex) => { slide.inert = slideIndex !== index; });
        for (const button of choices) {
            if (button.dataset.serviceTarget === slides[index].dataset.service) {
                button.setAttribute("aria-current", "true");
            } else {
                button.removeAttribute("aria-current");
            }
        }
        position.textContent = `${index + 1} de ${slides.length}`;
    }

    function closestSlide() {
        let nearest = 0;
        let distance = Infinity;
        slides.forEach((slide, index) => {
            const difference = Math.abs(slide.offsetLeft - track.scrollLeft);
            if (difference < distance) {
                nearest = index;
                distance = difference;
            }
        });
        return nearest;
    }

    function scrollToSlide(index) {
        const next = (index + slides.length) % slides.length;
        const wrap = next !== index;
        track.scrollTo({ left: slides[next].offsetLeft, behavior: reducedMotion.matches || wrap ? "instant" : "smooth" });
    }

    function canRotate() {
        return autoRotate && !reducedMotion.matches && inView && !document.hidden && document.hasFocus()
            && !heldPointers.size && !drag && !dialog.open && !(hoverDevice.matches && carousel.matches(":hover"))
            && !carousel.contains(document.activeElement);
    }

    function noteActivity() {
        lastActivity = performance.now();
    }

    function scheduleRotation() {
        clearTimeout(timer);
        if (!canRotate()) return;
        const delay = Math.max(0, ROTATION_DELAY - (performance.now() - lastActivity));
        timer = setTimeout(() => {
            if (!canRotate()) return;
            if (performance.now() - lastActivity >= ROTATION_DELAY) {
                scrollToSlide(activeIndex + 1);
                noteActivity();
            }
            scheduleRotation();
        }, delay);
    }

    function refreshRotation() {
        noteActivity();
        scheduleRotation();
    }

    function updateRotationControl() {
        toggle.hidden = reducedMotion.matches;
        toggle.textContent = autoRotate ? "Pausar" : "Retomar";
        toggle.setAttribute("aria-label", autoRotate ? "Pausar rotação automática" : "Retomar rotação automática");
        position.setAttribute("aria-live", autoRotate && !reducedMotion.matches ? "off" : "polite");
        refreshRotation();
    }

    carousel.classList.add("is-enhanced");
    track.tabIndex = 0;
    track.setAttribute("role", "group");
    track.setAttribute("aria-label", "Serviços. Use as setas do teclado ou deslize para navegar.");
    shortcuts.hidden = false;
    footer.hidden = false;
    updateActiveSlide(0);
    updateRotationControl();

    for (const button of choices) {
        button.addEventListener("click", () => scrollToSlide(slides.findIndex((slide) => slide.dataset.service === button.dataset.serviceTarget)));
    }
    for (const button of carousel.querySelectorAll("[data-carousel-step]")) {
        button.addEventListener("click", () => scrollToSlide(activeIndex + Number(button.dataset.carouselStep)));
    }
    track.addEventListener("keydown", (event) => {
        if (event.target !== track || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
        event.preventDefault();
        scrollToSlide(activeIndex + (event.key === "ArrowRight" ? 1 : -1));
    });

    track.addEventListener("scroll", () => {
        noteActivity();
        if (scrollFrame) return;
        scrollFrame = requestAnimationFrame(() => {
            scrollFrame = undefined;
            const index = closestSlide();
            if (index !== activeIndex) updateActiveSlide(index);
        });
    }, { passive: true });

    // Touch and trackpads use native scrolling. Mouse users can also drag the cover.
    track.addEventListener("pointerdown", (event) => {
        if (event.pointerType !== "mouse" || event.button !== 0 || !event.target.closest(".service-slide-media")) return;
        drag = { pointerId: event.pointerId, x: event.clientX, left: track.scrollLeft, index: activeIndex };
        track.setPointerCapture(event.pointerId);
        refreshRotation();
    });
    track.addEventListener("pointermove", (event) => {
        if (drag?.pointerId !== event.pointerId) return;
        const distance = event.clientX - drag.x;
        if (Math.abs(distance) < 6 && !track.classList.contains("is-dragging")) return;
        track.classList.add("is-dragging");
        drag.distance = -distance;
        track.scrollLeft = drag.left - distance;
    });
    track.addEventListener("lostpointercapture", (event) => {
        if (drag?.pointerId !== event.pointerId) return;
        const { distance = 0, index: start } = drag;
        const nearest = closestSlide();
        drag = undefined;
        track.classList.remove("is-dragging");
        const next = nearest === start && Math.abs(distance) >= 60 ? start + Math.sign(distance) : nearest;
        scrollToSlide(Math.max(0, Math.min(slides.length - 1, next)));
        refreshRotation();
    });

    toggle.addEventListener("click", () => {
        autoRotate = !autoRotate;
        updateRotationControl();
    });
    for (const type of ["pointermove", "touchmove", "wheel", "keydown", "scroll"]) {
        window.addEventListener(type, noteActivity, { passive: true });
    }
    window.addEventListener("pointerdown", (event) => {
        heldPointers.add(event.pointerId);
        refreshRotation();
    }, { passive: true });
    for (const type of ["pointerup", "pointercancel"]) {
        window.addEventListener(type, (event) => {
            heldPointers.delete(event.pointerId);
            refreshRotation();
        }, { passive: true });
    }
    for (const type of ["pointerenter", "pointerleave", "focusin", "focusout"]) {
        carousel.addEventListener(type, () => queueMicrotask(refreshRotation));
    }
    window.addEventListener("focus", refreshRotation);
    window.addEventListener("blur", () => {
        heldPointers.clear();
        refreshRotation();
    });
    reducedMotion.addEventListener("change", updateRotationControl);
    document.addEventListener("visibilitychange", refreshRotation);
    dialog.addEventListener("close", refreshRotation);
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(([entry]) => {
            inView = entry.intersectionRatio >= 0.35;
            refreshRotation();
        }, { threshold: 0.35 });
        observer.observe(track);
    }
}
