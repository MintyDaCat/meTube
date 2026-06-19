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

let guideOpened = false;
let uploadOpened = false;

// 1. Point these to your real repository metrics
const GITHUB_USER = "MintyDaCat";
const GITHUB_REPO = "meTube";

// Leave your master memory array open and blank
let vids = []; 

// 2. ⚡️ THE AUTOMATIC DATABASE FETCH LOADER ⚡️
async function initializeMediaCatalog() {
    console.log("Contacting GitHub Pages storage network...");
    
    // 1. Get the base domain (e.g., http://127.0.0.1:3000 or https://github.io)
    const baseOrigin = window.location.origin;
    
    // 2. Get the folder path and strip out any actual page filenames like 'index.html'
    let folderPath = window.location.pathname;
    if (folderPath.endsWith('.html')) {
        // Splits the path by slashes, removes the filename, and joins it back together
        folderPath = folderPath.substring(0, folderPath.lastIndexOf('/'));
    }
    
    // 3. Ensure a clean trailing slash structure
    if (!folderPath.endsWith('/')) {
        folderPath += '/';
    }
    
    // ⚡️ THE BULLETPROOF FIX: Perfectly clean root directory folder pathway! ⚡️
    const liveJsonFeedUrl = `${baseOrigin}${folderPath}database.json?t=${Date.now()}`;
    
    console.log("Targeting direct repository file route:", liveJsonFeedUrl);
    
    try {
        const response = await fetch(liveJsonFeedUrl);
        
        if (response.ok) {
            vids = await response.json();
            console.log(`✓ Success! Synchronized ${vids.length} media entries from database.json.`);
            
            if (typeof loadPage === 'function') {
                loadPage(); 
            }
        } else {
            console.warn(`Database path matched, but server returned error code: ${response.status}`);
            if (typeof loadPage === 'function') loadPage();
        }
    } catch (err) {
        console.error("Critical storage tracking failure. Falling back to empty array:", err);
        vids = [];
        if (typeof loadPage === 'function') {
            loadPage();
        }
    }
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

async function publishContent() {
    const selectedFile = filePicker.files[0]; // Isolate the target single file object from the PC array index
    const descText = uploadDescInput.value.trim();
    
    let titleText = uploadTitleInput.value.trim();
    if (!titleText) {
        titleText = new Date().toLocaleDateString(); 
    }

    if (!selectedFile) {
        alert("Please browse files and pick an .mp4 clip first!");
        return;
    }

    // Lock your layout actions button bar to prevent duplicate spam click loops
    publishButton.disabled = true;
    publishButton.innerText = "Intermediary Stream routing via Supabase Cloud...";

    try {
        // 🚀 THE DIRECT BINARY NET STREAM ROUTER: Pass the file data directly as the body!
        const response = await fetch('https://supabase.co', {
            method: 'POST',
            headers: {
                // Ensure you paste your exact, long public anon key string in BOTH fields below!
                'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlnamxsdHVhc255bGJxbnNidWdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3OTc4OTIsImV4cCI6MjA5NzM3Mzg5Mn0.rUAEKLhY74zBPjvO9YPUHqJ7kcHWzkRxT3xhb9WGwD4`, 
                'apikey': `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlnamxsdHVhc255bGJxbnNidWdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3OTc4OTIsImV4cCI6MjA5NzM3Mzg5Mn0.rUAEKLhY74zBPjvO9YPUHqJ7kcHWzkRxT3xhb9WGwD4`,
                'x-file-name': selectedFile.name,
                'x-video-title': titleText
            },
            body: selectedFile // Streams the raw file bytes directly across the network wire!
        });

        const data = await response.json();

        if (response.ok) {
            alert(`🎉 Success! Video safely processed through Supabase and saved on GitHub.`);
            
            // ⚡️ DYNAMIC MEMORY INJECTION: Inject the object dynamically into your running array
            const newbornVideoCardObject = {
                name: titleText,
                thumbnail: "", // Left blank to trigger your video-frame automatic fallback!
                src: data.downloadUrl,
                type: "video"
            };

            // Push it onto your active runtime memory array stack
            vids.unshift(newbornVideoCardObject); 

            // Re-fire your working NRY layout template function to draw the newborn card onto the grid instantly!
            loadPage();

            // Clear out local form field values parameters memory slots
            uploadTitleInput.value = "";
            uploadDescInput.value = "";
            filePicker.value = "";
        } else {
            alert(`Upload Blocked: ${data.error || 'Server error'}`);
        }

    } catch (err) {
        console.error("Cloud pipeline transaction crash:", err);
        alert("Network Error linking with your cloud middleman layers.");
    } finally {
        publishButton.disabled = false;
        publishButton.innerText = "Publish Content";
    }

    // ✕ SLAM THE WINDOW DOOR: Remove your OS active layer frames cleanly to return home
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
