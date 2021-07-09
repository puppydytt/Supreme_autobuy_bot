'use strict';

let id = 0;
let found = false;
let processed = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.comment) {
        case 'reload':
            //pageReload(message.refreshInterval * 1000);
            break;
        case 'auth':
            const fetchData = {
                method: "post",
                body: new URLSearchParams({
                    username: message.username,
                    password: message.password,
                })
            };
            fetch('http://localhost:8080/auth', fetchData)
                .then(response => response.json())
                .then(data => chrome.runtime.sendMessage({comment: 'authResponse', data}));
            break;
    }
});

chrome.tabs.onRemoved.addListener(() => null)

chrome.tabs.onUpdated.addListener(tabId => null);


/*let mountedStorage = [],
    urlToRequest = [],
    processed = false,
    id = 0,
    found = false,
    refreshingInterval = 0;

chrome.storage.local.get(['enable'], res => mountedStorage = res.enable);
chrome.storage.local.onChanged.addListener((changes) => mountedStorage = changes.enable.newValue);
*/



