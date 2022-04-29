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

        /*
           chrome.storage.local.get(['isAuthed'], (res) => {
               if (res.isAuthed === undefined) {
                   document.body.removeChild(mainBody);
                   renderLogIn();
               } else if (res.isAuthed.auth === true) {
                   console.log('succes')
               }
           });
    
           logOut.addEventListener('click', () => {
               chrome.storage.local.remove('isAuthed');
               document.body.removeChild(mainPage); //remove main page
               renderLogIn();
           });
    
           chrome.storage.local.get(['enable'], (res) => { //getting value from storage then depending on response setting value to button
               res.enable ? button.value = 'Enabled' : button.value = 'Disabled';
           });
           chrome.storage.local.get(['isConnected'], (storage) => {
               if (storage.isConnected) displayTheStatus(true);
               else displayTheStatus(false);
           });
           chrome.storage.local.onChanged.addListener((changes) => {
               if (changes.isConnected.newValue) displayTheStatus(true);
               else displayTheStatus(false)
           })
           button.addEventListener('click', () => enableDisable(button));
           optionButton.addEventListener('click', () => {
               chrome.tabs.create({
                   url: 'main.html'
               })
           });
           chrome.storage.local.get(['paymentType'], (res) => {
               console.log(res)
               if (res.paymentType !== undefined) switch (res.paymentType) {
                   case 'Credit Card':
                       paymentType.value = res.paymentType
                       break;
                   case 'PayPal':
                       paymentType.value = res.paymentType
                       break;
               }
           });
           paymentType.addEventListener('change', e => chrome.storage.local.set({paymentType: e.target.value}));
         */
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
            } else if (typeof message.data === "boolean") {
                console.log('incorrect data')
                chrome.runtime.sendMessage({comment: 'onInvalidCredentials'});
            }
            break;
    }
});

const send = (args) => {
    chrome.runtime.sendMessage(args);
};






