export const renderController = (e) => {
    const barControl = document.getElementById('bar');
    const pageRenderTo = document.getElementById('page');
    const mainPageUrl = chrome.runtime.getURL('pages/mainPage.js'),
        loggerPageUrl = chrome.runtime.getURL('pages/loggerPage.js'),
        taskPageUrl = chrome.runtime.getURL('pages/taskPage.js'),
        proxyPageUrl = chrome.runtime.getURL('pages/proxyPage.js'),
        controlBarUrl = chrome.runtime.getURL('pages/controlBar.js'),
        loginPageUrl = chrome.runtime.getURL('pages/loginPage.js'),
        mainPage = import(mainPageUrl),
        loggerPage = import(loggerPageUrl),
        taskPage = import(taskPageUrl),
        proxyPage = import(proxyPageUrl),
        controlBar = import(controlBarUrl),
        loginPage = import(loginPageUrl);

    const elementRemove = () => {
        if (pageRenderTo.children.length === 1) {
            pageRenderTo.removeChild(pageRenderTo.children[0])
        } else return 0;
    };

    /*  const elementChildToReRender = wrapper[0].children[0];*/
    const name = typeof e === 'string' ? e : e.srcElement.text;
    switch (name) {
        case 'navBar':
            controlBar.then((bar) => barControl.appendChild(bar.controlBar()));
            break;
        case 'Main':
            mainPage.then((page) => pageRenderTo.appendChild(page.MainPage()));
            elementRemove();
            break;
        case 'Proxy':
            proxyPage.then((page) => pageRenderTo.appendChild(page.ProxyPage()));
            elementRemove();
            break;
        case 'Tasks':
            taskPage.then((page) => pageRenderTo.appendChild(page.TasksPage()));
            elementRemove();
            break;
        case 'Logger':
            elementRemove();
            loggerPage.then((page) => pageRenderTo.appendChild(page.LoggerPage()));
            break;
        case 'Login':
            loginPage.then((page)=> pageRenderTo.appendChild(page.LoginPage()));
            break;
        default:
            return null;
    }
};

