// -- login sign up same page --
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
