// -- multiple uses for login section --
const TIMETABLE_ENDPOINT = "/timetable";

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
document.addEventListener('DOMContentLoaded', function() {
    const errorPopup = document.getElementById('errorPopup');
    const loginSignupSection = document.getElementById('loginSignupSection');
    const loginSignupBox = document.getElementById('loginSignupBox');
    const signupLink = document.getElementById('signupLink');

    signupLink.addEventListener('click', function(event) {
        event.preventDefault();

        const newLoginSignupBox = createLoginSignupBox();
        loginSignupSection.replaceChild(newLoginSignupBox, loginSignupBox);
    });

    function createLoginSignupBox() {
        const box = document.createElement('div');
        box.classList.add('login-signup-box');

        const h2 = document.createElement('h2');
        h2.textContent = 'Sign Up';
        box.appendChild(h2);

        const form = document.createElement('form');

        const usernameLabel = document.createElement('label');
        usernameLabel.textContent = 'Admin Username:';
        const usernameInput = document.createElement('input');
        usernameInput.id = 'admin-username';
        usernameInput.type = 'text';
        usernameInput.name = 'username';
        form.appendChild(usernameLabel);
        form.appendChild(usernameInput);

        const passwordLabel = document.createElement('label');
        passwordLabel.textContent = 'Admin Password:';
        const passwordInput = document.createElement('input');
        passwordInput.id = 'admin-password';
        passwordInput.type = 'password';
        passwordInput.name = 'password';
        form.appendChild(passwordLabel);
        form.appendChild(passwordInput);

        const studentUserLabel = document.createElement('label');
        studentUserLabel.textContent = 'Student Username:';
        const studentUserInput = document.createElement('input');
        studentUserInput.id = 'student-username';
        studentUserInput.type = 'text';
        studentUserInput.name = 'studentUser';
        form.appendChild(studentUserLabel);
        form.appendChild(studentUserInput);

        const studentPassLabel = document.createElement('label');
        studentPassLabel.textContent = 'Student password:';
        const studentPassInput = document.createElement('input');
        studentPassInput.id = 'student-password';
        studentPassInput.type = 'password';
        studentPassInput.name = 'studentPass';
        form.appendChild(studentPassLabel);
        form.appendChild(studentPassInput);

        const studentNameLabel = document.createElement('label');
        studentNameLabel.textContent = 'Student name:';
        const studentNameInput = document.createElement('input');
        studentNameInput.id = 'student-name';
        studentNameInput.type = 'text';
        studentNameInput.name = 'studentName';
        form.appendChild(studentNameLabel);
        form.appendChild(studentNameInput);

        const studentPhotoLabel = document.createElement('label');
        studentPhotoLabel.textContent = 'Student Photo (URL):';
        const studentPhotoInput = document.createElement('input');
        studentPhotoInput.id = 'student-photo';
        studentPhotoInput.type = 'text';
        studentPhotoInput.name = 'studentPhoto';
        form.appendChild(studentPhotoLabel);
        form.appendChild(studentPhotoInput);

        const submitButton = document.createElement('button');
        submitButton.type = 'button';
        submitButton.textContent = 'Create Student Account';
        form.appendChild(submitButton);
        submitButton.addEventListener('click', createAccount)
        box.appendChild(form);
        const br = document.createElement('br');
        box.appendChild(br);

        const errorPopupCreate = errorPopup.cloneNode(true);
        box.appendChild(errorPopupCreate);

        async function createAccount() {
            async function populateTimetable(PATH) {
                console.log("POSTing " + PATH)
                let yearGroup = Math.floor(Math.random() * (12 - 7) + 7);
                let timetable_id;
                let data = [];
                for(let i = 0; i < 100; i++) {
                    data[i] = {
                        subject: yearGroup + " Math",
                        room: "j202",
                        teacher: "ms tassls"
                    }
                }
                let timetable = {};
                timetable.data = data;
                try {
                    let res = await fetch(PATH, {
                        method: 'POST',
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify(timetable)
                    })
                    if(!res.ok)
                        throw new Error(`fetching error: ${res.status}`)
                    timetable_id = res.json();
                } catch(error) {
                    showError(error)
                    hideLoading()
                }

                return timetable_id;
            }

            const adminDetails = "admin";
            if(document.getElementById("admin-username").value != adminDetails || document.getElementById("admin-password").value != adminDetails || document.getElementById("student-username").value == "" || document.getElementById("student-name").value == "") {
                const error = document.getElementById("errorPopup");
                error.style.display = 'block';

                void errorPopup.offsetWidth;

                setTimeout(() => { error.style.display = 'none'; }, 2000);
                return;
            }
            let failed = false;
            async function sendPost(PATH, timetable_id) {
                console.log("POSTing " + PATH)
                let createAccount = {};
                createAccount.username = document.getElementById("student-username").value;
                createAccount.password = document.getElementById("student-password").value;
                createAccount.name = document.getElementById("student-name").value;
                createAccount.photo = document.getElementById("student-photo").value;
                createAccount.timetable_id = timetable_id;
                try {
                    let res = await fetch(PATH, {
                        method: 'POST',
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify(createAccount)
                    })
                    if(!res.ok)
                        throw new Error(`fetching error: ${res.status}`)
                    return res.json();
                } catch(error) {
                    failed = true;
                    showError(error)
                    hideLoading()
                }
            }
            showLoading(URL+TIMETABLE_ENDPOINT)
            let timetable_id = await populateTimetable(URL+TIMETABLE_ENDPOINT);
            hideLoading()
            showLoading(URL+STUDENT_ENDPOINT)
            let newStu = await sendPost(URL+STUDENT_ENDPOINT, timetable_id);
            hideLoading()
            console.log(newStu.id)
            if(!failed) {
                document.cookie = "account_id=" + newStu.id;
                location.reload();
            }
        }

        const br1 = document.createElement('br');
        box.appendChild(br1);
        const hint = document.createElement('hint');
        hint.innerHTML = "Hint: admin username and password is just \"admin\"";
        box.appendChild(hint);
        const hint1 = document.createElement('hint');
        hint1.innerHTML = "\nHint: DOB is set to creation time for this example";
        box.appendChild(hint1);

        const paragraph = document.createElement('p');
        paragraph.innerHTML = "Already have an account? ";
        box.appendChild(paragraph);

        const loginLink = document.createElement('a');
        loginLink.href = '#';
        loginLink.textContent = 'Login here';
        loginLink.addEventListener('click', function(event) {
            event.preventDefault();
            loginSignupSection.replaceChild(loginSignupBox, box);
        });
        paragraph.appendChild(loginLink);

        return box;
    }
});

