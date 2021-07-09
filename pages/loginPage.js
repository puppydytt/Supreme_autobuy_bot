export const LoginPage = () => {
    const InputPass = document.createElement('input'),
        InputLogin = document.createElement('input'),
        AuthContainer = document.createElement('div'),
        AuthButton = document.createElement('input');
    InputLogin.className = 'credentialsInput'
    InputPass.className = 'credentialsInput';
    InputLogin.placeholder = 'Login';
    InputPass.placeholder = 'Password';
    AuthButton.type = 'button';
    AuthButton.value = 'Log in';
    AuthButton.className = 'authButton';
    AuthContainer.className = 'authContainer';

    const element = document.getElementsByClassName('credentialsInput');

    AuthButton.addEventListener('click', () => {
        if (InputLogin.value < 2) {
            new credentialsError(element, AuthContainer,).throwError();
        } else {
            chrome.runtime.sendMessage({
                comment: 'auth',
                username: InputLogin.value,
                password: InputPass.value
            })
        }
    });

    chrome.runtime.onMessage.addListener((message, sender, response) => {
        if (message.comment === 'authResponse') {
            if(typeof message.data === 'boolean') new credentialsError(element, AuthContainer, '', 'Invalid Credentials').throwError();
            else return 0;
        }
    });

    InputLogin.addEventListener('click', () => new credentialsError(element, AuthContainer, '#6fba6f').reset());

    AuthContainer.appendChild(InputLogin);
    AuthContainer.appendChild(InputPass);
    AuthContainer.appendChild(AuthButton);

    return AuthContainer;
};

class credentialsError {
    constructor(element, container, previousColor, typeOfError) {
        this.element = element;
        this.container = container;
        this.previousColor = previousColor;
        this.typeOfError = typeOfError;
    }

    throwError = () => {
        const a = document.createElement('a');
        const getAElement = document.getElementById('errorName');
        a.style.color = '#e20c0c';
        a.id = 'errorName';
        a.text = `${this.typeOfError}`;
        console.log(getAElement)
        if (getAElement === null) {
            for (let i = 0; i < this.element.length; i++) {
                this.element[i].style.borderBottom = '1px solid #e20c0c';
            }
            this.container.appendChild(a);
        } else return 0;
    };

    reset = () => {
        const errorName = document.getElementById('errorName');
        if (errorName === null) return 0;
        for (let i = 0; i < this.element.length; i++) {
            this.element[i].style.borderBottom = `1px solid ${this.previousColor}`;
        }
        this.container.removeChild(errorName);
    }
}