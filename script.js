// DOM Elements
const guideButton = document.getElementById("guide-button");
const icon = document.getElementById("icon");
const uploadButton = document.getElementById("Upload-button");
const expanddesc = document.getElementById("expand-desc");
const videoPlayer = document.getElementById("video-player");
const homePage = document.getElementById("home-page");
const profile = document.getElementById("profile");
const dropdownUserNumber = document.getElementById("dropdownUserNumber");
const dropdownLoginItem = document.getElementById("dropdownLoginItem");
const dropdownSettingsItem = document.getElementById("dropdownSettingsItem");
const dropdownLogoutItem = document.getElementById("dropdownLogoutItem");

import { api } from "./modules/api.js";
import { auth } from "./modules/auth.js";
import { db } from "./modules/db.js";
import { ui } from "./modules/ui.js";

ui.updateProfileDropDown();

async function loadfrontpage() {
    videoPlayer.classList.remove('active');
    homePage.classList.add('active');

    const vids = await db.fetchMediaCatalog();
    await ui.loadPage(vids);
    console.log(vids)
}

loadfrontpage()

guideButton.addEventListener('click', ui.toggleGuide);
uploadButton.addEventListener('click', () => {
    ui.showPopup('upload');
})

icon.addEventListener('click', loadfrontpage);

expanddesc.addEventListener('click', ui.toggleVideoInfo)

profile.addEventListener('click', ui.profile);
dropdownLoginItem.addEventListener('click', () => {
    ui.showPopup("login");
})
dropdownLogoutItem.addEventListener('click', async () => {
    await auth.signOut();
    ui.updateProfileDropDown();
})

api.warmUpServer();