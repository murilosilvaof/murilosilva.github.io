const ROTATION_DELAY = 5000;

export function initProjectCarousel(cards, dialog) {
    const carousel = document.querySelector("#project-carousel");
    const track = carousel.querySelector("#carousel-track");
    const toggle = carousel.querySelector(".carousel-toggle");
    const position = carousel.querySelector(".carousel-position");
    const highlights = Array.from(carousel.querySelectorAll("[data-highlight]"));
    const featuredIds = highlights.map((button) => button.dataset.highlight);
    const showcaseIds = [...featuredIds, "convite"];
    const orderedCards = [
        ...showcaseIds.map((id) => cards.find((card) => card.dataset.project === id)),
        ...cards.filter((card) => !showcaseIds.includes(card.dataset.project))
    ];

    const slides = orderedCards.map((card, index) => {
        const slide = card.cloneNode(true);
        slide.removeAttribute("id");
        slide.classList.replace("project-card", "carousel-slide");
        slide.setAttribute("role", "group");
        slide.setAttribute("aria-roledescription", "slide");
        slide.setAttribute("aria-label", `${index + 1} de ${orderedCards.length}`);
        const title = slide.querySelector(".project-title");
        const heading = document.createElement("h3");
        heading.className = title.className;
        heading.textContent = title.textContent;
        title.replaceWith(heading);

        if (featuredIds.includes(card.dataset.project)) {
            const type = slide.querySelector(".project-type");
            type.prepend("Destaque · ");
        }
        const link = slide.querySelector(".project-link");
        if (link) {
            link.className = "button button-primary project-link";
            link.parentElement.prepend(link);
        }
        for (const image of slide.querySelectorAll("img")) image.draggable = false;
        return slide;
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
        for (const button of highlights) {
            if (button.dataset.highlight === slides[index].dataset.project) {
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
        toggle.textContent = autoRotate ? "Pausar rotação" : "Retomar rotação";
        position.setAttribute("aria-live", autoRotate && !reducedMotion.matches ? "off" : "polite");
        refreshRotation();
    }

    track.replaceChildren(...slides);
    carousel.hidden = false;
    updateActiveSlide(0);
    updateRotationControl();

    for (const button of highlights) {
        button.addEventListener("click", () => scrollToSlide(featuredIds.indexOf(button.dataset.highlight)));
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
        if (event.pointerType !== "mouse" || event.button !== 0 || !event.target.closest(".project-cover")) return;
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
