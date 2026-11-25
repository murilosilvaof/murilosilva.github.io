import { projectDetails } from "./project-data.js";
import { initProjectCarousel } from "./project-carousel.js";

const menu = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#site-nav");
const smallScreen = matchMedia("(max-width: 49rem)");

function setMenu(open) {
    menu.setAttribute("aria-expanded", String(open));
    navigation.hidden = smallScreen.matches && !open;
}

menu.hidden = false;
setMenu(false);
smallScreen.addEventListener("change", () => setMenu(false));
menu.addEventListener("click", () => setMenu(navigation.hidden));
navigation.addEventListener("click", (event) => {
    if (smallScreen.matches && event.target.closest("a")) setMenu(false);
});
document.querySelector(".site-header").addEventListener("keydown", (event) => {
    if (event.key === "Escape" && smallScreen.matches && !navigation.hidden) {
        setMenu(false);
        menu.focus();
    }
});

const cards = Array.from(document.querySelectorAll(".project-catalog .project[data-project]"));
const dialog = document.querySelector("#project-dialog");
initProjectCarousel(cards, dialog);
const galleryFrame = dialog.querySelector(".gallery-frame");
const galleryImage = dialog.querySelector("#gallery-image");
const galleryVideo = dialog.querySelector("#gallery-video");
const galleryTitle = dialog.querySelector("#gallery-title");
const galleryDescription = dialog.querySelector("#gallery-description");
const galleryModels = dialog.querySelector("#gallery-models");
const galleryControls = dialog.querySelector("#gallery-controls");
const galleryNext = dialog.querySelector("#gallery-next");
const galleryPosition = dialog.querySelector("#gallery-position");
const galleryItems = dialog.querySelector("#gallery-items");
const dialogTitle = dialog.querySelector("#dialog-title");
const dialogType = dialog.querySelector("#dialog-type");
const dialogSummary = dialog.querySelector("#dialog-summary");
const dialogRole = dialog.querySelector("#dialog-role");
const dialogTags = dialog.querySelector("#dialog-tags");
const dialogPoints = dialog.querySelector("#dialog-points");
const dialogLinks = dialog.querySelector("#dialog-links");

let slides = [];
let slideIndex = 0;
let lastTrigger;

function listItems(items) {
    return items.map((text) => {
        const item = document.createElement("li");
        item.textContent = text;
        return item;
    });
}

function projectLink(href, label, className) {
    const link = document.createElement("a");
    link.href = href;
    link.target = "_blank";
    link.rel = "noopener";
    link.className = `button ${className}`;
    link.textContent = label;
    return link;
}

function clearVideo() {
    galleryVideo.pause();
    if (galleryVideo.hasAttribute("src")) {
        galleryVideo.removeAttribute("src");
        galleryVideo.load();
    }
}

function showSlide(index) {
    slideIndex = (index + slides.length) % slides.length;
    const slide = slides[slideIndex];
    galleryFrame.dataset.portrait = String(Boolean(slide.portrait));
    galleryVideo.hidden = !slide.video;
    galleryImage.hidden = Boolean(slide.video);
    if (slide.video) {
        galleryVideo.poster = `assets/${slide.image}`;
        galleryVideo.src = `assets/${slide.video}`;
        galleryVideo.setAttribute("aria-label", slide.title);
    } else {
        clearVideo();
        galleryImage.src = `assets/${slide.image}`;
        galleryImage.alt = slide.title;
    }
    galleryTitle.textContent = slide.title;
    galleryDescription.textContent = slide.description;
    galleryPosition.textContent = `${slideIndex + 1} de ${slides.length}`;
    Array.from(galleryItems.children).forEach((item, position) => {
        item.setAttribute("aria-current", String(position === slideIndex));
    });
}

function galleryButton(slide, index) {
    const button = document.createElement("button");
    const image = document.createElement("img");
    image.alt = "";
    image.loading = "lazy";
    image.src = `assets/${slide.image}`;
    button.type = "button";
    button.append(image, slide.title);
    button.addEventListener("click", () => {
        showSlide(index);
        dialog.scrollTop = 0;
        galleryNext.focus({ preventScroll: true });
    });
    return button;
}

function setGallery(items) {
    slides = items;
    const hasMoreSlides = slides.length > 1;
    galleryControls.hidden = !hasMoreSlides;
    galleryItems.hidden = !hasMoreSlides;
    galleryItems.replaceChildren(...(hasMoreSlides ? slides.map(galleryButton) : []));
    showSlide(0);
}

function setGalleryModels(models) {
    const buttons = models.map((model, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "button button-outline";
        button.textContent = model.label;
        button.setAttribute("aria-pressed", String(index === 0));
        button.addEventListener("click", () => {
            if (button.getAttribute("aria-pressed") === "true") return;
            for (const option of buttons) option.setAttribute("aria-pressed", String(option === button));
            setGallery(model.gallery);
            dialog.scrollTop = 0;
        });
        return button;
    });
    galleryModels.replaceChildren(...buttons);
    galleryModels.hidden = !buttons.length;
}

function openProject(card, trigger) {
    const project = projectDetails[card.dataset.project];
    const link = card.querySelector(".project-link");
    const tech = Array.from(card.querySelectorAll(".tags li"), (item) => item.textContent);
    lastTrigger = trigger;
    dialogTitle.textContent = card.querySelector(".project-title").textContent;
    dialogType.textContent = card.querySelector(".project-type").textContent;
    dialogSummary.textContent = card.querySelector("p:not(.project-type)").textContent;
    dialogRole.textContent = project.role;
    dialogTags.replaceChildren(...listItems([...tech, ...(project.tech ?? [])]));
    dialogPoints.replaceChildren(...listItems(project.points ?? []));
    dialogPoints.hidden = !project.points?.length;
    dialogLinks.replaceChildren(
        ...(link ? [projectLink(link.href, link.textContent, "button-primary")] : []),
        ...(project.links ?? []).map(({ href, label }) => projectLink(href, label, "button-outline"))
    );
    dialogLinks.hidden = !dialogLinks.childElementCount;

    const models = project.models ?? [];
    setGalleryModels(models);
    setGallery(models[0]?.gallery ?? project.gallery);
    dialog.showModal();
    dialog.scrollTop = 0;
}

if (typeof dialog.showModal === "function") {
    for (const trigger of document.querySelectorAll(".project-detail")) {
        const card = trigger.closest(".project");
        trigger.hidden = false;
        trigger.setAttribute("aria-haspopup", "dialog");
        trigger.setAttribute("aria-label", `${trigger.textContent} de ${card.querySelector(".project-title").textContent}`);
        trigger.addEventListener("click", () => openProject(card, trigger));
    }
    dialog.querySelector("#gallery-prev").addEventListener("click", () => showSlide(slideIndex - 1));
    galleryNext.addEventListener("click", () => showSlide(slideIndex + 1));
    dialog.querySelector("#dialog-close").addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => {
        if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener("close", () => {
        clearVideo();
        lastTrigger?.focus({ preventScroll: true });
    });

    const initialProject = new URLSearchParams(location.search).get("project");
    const initialCard = cards.find((card) => card.dataset.project === initialProject);
    if (initialCard) openProject(initialCard);
}

document.querySelector("#year").textContent = new Date().getFullYear();
