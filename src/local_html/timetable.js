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
            document.getElementById("nav-account").click();
        }
    }

    showLoading(URL+TIMETABLE_ENDPOINT + "/" + account.timetable_id)
    let timetable = (await sendGet(URL+TIMETABLE_ENDPOINT + "/" + account.timetable_id));
    hideLoading()
    timetableButton = timetable.data;
    createPeriods(timetable.data);
});

var week = 0;
function getWeekdayValue(date) {
    let start = new Date(date.getFullYear(), 0, 0);
    let diff = (date - start) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
    let oneDay = 1000 * 60 * 60 * 24;
    let day = Math.floor(diff / oneDay);

    const map = [[-1, 0, 1, 2, 3, 4, -1], [-1, 5, 6, 7, 8, 9, -1]];
    if(day % 7 == 0)
        week++;
    return map[week&1][date.getDay()];
}

let timetableButton;
let day = new Date();
function createPeriods(timetable) {
    document.querySelectorAll('.extra').forEach(e => e.remove());
    const timetableDay = getWeekdayValue(day);
    document.getElementById("timetable-heading").innerText = "Timetable for " + day.toString().slice(0, 15) + " (" + (timetableDay+1) + "/10)";
    const index = timetableDay*10;
    for(let i = 0; i < 10; i++) {
        // weekend
        let subjectText = "N/A"
        let roomText = "N/A"
        let teacherText = "N/A"
        if(timetableDay != -1) {
            subjectText = timetable[index+i].subject;
            roomText = timetable[index+i].room;
            teacherText = timetable[index+i].teacher;
        }

        period = document.getElementsByClassName("periods")[i];
        // bad
        let subject = document.createElement('td');
        let room = document.createElement('td');
        let teacher = document.createElement('td');
        subject.className = "extra";
        room.className = "extra";
        teacher.className = "extra";
        subject.innerText = subjectText;
        room.innerText = roomText;
        teacher.innerText = teacherText;
        period.appendChild(subject);
        period.appendChild(room);
        period.appendChild(teacher);
    }
}

function TodayButtonClick() {
    day = new Date();
    createPeriods(timetableButton);
}

function NextDayButtonClick() {
    day.setDate(day.getDate() + 1)
    createPeriods(timetableButton);
}

function PreviousDayButtonClick() {
    day.setDate(day.getDate() - 1)
    createPeriods(timetableButton);
}
