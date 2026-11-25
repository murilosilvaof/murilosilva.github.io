import { projectDetails } from "./project-data.js";

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

const cards = Array.from(document.querySelectorAll(".project[data-project]"));
const filters = document.querySelector(".filters");
const filterButtons = Array.from(filters.querySelectorAll("button"));
const filterResult = document.querySelector("#filter-result");

filters.hidden = false;
for (const button of filterButtons) {
    button.addEventListener("click", () => {
        const filter = button.dataset.filter;
        for (const option of filterButtons) {
            option.setAttribute("aria-pressed", String(option === button));
        }
        let matching = 0;
        for (const card of cards) {
            card.hidden = filter !== "all" && !card.dataset.cats.split(" ").includes(filter);
            matching += Number(!card.hidden);
        }
        filterResult.textContent = matching === 1 ? "1 projeto exibido." : `${matching} projetos exibidos.`;
    });
}

const dialog = document.querySelector("#project-dialog");
const galleryFrame = dialog.querySelector(".gallery-frame");
const galleryImage = dialog.querySelector("#gallery-image");
const galleryVideo = dialog.querySelector("#gallery-video");
const galleryTitle = dialog.querySelector("#gallery-title");
const galleryDescription = dialog.querySelector("#gallery-description");
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

function openProject(card, trigger) {
    const project = projectDetails[card.dataset.project];
    const link = card.querySelector(".project-link");
    const tech = Array.from(card.querySelectorAll(".tags li"), (item) => item.textContent);
    lastTrigger = trigger;
    dialogTitle.textContent = card.querySelector("h3").textContent;
    dialogType.textContent = card.querySelector(".project-type").textContent;
    dialogSummary.textContent = card.querySelector("p:not(.project-type)").textContent;
    dialogRole.textContent = project.role;
    dialogTags.replaceChildren(...listItems([...tech, ...(project.tech ?? [])]));
    dialogPoints.replaceChildren(...listItems(project.points ?? []));
    dialogPoints.hidden = !project.points?.length;
    dialogLinks.replaceChildren(
        projectLink(link.href, link.textContent, "button-primary"),
        ...(project.links ?? []).map(({ href, label }) => projectLink(href, label, "button-outline"))
    );

    slides = project.gallery;
    const hasMoreSlides = slides.length > 1;
    galleryControls.hidden = !hasMoreSlides;
    galleryItems.hidden = !hasMoreSlides;
    galleryItems.replaceChildren(...(hasMoreSlides ? slides.map(galleryButton) : []));
    showSlide(0);
    dialog.showModal();
    dialog.scrollTop = 0;
}

if (typeof dialog.showModal === "function") {
    for (const card of cards) {
        const trigger = card.querySelector(".project-detail");
        trigger.hidden = false;
        trigger.setAttribute("aria-haspopup", "dialog");
        trigger.setAttribute("aria-label", `Ver detalhes de ${card.querySelector("h3").textContent}`);
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
