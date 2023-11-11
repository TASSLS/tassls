// -- header shapes --
function createShape(className, posX, posY) {
    const shape = document.createElement('div');
    shape.classList.add('shape', className);
    shape.style.left = posX + 'px';
    shape.style.top = posY + 'px';
    let test = Math.max(Math.random(), .2)*10;
    if(Math.random() < .5)
        test = -test;
    test += Math.random() * 180;
    shape.style.rotate = test + "deg"
    const size = Math.min(Math.max(.1, Math.random(), .6)) * 100;
    shape.style.width = size + "px";
    shape.style.height = size + "px";
    return shape;
}

function generateRandomShapeClass() {
    let temp = Math.random() < 0.5 ? 'shape-square' : 'shape-triangle';
    if(Math.random() < .5)
        temp = 'shape-circle'
    return temp;
}

function setRandomShapes() {
    const header = document.querySelector('header');

    const headerWidth = header.offsetWidth;
    const headerHeight = header.offsetHeight;
    let positionX = Math.random() * (headerWidth - 50);
    let randomOff = Math.random() * 100;
    let positionY = Math.random() < 0.5 ? headerHeight - randomOff : -randomOff;
    while(positionX < 200) {
        positionX = Math.random() * (headerWidth - 50);
        randomOff = Math.random() * 100;
        positionY = Math.random() < 0.5 ? headerHeight - randomOff : -randomOff;
    }
    const shape = createShape(generateRandomShapeClass(), positionX, positionY);

    header.appendChild(shape);
}

window.addEventListener('load', function() {for(let i = 0; i < 10; i++) setRandomShapes()});

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

        const studentUsernameLabel = document.createElement('label');
        studentUsernameLabel.textContent = 'Student Username:';
        const studentUsernameInput = document.createElement('input');
        studentUsernameInput.type = 'text';
        studentUsernameInput.name = 'student_username';
        form.appendChild(studentUsernameLabel);
        form.appendChild(studentUsernameInput);

        const studentPasswordLabel = document.createElement('label');
        studentPasswordLabel.textContent = 'Student Password:';
        const studentPasswordInput = document.createElement('input');
        studentPasswordInput.type = 'password';
        studentPasswordInput.name = 'student_password';
        form.appendChild(studentPasswordLabel);
        form.appendChild(studentPasswordInput);

        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.textContent = 'Sign Up';
        form.appendChild(submitButton);

        box.appendChild(form);

        const hint = document.createElement('hint');
        hint.innerHTML = "Hint for teacher: admin username and password is just \"admin\"";
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
