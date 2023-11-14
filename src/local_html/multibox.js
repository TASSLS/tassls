// -- multiple uses for login section --

function showLoading(URL) {
    document.getElementById('loadingOverlay').style.display = 'flex';
    document.getElementById('loading-text').innerText = "fetching:\n" + URL;
}

function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
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
        h2.textContent = 'Sign Up (UNFINISHED, GOTTA ADD ALL HTTP BODY)';
        box.appendChild(h2);

        const form = document.createElement('form');

        const usernameLabel = document.createElement('label');
        usernameLabel.textContent = 'Admin Username:';
        const usernameInput = document.createElement('input');
        usernameInput.type = 'text';
        usernameInput.name = 'username';
        form.appendChild(usernameLabel);
        form.appendChild(usernameInput);

        const passwordLabel = document.createElement('label');
        passwordLabel.textContent = 'Admin Password:';
        const passwordInput = document.createElement('input');
        passwordInput.type = 'password';
        passwordInput.name = 'password';
        form.appendChild(passwordLabel);
        form.appendChild(passwordInput);

        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.textContent = 'Create Student Account';
        form.appendChild(submitButton);

        box.appendChild(form);


        const br = document.createElement('br');
        box.appendChild(br);
        const hint = document.createElement('hint');
        hint.innerHTML = "Hint: admin username and password is just \"admin\"";
        box.appendChild(hint);

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
        return fetch(url)
            .then((response) => response.json())
            .then((json) => json);
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
        nameLabel.textContent = 'name:';
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.name = 'name';
        nameInput.value = account.name;
        nameInput.readOnly = true;

        const photoLabel = document.createElement('label');
        photoLabel.textContent = 'photo:';
        const photoInput = document.createElement('input');
        photoInput.type = 'text';
        photoInput.photo = 'photo';
        photoInput.value = account.photo;
        photoInput.readOnly = true;

        const dobLabel = document.createElement('label');
        dobLabel.textContent = 'dob:';
        const dobInput = document.createElement('input');
        dobInput.type = 'text';
        dobInput.dob = 'dob';
        dobInput.value = account.dob;
        dobInput.readOnly = true;

        formleft.appendChild(nameLabel);
        formleft.appendChild(nameInput);
        formleft.appendChild(photoLabel);
        formleft.appendChild(photoInput);
        formleft.appendChild(dobLabel);
        formleft.appendChild(dobInput);

        leftHalf.appendChild(formleft);

        const rightHalf = document.createElement('div');
        rightHalf.classList.add('user-info-half');

        const h2Right = document.createElement('h2');
        h2Right.textContent = 'Account Details';
        rightHalf.appendChild(h2Right);

        const formRight = document.createElement('form');

        const userIdLabel = document.createElement('label');
        userIdLabel.textContent = 'UUID:';
        const userIdInput = document.createElement('input');
        userIdInput.type = 'text';
        userIdInput.name = 'id';
        userIdInput.value = account.id;
        userIdInput.readOnly = true;

        const userNameLabel = document.createElement('label');
        userNameLabel.textContent = 'Username:';
        const userNameInput = document.createElement('input');
        userNameInput.type = 'text';
        userNameInput.id = 'username';
        userNameInput.value = account.name;
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
        formRight.appendChild(changePasswordButton);

        rightHalf.appendChild(formRight);

        box.appendChild(leftHalf);
        box.appendChild(rightHalf);

        // box.appendChild("test");
        return box;
    }
})

function changePassword(info) {
    const passwordInput = document.getElementById("passwordButton");
    passwordInput.readOnly = false;
    passwordInput.style.backgroundColor = "white";
    passwordInput.type = "";
    const passwordButton = document.getElementById("changePasswordButton");
    passwordButton.removeEventListener('click', changePassword);
    passwordButton.innerText = "Submit New Password";
    passwordButton.addEventListener('click', async function submit() {
        passwordButton.removeEventListener('click', submit);

        async function sendPut(PATH, account) {
            console.log("PUTting " + PATH)
            let createAccount = {};
            createAccount.username = account.username;
            createAccount.password = account.password;
            createAccount.name = account.name;
            createAccount.photo = account.photo;
            return fetch(PATH, {
                method: 'PUT',
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(createAccount)
            })
                .then(response => response.json())
                .then((json) => json);
        }
        showLoading(URL+STUDENT_ENDPOINT+"/"+info.id, info)
        await sendPut(info);
        hideLoading()
        location.reload();
    });
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
