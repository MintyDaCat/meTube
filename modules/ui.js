import { db } from "./db.js";
import { popups } from '../assets/popups.js';
import { api } from "./api.js";

const guidePanel = document.getElementById("guide-panel");
const uploadHeader = document.getElementById("Upload-header");
const uploadStart = document.getElementById("Upload-start");
const uploadEdit = document.getElementById("Upload-edit");
const videoGridWrapper = document.getElementById("video-grid-wrapper");
const videoPlayer = document.getElementById("video-player");
const homePage = document.getElementById("home-page");
const videoSource = document.getElementById("video-source");
const videoPlayerTitle = document.getElementById("video-player-title");
const videoPlayerDescription = document.getElementById("video-player-description");
const videoInfo = document.getElementById("video-info");
const expanddesc = document.getElementById("expand-desc");
const featured = document.getElementById("featured");
const profileDropdownMenu = document.getElementById("profileDropdownMenu")
const filePicker = document.getElementById("file-picker");
const popup = document.getElementById("popup")

let descOpen = false;
let profileOpen = false;
let uploadOpen = false;
let guideOpen = false;
let currentPopup

async function loadPage(vids, container, className) {
    if (!container) {
        container = videoGridWrapper;
    }

    if (!className) {
        className = "video-card"
    }

    container.innerHTML = "";

    player.pause();

    console.log(container);

    Array.from(vids).forEach(video => {
        // 1. Create ONLY the single master structural parent wrapper element
        const videoCard = document.createElement('div');
        videoCard.className = className;
        
        // 2. Set your critical dataset markers for click listener calculations
        videoCard.dataset.src = video.src;
        videoCard.dataset.name = video.name;
        videoCard.dataset.desc = video.desc;
        videoCard.dataset.category = video.category || "vlogs";

        // 3. Resolve your thumbnail fallback conditions instantly [INDEX]
        const showThumbnail = video.thumbnail && video.thumbnail.trim() !== "";
        const primaryCoverUrl = showThumbnail ? video.thumbnail : "https://picsum.photos";

        // 4. ⚡️ THE MASTER INNER-HTML TEMPLATE STRING ⚡️
        // This entirely replaces your old giant wall of appendChild() lines! [INDEX]
        videoCard.innerHTML = `
            <div class="video-card__media-wrapper">
                <img class="video-card__thumbnail" src="${primaryCoverUrl}" alt="${video.name}">
                <video class="video-card__preview-overlay" src="${video.src}" preload="metadata" muted playsinline></video>
                <span class="longform-videocard-duration">--:--</span>
            </div>
            <p class="video-card__title">${video.name}</p>
            <div class="hover-overlay"></div>
        `;

        // 5. BIND OPERATIONAL LOGIC ACTIONS DIRECTLY TO THE NEW LIVE NODES
        // We look inside the card element to hook up tracking states and listeners
        const hoverPreviewVideo = videoCard.querySelector('.video-card__preview-overlay');
        const durationBadge = videoCard.querySelector('.longform-videocard-duration');

        hoverPreviewVideo.currentTime = 1; // Snaps exactly 1 second in to dodge a dark opening frame [INDEX]

        // Parse duration metadata natively straight from the .mp4 streaming link tracks [INDEX]
        hoverPreviewVideo.addEventListener('loadedmetadata', () => {
            const totalSecs = Math.floor(hoverPreviewVideo.duration);
            const mins = Math.floor(totalSecs / 60);
            const secs = (totalSecs % 60).toString().padStart(2, '0');
            durationBadge.textContent = `${mins}:${secs}`;
        });

        // Activate your high-performance visual hover preview streams [INDEX]
        videoCard.addEventListener('mouseenter', () => {
            hoverPreviewVideo.play().catch(e => console.log("Buffering hover stream..."));
        });
        
        videoCard.addEventListener('mouseleave', () => {
            hoverPreviewVideo.pause();
            hoverPreviewVideo.currentTime = 1; // Reset back to your baseline snapshot frame [INDEX]
        });

        // Launch your widescreen streaming player panel views when the card is clicked [INDEX]
        videoCard.addEventListener('click', (e) => {
            openVideo(videoCard.dataset);
            console.log(videoCard.dataset);
        });

        // Drop the completely packaged component straight onto your main grid matrix div
        container.appendChild(videoCard);
    });
}

