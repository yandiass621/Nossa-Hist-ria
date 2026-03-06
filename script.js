let currentIndex = 0;
let autoScrollInterval;
const titleInput = document.getElementById("titleInput");
const messageInput = document.getElementById("messageInput");
const dateInput = document.getElementById("dateInput");
const imageInput = document.getElementById("imageInput");
const musicInput = document.getElementById("musicInput");
const emojiInput = document.getElementById("emojiInput");

const fsTitle = document.getElementById("fsTitle");
const fsMessage = document.getElementById("fsMessage");
const fsDate = document.getElementById("fsDate");
const fsImages = document.getElementById("fsImages");
const ytPlayer = document.getElementById("ytPlayer");

const thumbs = document.getElementById("thumbs");
const imageCount = document.getElementById("imageCount");
const emojiContainer = document.getElementById("emojiContainer");

/* PREVIEW TEXTO */
function updatePreview() {
    fsTitle.textContent = titleInput.value || "Nossa História";

    fsMessage.textContent =
        messageInput.value || "Sua mensagem aparecerá aqui";

    if (dateInput.value) {
        const date = new Date(dateInput.value);
        const formatted = date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });

        fsDate.textContent = "Desde " + formatted;
    } else {
        fsDate.textContent = "";
    }
}

[titleInput, messageInput, dateInput, emojiInput]
    .forEach(el => el.addEventListener("input", updatePreview));

/* IMAGENS (ATÉ 8 — NÃO SOBRESCREVE) */
let selectedImages = [];

imageInput.addEventListener("change", () => {
    const files = Array.from(imageInput.files);

    if (selectedImages.length + files.length > 8) {
    showAlert("Você pode adicionar no máximo 8 imagens 💖");
    return;
}

    selectedImages.push(...files);
    renderImages();
    imageInput.value = "";
});

function renderImages() {
    fsImages.innerHTML = "";
    thumbs.innerHTML = "";

    selectedImages.forEach((file, index) => {
        const url = URL.createObjectURL(file);

        /* IMAGEM NO PREVIEW */
        const img = document.createElement("img");
        img.src = url;
        fsImages.appendChild(img);

        /* MINIATURA COM REMOÇÃO */
        const thumbWrapper = document.createElement("div");
        thumbWrapper.classList.add("thumb-wrapper");

        const thumb = document.createElement("img");
        thumb.src = url;

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "✕";
        removeBtn.classList.add("remove-btn");

        removeBtn.addEventListener("click", () => {
            selectedImages.splice(index, 1);
            renderImages();
        });

        thumbWrapper.appendChild(thumb);
        thumbWrapper.appendChild(removeBtn);
        thumbs.appendChild(thumbWrapper);
    });

        imageCount.textContent = selectedImages.length;

        currentIndex = 0;
        startAutoScroll();
}

/* YOUTUBE EMBED */
musicInput.addEventListener("input", () => {
    const url = musicInput.value;
    let videoId = "";

    if (url.includes("youtu.be")) {
        videoId = url.split("/").pop();
    } else if (url.includes("youtube.com")) {
        videoId = new URL(url).searchParams.get("v");
    }

    if (videoId) {
        ytPlayer.src =
            `https://www.youtube.com/embed/${videoId}?autoplay=1&start=0`;
    }
});

/* EMOJI CAINDO */
setInterval(() => {
    if (!emojiInput.value) return;

    const span = document.createElement("span");
    span.className = "emoji";
    span.textContent = emojiInput.value;
    span.style.left = Math.random() * 90 + "%";
    span.style.animationDuration = (3 + Math.random() * 2) + "s";

    emojiContainer.appendChild(span);
    setTimeout(() => span.remove(), 5000);
}, 900);
function showAlert(message) {
    document.getElementById("alertText").textContent = message;
    document.getElementById("customAlert").style.display = "flex";
}

function closeAlert() {
    document.getElementById("customAlert").style.display = "none";
}
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

function goToSlide(index) {
    const images = fsImages.querySelectorAll("img");
    if (images.length === 0) return;

    if (index >= images.length) currentIndex = 0;
    else if (index < 0) currentIndex = images.length - 1;
    else currentIndex = index;

    const imageWidth = images[0].offsetWidth + 12; // largura + gap
    fsImages.scrollTo({
        left: imageWidth * currentIndex,
        behavior: "smooth"
    });
}

function startAutoScroll() {
    clearInterval(autoScrollInterval);

    autoScrollInterval = setInterval(() => {
        goToSlide(currentIndex + 1);
    }, 3000);
}

prevBtn.addEventListener("click", () => {
    goToSlide(currentIndex - 1);
});

nextBtn.addEventListener("click", () => {
    goToSlide(currentIndex + 1);
});