document.addEventListener('DOMContentLoaded', async function() {
    const accountId = getCookie("account_id");
    if(typeof accountId == "undefined" || accountId == "")
        return;
    document.getElementById("loginSignupBox").remove();
    document.getElementById("admin-control-center").style.display = "flex";

    // const URL = "https://tassls-dev-ghkk.1.us-1.fl0.io";
    const URL = "http://127.0.0.1:3000";
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
    showLoading(URL+STUDENT_ENDPOINT + "/dao/" + accountId)
    const account = (await sendGet(URL+STUDENT_ENDPOINT + "/dao/" + accountId))[0];
    hideLoading()
    if(typeof account == "undefined" || account == "")
        return;

    const userInfoContainer = document.getElementById('userInfoContainer');
    const newUserInfoBox = createUserInfoBox();
    userInfoContainer.innerHTML = '';
    userInfoContainer.appendChild(newUserInfoBox);

    function createUserInfoBox() {
        const box = document.createElement('section');
        box.classList.add('user-info-box');

        const leftHalf = document.createElement('div');
        leftHalf.classList.add('user-info-half');

        const h2left = document.createElement('h2');
        h2left.textContent = 'Student Details';
        leftHalf.appendChild(h2left);

        const formleft = document.createElement('form');

        const nameLabel = document.createElement('label');
        nameLabel.textContent = 'Name:';
        const nameInput = document.createElement('input');
        nameInput.id = 'student-name';
        nameInput.type = 'text';
        nameInput.name = 'name';
        nameInput.value = account.name;
        nameInput.readOnly = true;

        const photoLabel = document.createElement('label');
        photoLabel.textContent = 'Photo:';
        const photoInput = document.createElement('input');
        photoInput.id = 'student-photo';
        photoInput.type = 'text';
        photoInput.photo = 'photo';
        photoInput.value = account.photo;
        photoInput.readOnly = true;

        const dobLabel = document.createElement('label');
        dobLabel.textContent = 'DOB:';
        const dobInput = document.createElement('input');
        dobInput.type = 'text';
        dobInput.dob = 'dob';
        dobInput.value = account.dob;
        dobInput.readOnly = true;

        const logoutButton = document.createElement('button');
        logoutButton.type = 'button';
        logoutButton.textContent = 'Logout';
        logoutButton.addEventListener('click', () => {
            document.cookie = "account_id=;"
            location.reload();
        });

        formleft.appendChild(nameLabel);
        formleft.appendChild(nameInput);
        formleft.appendChild(photoLabel);
        formleft.appendChild(photoInput);
        formleft.appendChild(dobLabel);
        formleft.appendChild(dobInput);
        formleft.appendChild(logoutButton);

        leftHalf.appendChild(formleft);

        const rightHalf = document.createElement('div');
        rightHalf.classList.add('user-info-half');

        const h2Right = document.createElement('h2');
        h2Right.textContent = 'Account Details';
        rightHalf.appendChild(h2Right);

        const formRight = document.createElement('form');

        const userIdLabel = document.createElement('label');
        userIdLabel.textContent = 'ID:';
        const userIdInput = document.createElement('input');
        userIdInput.id = 'student-id';
        userIdInput.type = 'text';
        userIdInput.name = 'id';
        userIdInput.value = account.id;
        userIdInput.readOnly = true;

        const userNameLabel = document.createElement('label');
        userNameLabel.textContent = 'Username:';
        const userNameInput = document.createElement('input');
        userNameInput.id = 'student-username';
        userNameInput.type = 'text';
        userNameInput.id = 'username';
        userNameInput.value = account.username;
        userNameInput.readOnly = true;

        const userPasswordLabel = document.createElement('label');
        userPasswordLabel.textContent = 'Password:';
        const userPasswordInput = document.createElement('input');
        userPasswordInput.id = 'passwordButton';
        userPasswordInput.type = 'password';
        userPasswordInput.name = 'password';
        userPasswordInput.value = account.password;
        userPasswordInput.readOnly = true;

        const userCreatedLabel = document.createElement('label');
        userCreatedLabel.textContent = 'Created:';
        const userCreatedInput = document.createElement('input');
        userCreatedInput.type = 'text';
        userCreatedInput.name = 'created';
        userCreatedInput.value = account.created;
        userCreatedInput.readOnly = true;

        const userUpdatedLabel = document.createElement('label');
        userUpdatedLabel.textContent = 'Updated:';
        const userUpdatedInput = document.createElement('input');
        userUpdatedInput.type = 'text';
        userUpdatedInput.name = 'updated';
        userUpdatedInput.value = account.updated;
        userUpdatedInput.readOnly = true;

        const userTimetableLabel = document.createElement('label');
        userTimetableLabel.textContent = 'Timetable:';
        const userTimetableInput = document.createElement('input');
        userTimetableInput.type = 'text';
        userTimetableInput.id = 'student-timetable';
        userTimetableInput.name = 'timetable';
        userTimetableInput.value = account.timetable_id;
        userTimetableInput.readOnly = true;

        const changePasswordButton = document.createElement('button');
        changePasswordButton.type = 'button';
        changePasswordButton.textContent = 'Change Password';
        changePasswordButton.id = 'changePasswordButton';
        changePasswordButton.addEventListener('click', () => changePassword(account));

        formRight.appendChild(userIdLabel);
        formRight.appendChild(userIdInput);
        formRight.appendChild(userNameLabel);
        formRight.appendChild(userNameInput);
        formRight.appendChild(userPasswordLabel);
        formRight.appendChild(userPasswordInput);
        formRight.appendChild(userCreatedLabel);
        formRight.appendChild(userCreatedInput);
        formRight.appendChild(userUpdatedLabel);
        formRight.appendChild(userUpdatedInput);
        formRight.appendChild(userTimetableLabel);
        formRight.appendChild(userTimetableInput);
        formRight.appendChild(changePasswordButton);

        rightHalf.appendChild(formRight);

        box.appendChild(leftHalf);
        box.appendChild(rightHalf);

        return box;
    }
})

