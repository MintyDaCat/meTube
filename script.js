// DOM Elements
const guideButton = document.getElementById("guide-button");
const icon = document.getElementById("icon");
const uploadButton = document.getElementById("Upload-button");
const expanddesc = document.getElementById("expand-desc");
const videoPlayer = document.getElementById("video-player");
const homePage = document.getElementById("home-page");
const profile = document.getElementById("profile");

import { api } from "./modules/api.js";
import { auth } from "./modules/auth.js";
import { db } from "./modules/db.js";
import { ui } from "./modules/ui.js";

async function loadfrontpage() {
    videoPlayer.classList.remove('active');
    homePage.classList.add('active');

    const vids = await db.fetchMediaCatalog();
    await ui.loadPage(vids);
    console.log(vids)
}

loadfrontpage()


const GITHUB_USER = "MintyDaCat";
const GITHUB_REPO = "meTube";

guideButton.addEventListener('click', ui.toggleGuide);
uploadButton.addEventListener('click', () => {
    ui.showPopup('upload');
})

icon.addEventListener('click', loadfrontpage);

expanddesc.addEventListener('click', ui.toggleVideoInfo)

profile.addEventListener('click', ui.profile);

api.warmUpServer();
