// DOM Elements
const guideButton = document.getElementById("guide-button");
const guidePanel = document.getElementById("guide-panel");
const homePage = document.getElementById("home-page");
const videoGridWrapper = document.getElementById("video-grid-wrapper");
const videoPlayer = document.getElementById("video-player");
const icon = document.getElementById("icon");
const player = document.getElementById("player");
const videoSource = document.getElementById("video-source");
const uploadButton = document.getElementById("Upload-button");
const uploadContainer = document.getElementById("Upload-container");
const uploadStart = document.getElementById("Upload-start");
const uploadEdit = document.getElementById("Upload-edit");
const filePicker = document.getElementById("file-picker");
const uploadHeader = document.getElementById("Upload-header");
const videoPreviewSource = document.getElementById("video-preview-source");
const videoPlayerPreview = document.getElementById("video-player-preview");
const publishButton = document.getElementById("Publish-button");
const uploadTitleInput = document.getElementById("Upload-title");
const uploadDescInput = document.getElementById("Upload-desc");

// Warm up the server on page load
async function warmUpServer() {
    try {
        await fetch('https://metube-serverside.onrender.com/api/status');
    } catch (e) {}
}

// Call immediately on load
warmUpServer();

let guideOpened = false;
let uploadOpened = false;

// 1. Point these to your real repository metrics
const GITHUB_USER = "MintyDaCat";
const GITHUB_REPO = "meTube";

// Leave your master memory array open and blank
let vids = []; 

// 2. ⚡️ THE AUTOMATIC DATABASE FETCH LOADER ⚡️
async function initializeMediaCatalog() {
    console.log("Contacting Supabase database...");

    const SUPABASE_URL = "https://igjlltuasnylbqnsbugm.supabase.co";
    const SUPABASE_KEY = "sb_publishable_t3fT2ljoSTZ1YsA6ztKgdw_lGK4xe2i"; // safe to expose publicly

    try {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/videos?select=*&order=uploaded_at.desc`,
            {
                headers: {
                    "apikey": SUPABASE_KEY,
                    "Authorization": `Bearer ${SUPABASE_KEY}`,
                }
            }
        );

        if (response.ok) {
            const rows = await response.json();
            vids = rows.map(row => ({
                name:      row.name,
                thumbnail: row.thumbnail_url || "",
                src:       row.video_url,
                type:      "video"
            }));
            console.log(`✓ Loaded ${vids.length} videos from Supabase.`);
        } else {
            console.warn("Supabase returned error:", response.status);
            vids = [];
        }
    } catch (err) {
        console.error("Failed to load from Supabase:", err);
        vids = [];
    }

    if (typeof loadPage === 'function') loadPage();
}


// ⚡️ INITIALIZE AUTOMATICALLY ON PAGE LOAD ⚡️
// Replace your old casual loadPage() startup call with this cloud fetch check line:
window.addEventListener('DOMContentLoaded', initializeMediaCatalog);

async function loadPage() {
    videoGridWrapper.innerHTML = ""

    

    player.pause();

    videoPlayer.classList.remove('active');
    homePage.classList.add('active');

    Array.from(vids).forEach(video => {
        // 1. Create ONLY the single master structural parent wrapper element
        const videoCard = document.createElement('div');
        videoCard.className = "video-card";
        
        // 2. Set your critical dataset markers for click listener calculations
        videoCard.dataset.src = video.src;
        videoCard.dataset.name = video.name;
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
        videoCard.addEventListener('click', openVideo);

        // Drop the completely packaged component straight onto your main grid matrix div
        videoGridWrapper.appendChild(videoCard);
    });
}

function startUpload() {
    uploadOpened = !uploadOpened;

    console.log(uploadOpened)
    if (uploadOpened) {
        uploadHeader.classList.add("active");

        uploadStart.classList.add("active");
        uploadEdit.classList.remove("active");


    } else {
        uploadHeader.classList.remove("active");
    }
}

function openVideo(Event) {
    homePage.classList.remove('active');
    videoPlayer.classList.add('active');

    const card = Event.currentTarget;
    
    const videoUrl = card.dataset.src;
    const videoTitle = card.dataset.name;
    const videoThumbnail = card.dataset.thumbnail;

    console.log(videoUrl)

    videoSource.src = videoUrl;

    player.load();
    player.play().catch(e => console.log("Waiting for user context to unmute..."));
}

function toggleGuide() {
    guideOpened = !guideOpened;

    if (guideOpened) {
        guidePanel.classList.add("active");
    } else {
        guidePanel.classList.remove("active");
    }
}

// ⚡️ THE FINAL, LOCKED FRONTEND PUBLISH CONTROLLER ⚡️
async function publishContent() {
    // Make sure server is warm before uploading
    publishButton.disabled = true;
    publishButton.innerText = "Waking up server...";
    
    try {
        await fetch('https://metube-serverside.onrender.com/api/status');
    } catch(e) {
        alert("Server is offline. Try again in 40 seconds!");
        publishButton.disabled = false;
        publishButton.innerText = "Publish Content";
        return;
    }
    
    const selectedFile = filePicker.files[0];
    const descText = uploadDescInput.value.trim();
    
    let titleText = uploadTitleInput.value.trim();
    if (!titleText) {
        titleText = new Date().toLocaleDateString(); 
    }

    if (!selectedFile) {
        alert("Please browse files and pick an .mp4 clip first!");
        return;
    }

    const uploadBundle = new FormData();
    uploadBundle.append('video', selectedFile);        // ✅ matches server field name
    uploadBundle.append('name', titleText);            // ✅ matches server field name
    uploadBundle.append('description', descText);

    publishButton.disabled = true;
    publishButton.innerText = "Streaming to Cloud Server...";

    try {
        const response = await fetch('https://metube-serverside.onrender.com/api/upload', {  // ✅ correct path
            method: 'POST',
            body: uploadBundle
        });

        const data = await response.json();
        console.log("Server response:", data);

        if (response.ok) {
            alert(`🎉 Success! Video safely processed through server and saved on GitHub.`);
            
            const newbornVideoCardObject = {
                name: titleText,                        // ← use local var, don't rely on server
                thumbnail: data.video?.thumbnail_url || "",
                src: data.video?.video_url,
                type: "video"
            };

            vids.unshift(newbornVideoCardObject); 
            loadPage();

            uploadTitleInput.value = "";
            uploadDescInput.value = "";
            filePicker.value = "";
        } else {
            alert(`Upload Blocked: ${data.error || 'Server error'}`);  // ✅ server returns `error`, not `message`
        }

    } catch (err) {
        console.error("Cloud pipeline transaction crash:", err);
        alert("Server is cold booting or offline. Give it 40 seconds to wake up and try again!");
    } finally {
        publishButton.disabled = false;
        publishButton.innerText = "Publish Content";
    }

    uploadStart.classList.remove('active');
    uploadEdit.classList.remove('active');
    uploadHeader.classList.remove('active');
}

guideButton.addEventListener('click', toggleGuide);
uploadButton.addEventListener('click', startUpload);
icon.addEventListener('click', loadPage);
publishButton.addEventListener('click', publishContent);

loadPage()

filePicker.addEventListener('change', async (e) => {
    uploadStart.classList.remove('active');
    uploadEdit.classList.add('active');

    videoPreviewSource.src = URL.createObjectURL(e.currentTarget.files[0]);
    videoPlayerPreview.load();
})
