export const controlBar = () => {
    const renderController = chrome.runtime.getURL('../renderController/index.js')
    const nameTags = ['Main', 'Tasks', 'Proxy', 'Logger'];
    const navBar = document.createElement('div'),
        container = document.createElement('div'),
        connectionStatus = document.createElement('div');
    navBar.className = 'navBar';
    container.className = 'container';
    connectionStatus.textContent = 'Connected to Supreme: '

    for (let i = 0; i < nameTags.length; i++) {
        const element = document.createElement('a');
        element.className = 'element';
        element.text = nameTags[i];
        container.appendChild(element);
        navBar.appendChild(element);
    }

    for (let i = 0; i < navBar.children.length; i++) {
        navBar.children[i].addEventListener('click', (e) => import(renderController).then((controller) => controller.renderController(e)));
    }

    return navBar;
};




/*const displayTheStatus = promise => {
        const connectionStatus = document.getElementById('connectionStatus'),
            removableChild = document.getElementById('statusToChange'),
            isConnectedElement = document.createElement('a'),
            isNotConnectedElement = document.createElement('a'); //declaring elements
        isConnectedElement.style.color = '#81b214';
        isConnectedElement.style.marginLeft = '5px';
        isConnectedElement.id = 'statusToChange';
        isConnectedElement.text = 'True';
        isNotConnectedElement.style.color = '#ff5200';
        isNotConnectedElement.style.marginLeft = '5px';
        isNotConnectedElement.id = 'statusToChange';
        isNotConnectedElement.text = 'False';
        if (connectionStatus.children.length > 0) connectionStatus.removeChild(removableChild)
        switch (promise) {
            case true:
                connectionStatus.appendChild(isConnectedElement);
                break;
            case false:
                connectionStatus.appendChild(isNotConnectedElement);
                break;
            default:
                return null;
        }
    }*/