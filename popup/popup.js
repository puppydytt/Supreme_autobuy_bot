'use strict';

document.addEventListener("DOMContentLoaded", () => {
        const bar = document.createElement('div');
        const page = document.createElement('div');
        const root = document.getElementById('root');
        bar.id = 'bar';
        page.id = 'page';
        root.appendChild(bar);
        root.appendChild(page);
        chrome.storage.local.get(['isAuthed'], (storage) => {
            if (storage.isAuthed) {
                import(chrome.runtime.getURL('renderController/index.js')).then(render => render.renderController('navBar'));
                import(chrome.runtime.getURL('renderController/index.js')).then(render => render.renderController('Main'));
            } else {
                import(chrome.runtime.getURL('renderController/index.js')).then(render => render.renderController('Login'));
            }
        });
    }
);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.comment) {
        case 'authResponse':
            if (typeof message.data === "object") {
                chrome.storage.local.set({
                    isAuthed: {
                        auth: true,
                        id: message.data.id
                    }
                });
                window.location.reload();
            } else return 0;
            break;
    }
});

const send = (args) => {
    chrome.runtime.sendMessage(args);
};






