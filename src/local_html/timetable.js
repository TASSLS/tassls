// -- manage user timetable --
if(document.cookie == "" || document.cookie == "account_id=")
    window.open("account.html",'_self');

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

const URL = "http://127.0.0.1:3000";
const TIMETABLE_ENDPOINT = "/timetable";
const STUDENT_ENDPOINT = "/students";

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

async function login() {
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
    return account;
}

document.addEventListener('DOMContentLoaded', async function() {
    let account = await login();
    if(typeof account.timetable_id == "undefined")
        document.getElementById("nav-account").click();
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
    showLoading(URL+TIMETABLE_ENDPOINT + "/" + account.timetable_id)
    const timetable = (await sendGet(URL+TIMETABLE_ENDPOINT + "/" + account.timetable_id))[0];
    hideLoading()

});
