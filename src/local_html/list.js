// -- like a database list --
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
const TIMETABLE_ENDPOINT = "/timetable";
const STUDENT_ENDPOINT = "/students";

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

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

document.addEventListener('DOMContentLoaded', async function() {
    const id = getCookie("account_id");
    if(typeof id != "undefined" && document.cookie != "" && id != "") {
        showLoading(URL+STUDENT_ENDPOINT + "/dao/" + id)
        let student = await sendGet(URL+STUDENT_ENDPOINT + "/dao/" + id);
        hideLoading()
        if(typeof student == "undefined") {
            document.cookie = "account_id=;";
            document.location.reload();
        }
        document.getElementById("nav-account").innerText = student[0].name;
    }

    showLoading(URL+STUDENT_ENDPOINT)
    let students = (await sendGet(URL+STUDENT_ENDPOINT));
    hideLoading()

    populateUserList(students);
});

function populateUserList(students) {
    const userListSection = document.getElementById('user-list-section');

    for (const student of students) {
        const userCard = createUserCard(student);
        userListSection.appendChild(userCard);
    }
}

function createUserCard(user) {
    const card = document.createElement('div');
    card.classList.add('user-card');

    const imgContainer = document.createElement('div');
    imgContainer.classList.add('photo-container'); {
        const img = document.createElement('img');
        img.src = user.photo;
        img.alt = user.name + " Photo";
        imgContainer.appendChild(img);
    }

    const studentInfo = document.createElement('div');
    studentInfo.classList.add('user-info'); {
        const name = document.createElement('div');
        name.classList.add('name-info');
        const studentName = document.createElement('h2');
        studentName.textContent = user.name;
        name.appendChild(studentName);

        const id = document.createElement('div');
        id.classList.add('uuid-info');
        const studentId = document.createElement('p');
        studentId.textContent = user.id;
        id.appendChild(studentId);

        studentInfo.appendChild(name);
        studentInfo.appendChild(id);

        const unseen = document.getElementById('unseen');
        const nameU = document.createElement('p');
        nameU.textContent = user.name;
        unseen.appendChild(nameU);
        const gender = document.createElement('p');
        gender.textContent = user.gender;
        unseen.appendChild(gender);
        const dob = document.createElement('p');
        dob.textContent = user.dob;
        unseen.appendChild(dob);
        const created = document.createElement('p');
        created.textContent = user.created;
        unseen.appendChild(created);
    }

    const buttons = document.createElement('div');
    buttons.classList.add('action-buttons'); {
        const loginButton = document.createElement('button');
        loginButton.classList.add('login-button');
        loginButton.textContent = 'Login';
        loginButton.addEventListener('click', () => handleLogin(user.id));

        const removeButton = document.createElement('button');
        removeButton.classList.add('remove-button');
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', () => handleRemove(user.id));

        buttons.appendChild(loginButton);
        buttons.appendChild(removeButton);
    }

    card.appendChild(imgContainer);
    card.appendChild(studentInfo);
    card.appendChild(buttons);

    return card;
}

function handleLogin(id) {
    document.cookie = "account_id=" + id;
    window.open("account.html",'_self');
}

async function handleRemove(id) {
    let failed = false;
    async function sendDelete(url) {
        console.log("GETting " + url)
        try {
            let res = await fetch(url, {
                method: 'DELETE'
            })
            if(!res.ok)
                throw new Error(`fetching error: ${res.status}`)
            return res;
        } catch(error) {
            failed = true;
            showError(error)
            hideLoading()
        }
    }

    showLoading(URL+STUDENT_ENDPOINT+"/"+id)
    await sendDelete(URL+STUDENT_ENDPOINT+"/"+id);
    hideLoading()
    if(!failed)
        location.reload();
}

function tableCreate() {
    var tbl = document.createElement('table');
    tbl.id = "table-print";
    tbl.style.width = '100%';
    tbl.setAttribute('border', '1');

    return tbl
}

function printP() {
    let save = document.body;
    let students = document.getElementById("unseen").children;

    document.body.outerHTML = '';
    document.body.appendChild(tableCreate());
    const table = document.getElementById("table-print");

    const header = table.insertRow()
    let nameH = header.insertCell();
    nameH.appendChild(document.createTextNode("name"))
    let genderH = header.insertCell();
    genderH.appendChild(document.createTextNode("gender"))
    let dobH = header.insertCell();
    dobH.appendChild(document.createTextNode("DOB"))
    let joinedH = header.insertCell();
    joinedH.appendChild(document.createTextNode("joined"))

    for(let i = 0; i < students.length; i+=4) {
        const row = table.insertRow()

        let name = row.insertCell();
        name.appendChild(document.createTextNode(students[i].innerHTML))

        let gender = row.insertCell();
        gender.appendChild(document.createTextNode(students[i+1].innerHTML == "true" ? "Male" : "Female"))

        let dob = row.insertCell();
        dob.appendChild(document.createTextNode(students[i+2].innerHTML))

        let created = row.insertCell();
        created.appendChild(document.createTextNode(students[i+3].innerHTML))
    }

    window.print();

    document.body.replaceWith(save);
}
