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
    AuthButton.className = 'authButton'
    AuthButton.addEventListener('click', () => {
        chrome.runtime.sendMessage({
            comment: 'auth',
            username: InputLogin.value,
            password: InputPass.value
        })
    });
    AuthContainer.appendChild(InputLogin);
    AuthContainer.appendChild(InputPass);
    AuthContainer.appendChild(AuthButton);

    return AuthContainer;
};