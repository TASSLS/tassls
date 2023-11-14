// -- Manage user account login --
const URL = "http://127.0.0.1:3000";
const STUDENT_ENDPOINT = "/students";
async function sendGet(url) {
    console.log("GETting " + url)
    return fetch(url)
        .then((response) => response.json())
        .then((json) => json);
}

async function verify() {
    if(getCookie("account_id" != "")) {
        login();
        return;
    }
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value
    if(username == "" || password == "") {
        invalid()
        return;
    }
    let students = await sendGet(URL+STUDENT_ENDPOINT + "/part/" + username);
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
    const account = (await sendGet(URL+STUDENT_ENDPOINT + "/dao/" + id))[0];
    if(typeof account == "undefined") {
        document.cookie = "account_id=";;
        document.getElementById("nav-account").click();
        return;
    }
    document.getElementById("nav-account").innerText = account.name;
}

window.addEventListener('load', login)


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
