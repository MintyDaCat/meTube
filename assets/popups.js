const popups = {
    upload: '\
        <div class="video-upload_container">\
            <h1>select file</h1>\
            <div class="video-upload_dropzone">\
                <input class="video-upload_filePicker" id="video-upload_filePicker" type="file" accept="video/mp4">\
                <p class="video-upload_dropzone-text">upload file</p>\
            </div>\
        </div>\
    ',
    edit: '\
        <div class="video-edit_container">\
            <div class="video-edit_details">\
                <input class="video-edit_details-title" type="text" class="Upload-input title" id="Upload-title">\
                <textarea class="video-edit_details-desc" id="Upload-desc"></textarea>\
            </div>\
            <div class="video-edit_preview">\
                <video controls width="100%" class="video-edit_preview-video" id="video-edit_preview-video" src="https://github.com/MintyDaCat/meTube/releases/download/video-1785159027574/2026-04-08.21-43-31.mp4"></video>\
            </div>\
            <div class="video-edit_bottom-bar">\
                <button id="video-edit_publish-button">publish!</button>\
            </div>\
        </div>\
    ',
    login: '\
        <div class="login_container">\
            <h2>Sign in</h2>\
            <p>Email</p>\
            <input id="login-container_email-input" type="email">\
            <p>Password</p>\
            <input id="login-container_password-input" type="password">\
            <button id="login-container_login-button">login</button>\
            <p>dont have an account?</p>\
            <button id="login-container_sign-up">sign up!</button>\
        </div>\
    ',
    signUp: '\
        <div class="login_container">\
            <h2>sign up</h2>\
            <p>Username</p>\
            <input id="signUp-container_username-input" type="text">\
            <p>Email</p>\
            <input id="signUp-container_email-input" type="email">\
            <p>Password</p>\
            <input id="signUp-container_password-input" type="password">\
            <p>Confirm password</p>\
            <input id="signUp-container_password-input-confirm" type="password">\
            <button id="signUp-container_signUp-button">signUp</button>\
        </div>\
        '
}

export {popups}