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

        const videoCard = document.createElement('div');
        const thumbnail = document.createElement('img');
        const title = document.createElement('p');
        const hoverOverlay = document.createElement('div');
        videoCard.classList.add("video-card");
        hoverOverlay.classList.add("hover-overlay");

        title.textContent = video.name;


        if (video.thumbnail && video.thumbnail.trim() !== "") {
            thumbnail.src = video.thumbnail;
        } else {
            const fallbackVideo = document.createElement('video');
            fallbackVideo.src = video.src;
    
            // ⚠️ CRITICAL CONFIGURATION: Stops the video from playing audio or wasting 
            // network bandwidth, telling the browser to load ONLY the first frame snapshot!
            fallbackVideo.preload = "metadata"; 
            fallbackVideo.muted = true;
            fallbackVideo.playsInline = true;
            
            // Optional: Snaps the frame to exactly 1 second in if the first frame is total black screen darkness
            fallbackVideo.currentTime = 1; 

            videoCard.appendChild(fallbackVideo);
        }

        videoCard.dataset.src = video.src;
        videoCard.dataset.name = video.name;
        videoCard.dataset.thumbnail = video.thumbnail;

        videoCard.addEventListener('click', openVideo);

        videoGridWrapper.appendChild(videoCard);
        videoCard.appendChild(thumbnail);
        videoCard.appendChild(title);
        videoCard.appendChild(hoverOverlay);
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