function toggleUploadPopup(value) {
    if (typeof value == "boolean") {
        uploadOpen = value;
    } else {
        uploadOpen = !uploadOpen;
    }
    if (uploadOpen) {
        uploadHeader.classList.add("active");

        uploadStart.classList.add("active");
        uploadEdit.classList.remove("active");


    } else {
        uploadHeader.classList.remove("active");
        filePicker.value = "";
    }
}

function showPopup(message, config = {}) {
    console.log("yay")
    if (currentPopup == message) {
        message = ""
    }
    
    currentPopup = message;

    console.log(currentPopup)

    popup.innerHTML = popups[message] || ""

    if (message == "") {
        popup.classList.remove('active');
    } else {
        popup.classList.add('active');

        if (message == 'upload') {
            const filePicker = document.getElementById("video-upload_filePicker")

            filePicker.addEventListener('change', async (e) => {
                ui.showPopup('edit', {
                    file: filePicker.files[0]
                });
            })
        } else if (message == 'edit') {
            const uploadTitleInput = document.getElementById("Upload-title");
            uploadTitleInput.value = config.videoName || (config.file && config.file.name) || "";

            const uploadDescInput = document.getElementById("Upload-desc")

            const videoPlayerPreview = document.getElementById("video-edit_preview-video");
            videoPlayerPreview.src = URL.createObjectURL(config.file);

            const publishButton = document.getElementById("video-edit_publish-button")
            publishButton.addEventListener('click', () => {

                config.desc = uploadDescInput.value;
                config.videoName = uploadTitleInput.value;

                publishButton.disabled = true;
                publishButton.innerText = "Streaming to Cloud Server...";

                api.publishContent(config);

                publishButton.disabled = false;
                publishButton.innerText = "Publish Content";
            })
        }
    }
}

async function openVideo(video) {
    homePage.classList.remove('active');
    videoPlayer.classList.add('active');

    const videos = await db.fetchMediaCatalog();
    loadPage(videos, featured, "video-card-featured");

    toggleVideoInfo(true)
    
    const videoUrl = video.src;
    const videoTitle = video.name;
    const videoDescription = video.desc;

    videoPlayerTitle.textContent = videoTitle || "";
    videoPlayerDescription.textContent = videoDescription;

    console.log(videoUrl)

    videoSource.src = videoUrl;

    player.load();
    player.play().catch(e => console.log("Waiting for user context to unmute..."));
}

function toggleGuide(value) {
    if (typeof value == "boolean") {
        guideOpen = value;
    } else {
        guideOpen = !guideOpen;
    }

    if (guideOpen) {
        guidePanel.classList.add("active");
    } else {
        guidePanel.classList.remove("active");
    }
}

function toggleVideoInfo(value) {
    if (typeof value == "boolean") {
        descOpen = value;
    } else {
        descOpen = !descOpen;
    }
    
    console.log(descOpen);
    if (descOpen) {
        videoInfo.classList.remove('expanded');
        expanddesc.textContent = 'see more...';
    } else {
        videoInfo.classList.add('expanded');
        expanddesc.textContent = 'see less...';
    }
}

function profile(value) {
    if (typeof value == "boolean") {
        profileOpen = value;
    } else {
        profileOpen = !profileOpen;
    }
    
    console.log(profileOpen);
    if (profileOpen) {
        profileDropdownMenu.classList.add('active');
    } else {
        profileDropdownMenu.classList.remove('active');
    }
}

export const ui = {loadPage, toggleUploadPopup, openVideo, toggleGuide, toggleVideoInfo, profile, showPopup};