function changePassword(info) {
    const passwordInput = document.getElementById("passwordButton");
    passwordInput.readOnly = false;
    passwordInput.style.backgroundColor = "white";
    passwordInput.type = "text";
    const passwordButton = document.getElementById("changePasswordButton");
    passwordButton.removeEventListener('click', changePassword);
    passwordButton.innerText = "Submit New Password";
    passwordButton.addEventListener('click', async function submit() {
        passwordButton.removeEventListener('click', submit);
        let failed = false;
        async function sendPut(PATH, account) {
            console.log("PUTting " + PATH)
            let createAccount = {};
            createAccount.username = account.username;
            createAccount.password = document.getElementById("passwordButton").value;
            createAccount.name = account.name;
            createAccount.photo = account.photo;
            try {
                let res = await fetch(PATH, {
                    method: 'PUT',
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(createAccount)
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
        showLoading(URL+STUDENT_ENDPOINT+"/"+info.id)
        await sendPut(URL+STUDENT_ENDPOINT+"/"+info.id, info);
        hideLoading()
        if(!failed)
            location.reload();
    });
}

async function removeAsAdmin() {
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

    const id = document.getElementById("student-id").value;
    showLoading(URL+STUDENT_ENDPOINT+"/"+id)
    await sendDelete(URL+STUDENT_ENDPOINT+"/"+id);
    hideLoading()
    if(!failed)
        location.reload();
}

async function editAsAdmin() {
    const editButton = document.getElementById("editButton");
    editButton.innerText = "Submit Changes";

    function editInput(input) {
        const inputElem = document.getElementById(input);
        inputElem.readOnly = false;
        inputElem.style.backgroundColor = "white";
    }

    editInput("username")
    editInput("passwordButton");
    document.getElementById("passwordButton").type = "text";
    editInput("student-name");
    editInput("student-photo");

    editButton.addEventListener('click', async function submit() {
        editButton.removeEventListener('click', editAsAdmin);
        let failed = false;
        async function sendPut(PATH) {
            console.log("PUTting " + PATH)
            let createAccount = {};
            createAccount.username = document.getElementById("username").value;
            createAccount.password = document.getElementById("passwordButton").value;
            createAccount.name = document.getElementById("student-name").value;
            createAccount.photo = document.getElementById("student-photo").value;
            try {
                let res = await fetch(PATH, {
                    method: 'PUT',
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(createAccount)
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

        const id = document.getElementById("student-id").value;
        showLoading(URL+STUDENT_ENDPOINT+"/"+id)
        await sendPut(URL+STUDENT_ENDPOINT+"/"+id);
        hideLoading()
        if(!failed)
            location.reload();
    });
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
