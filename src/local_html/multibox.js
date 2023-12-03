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

        const studentGenderLabel = document.createElement('label');
        studentGenderLabel.textContent = 'Student gender:';
        const genderOptions = ["Female", "Male"];
        const studentGenderInput = document.createElement('select');
        for (const option of genderOptions) {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            studentGenderInput.appendChild(optionElement);
        }
        studentGenderInput.id = 'student-gender';
        studentGenderInput.type = 'text';
        studentGenderInput.name = 'studentGender';
        form.appendChild(studentGenderLabel);
        form.appendChild(studentGenderInput);

        const studentPhotoLabel = document.createElement('label');
        studentPhotoLabel.textContent = 'Student Photo (URL):';
        const studentPhotoInput = document.createElement('input');
        studentPhotoInput.id = 'student-photo';
        studentPhotoInput.type = 'text';
        studentPhotoInput.name = 'studentPhoto';
        form.appendChild(studentPhotoLabel);
        form.appendChild(studentPhotoInput);

        const populateButton = document.createElement('button');
        populateButton.type = 'button';
        populateButton.textContent = 'Populate Using Randomapi';
        form.appendChild(populateButton);
        populateButton.addEventListener('click', populateFields)
        box.appendChild(form);

        form.appendChild(document.createElement('p'));

        const submitButton = document.createElement('button');
        submitButton.type = 'button';
        submitButton.textContent = 'Create Student Account';
        form.appendChild(submitButton);
        submitButton.addEventListener('click', createAccount)

        const errorPopupCreate = errorPopup.cloneNode(true);
        box.appendChild(errorPopupCreate);

        async function populateFields() {
            const RANDOM = "https://randomuser.me/api/";
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
            showLoading(RANDOM)
            let person = (await sendGet(RANDOM)).results[0];
            hideLoading()

            document.getElementById("student-username").value = person.name.last[0] + person.name.first;
            document.getElementById("student-password").value = person.login.password;
            document.getElementById("student-name").value = person.name.first;
            document.getElementById("student-gender").selectedIndex = !("male" > person.gender);
            document.getElementById("student-photo").value = person.picture.large;
        }

        async function createAccount() {
            async function populateTimetable(PATH) {
                console.log("POSTing " + PATH)
                const yearGroup = Math.floor(Math.random() * (12 - 7) + 7);
                let timetable_id;
                const delim = "_";
                let classPool = [
                    ["Mathematics", "ConnectED", "Religion", "Languages", "Technology", "Music", "Drama", "Visual Arts", "Science"], // 7
                    ["Mathematics", "English", "History", "Languages", "Technology", "Music", "Drama", "Geography", "Science", "Visual Arts"], // 8
                    ["Mathematics", "English", "History", "Technology", "Languages", "Science", "Visual Arts"], // 9
                    ["Mathematics", "English", "History", "Technology", "Languages", "Photography", "IST", "Commerce", "Global Studies", "Science", "Visual Arts"], // 10
                    ["Mathematics", "English", "History", "Business", "Economics", "Photography", "Biology", "Physics", "Chemistry", "Study", "Visual Arts"], // 11
                    ["Mathematics", "English", "History", "Chemistry", "Business", "Economics", "Biology", "Physics", "Study", "Visual Arts"], // 12
                    ["Extension Mathematics", "Extension English"], // 11 Morning
                    ["Extension Mathematics 1", "Extension English 1", "Extension Mathematics 2", "Extension English 2"], // 12 Morning
                    ["Homeroom", "Tutoring"] // Misc
                ];
                let blockPool = ['j', 'q', 'o', 'd', 'i', 's', 'm', 'e'];
                blockPool = blockPool.map((block) => block.toUpperCase());
                const teacherPool = ["Green", "Dark Green", "Light Green", "Chartreuse", "Juniper", "Sage", "Lime", "Fern", "Olive", "Emerald", "Pear", "Moss", "Shamrock", "Seafoam", "Pine", "Parakeet", "Mint", "Seaweed", "Pickle", "Pistachio", "Basil", "Crocodile", "Olive", "Castelon", "Emerald", "Forest", "Apple", "Jade", "Lawn", "Blue"];
                const titlePool = ["Ms.", "Miss", "Mrs.", "Mr.", "Dr.", "Prof."];
                const height = 3;
                const width = 8;
                for(let i = 0; i < classPool.length; i++) {
                    for(let j = 0; j < classPool[i].length; j++) {
                        classPool[i][j] += delim + blockPool[Math.floor(Math.random() * (blockPool.length-1))] + Math.floor(Math.random() * (height-1) + 1) + "0" + Math.floor(Math.random() * (width-1) + 1); // append room
                        classPool[i][j] += delim + titlePool[Math.floor(Math.random() * (titlePool.length-1))] + " " + teacherPool[Math.floor(Math.random() * (teacherPool.length-1))]; // append teacher
                    }
                }
                let data = [];
                const extensionDay = Math.floor(Math.random() * 13)
                const extensionClass = (yearGroup + " " + classPool[yearGroup-5][Math.floor(Math.random() * (classPool[yearGroup - 5].length-1))]).split(delim);
                let again = 0;
                for(let i = 0; i < 100; i++) {
                    let chosenClass = Math.floor(Math.random() * (classPool[yearGroup - 7].length-1));
                    let period = (yearGroup + " " + classPool[yearGroup - 7][chosenClass]).split(delim);

                    data[i] = {
                        subject: period[0],
                        room: period[1],
                        teacher: period[2]
                    }

                    if(Number.isInteger(((i+1)-3)/10)) {
                        let homeroom = (yearGroup + " " + classPool[classPool.length-1][0]).split(delim);
                        data[i] = {
                            subject: homeroom[0],
                            room: homeroom[1],
                            teacher: homeroom[2]
                        }
                    }
                    else if(Number.isInteger(((i+1)-2)/10) || Number.isInteger(((i+1)-1)/10)) {
                        data[i] = {
                            subject: "N/A",
                            room: "N/A",
                            teacher: "N/A"
                        }
                        if((yearGroup == 11 || yearGroup == 12) && (((i/10) % extensionDay == 0 || (i/10) % extensionDay == 3) || again)) {
                            again = !again;
                            data[i] = {
                                subject: extensionClass[0],
                                room: extensionClass[1],
                                teacher: extensionClass[2]
                            }
                        }
                    }
                    else if(Number.isInteger(((i+1)-10)/10)) {
                        data[i] = {
                            subject: "N/A",
                            room: "N/A",
                            teacher: "N/A"
                        }
                        if(Math.random() > .8) {
                            let afterSchool = (yearGroup + " " + classPool[classPool.length-1][1]).split(delim);
                            data[i] = {
                                subject: afterSchool[0],
                                room: afterSchool[1],
                                teacher: afterSchool[2]
                            }
                        }
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
                createAccount.gender = !!(document.getElementById("student-gender").selectedIndex);
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
        const photoContainer = document.createElement('div'); // Create a container div
        photoContainer.id = 'photo-container';
        const image = document.createElement('img')
        image.style.maxWidth = image.style.maxHeight = "1000px";
        image.src = account.photo;
        image.style = "border-radius: 100%";
        image.alt = account.name + " Photo";
        photoContainer.append(image);

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
        formleft.appendChild(photoContainer);
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
