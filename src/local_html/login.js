// -- Manage user account login --
function showLoading(URL) {
    document.getElementById('loadingOverlay').style.display = 'flex';
    document.getElementById('loading-text').innerText = "fetching:\n" + URL;
}

function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

function showError(message) {
    const errorBox = document.getElementById('errorBox');
    errorBox.textContent = message;
    errorBox.style.display = 'block';
}

function hideError() {
    const errorBox = document.getElementById('errorBox');
    errorBox.style.display = 'none';
}

const URL = "https://tassls-dev-ghkk.1.us-1.fl0.io";
const STUDENT_ENDPOINT = "/students";
async function sendGet(url) {
    console.log("GETting " + url)
    try {
        let res = await fetch(url)
        if(!res.ok)
            throw new Error(`fetching error: ${res.status}`)
        return res.json();
    } catch(error) {
        showError(error)
        hideLoading()
    }
}

async function verify() {
    if(typeof getCookie("account_id") == "undefined" || getCookie("account_id") != "") {
        login();
        return;
    }
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value
    if(username == "" || password == "") {
        invalid()
        return;
    }
    showLoading(URL+STUDENT_ENDPOINT + "/part/" + username)
    let students = await sendGet(URL+STUDENT_ENDPOINT + "/part/" + username);
    hideLoading()
    if(typeof students == "undefined" || students == "") {
        invalid();
        return;
    }
    students.map((student) => {
        if(student.password == password) {
            success(student.id);
            return;
        }
    });
}

async function login() {
    const id = getCookie("account_id");
    showLoading(URL+STUDENT_ENDPOINT + "/dao/" + id)
    const account = (await sendGet(URL+STUDENT_ENDPOINT + "/dao/" + id))[0];
    hideLoading()
    if(typeof account == "undefined") {
        document.cookie = "account_id=;";
        document.getElementById("nav-account").click();
        return;
    }
    document.getElementById("nav-account").innerText = account.name;
}

window.addEventListener('load', () => {
    if(typeof getCookie("account_id") == "undefined" || getCookie("account_id") != "") {
        login();
        return;
    }})


function invalid() {
    const error = document.getElementById("errorPopup")

    error.style.display = 'block'

    void errorPopup.offsetWidth;
    error.style.opacity = 0;

    setTimeout(() => {
        error.style.display = 'none';
        error.style.opacity = 1;
    }, 2000);
}

function success(id) {
    document.cookie = "account_id=" + id;
    login();
    document.getElementById("nav-account").click();
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
