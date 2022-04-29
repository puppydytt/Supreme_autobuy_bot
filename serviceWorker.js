'use strict';

let mountedStorage = [], //obj
    urlToRequest = [], //obj
    processed = false, //boolean
    id = 0,//number
    found = false,
    refreshingInterval = 0;//boolean

chrome.storage.local.get(['enable'], res => mountedStorage = res.enable);
chrome.storage.local.onChanged.addListener((changes) => mountedStorage = changes.enable.newValue);


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.comment) {
        case 'reload':
            refreshingInterval = message.refreshInterval * 1000;
            pageReload();
            break;
        case 'auth':
            const data = {
                username: message.username,
                password: message.password
            };

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


chrome.tabs.onUpdated.addListener(tabId => {
    isEstablishedConnection();
    if (mountedStorage) {
        chrome.tabs.get(tabId, tabInfo => {
            const urlTrimmed = scriptInjector(tabInfo.url) === undefined ? 0 : scriptInjector(tabInfo.url);
            if (urlTrimmed.promise && urlTrimmed.length !== 0) {
                chrome.scripting.executeScript({
                    target: {tabId: tabInfo.id},
                    function: scriptToInject,
                }, (response) => console.log(response, 'item in the cart..'));
            } else if (urlTrimmed.parameter === 'all' || urlTrimmed.parameter === 'new') {
                chrome.scripting.executeScript({
                    target: {tabId: tabInfo.id},
                    function: elementSearch
                }, (functionReturn) => urlToRequest = functionReturn[0].result);
            } else if (urlTrimmed.parameter === 'checkout') {
                chrome.scripting.executeScript({
                    target: {tabId: tabInfo.id},
                    function: fillCardInfo
                }, (response) => console.log(response, 'sucessfuly purchased'));
            }
            if (urlToRequest.length !== 0) {
                requestCaller(tabInfo.id);
            }
        });
    }
});

chrome.tabs.onRemoved.addListener(() => isEstablishedConnection())

const isEstablishedConnection = () => {
    chrome.windows.getAll({populate: true}, windows => {
        let urlMatches = 0;
        windows[0].tabs.forEach(tab => scriptInjector(tab.url) !== undefined ? (++urlMatches, id = tab.id) : null);
        urlMatches > 0 ? (chrome.storage.local.set({isConnected: true})) : (chrome.storage.local.set({isConnected: false}), id = 0);
    });
};

const scriptInjector = param => {
    const iteratorPos = [];
    const url = param.toString();
    for (let i = 0; i < url.length; i++) {
        if (url[i] === '/') iteratorPos.push(i)
    }
    const domain = domainParser(iteratorPos, url);
    if (domain === 'www.supremenewyork.com') {
        return {
            domain: domain,
            promise: iteratorPos.length - 2 >= 3,
            parameter: getUrlParam(iteratorPos, url)
        };
    }
};

const elementSearch = () => {
    const urls = [];
    const container = document.getElementsByClassName('turbolink_scroller')[0].children;
    for (let i = 0; i < container.length; i++) {
        urls.push(container[i].children[0].children[0].href);
    }
    return urls
};

const requestCaller = tabId => {
    if (!processed) {
        let urlWhatMatch = 0;
        chrome.storage.local.get(['keyWord'], storage => {
                for (let i = 0; i < urlToRequest.length; i++) {
                    const separatorPosition = [];
                    fetch(urlToRequest[i])
                        .then((res) => res.text())
                        .then(result => {
                                const openingTag = /(<title>)/.exec(result),
                                    closingTag = /(<[/]title>)/.exec(result),
                                    name = wordsSlicerForUs(result.slice(openingTag.index + openingTag[0].length, closingTag.index));
                                const slicedKeyWord = wordsSlicer(storage.keyWord[0]), //toDo -> make multiple adding to cart
                                    slicedName = wordsParser(name);
                                slicedName.shift();
                                if (matcher(slicedKeyWord, slicedName)) {
                                    urlWhatMatch = urlToRequest[i];
                                    processed = true;
                                    chrome.storage.sync.set({idToAccess: i}, () => console.log('idReadyToBeRequested'));
                                    found = true;
                                    chrome.scripting.executeScript({
                                        target: {tabId: tabId},
                                        function: processToCard
                                    })
                                }
                            }
                        );
                }
            }
        );
    }
};

const processToCard = () => {
    chrome.storage.sync.get(['idToAccess'], storage => {
        document.getElementsByClassName('turbolink_scroller')[0].children[storage.idToAccess].children[0].children[0].click();
    });
};

const wordsSlicerForUs = string => {
    let formattedStr = [];
    for (let i = 0; i < string.length - 17; i++) {
        formattedStr.push(string[i])
    }
    return formattedStr.join('');
};

const wordsParser = string => {
    let modifiedString = '';
    (() => {
        const regExp_dash = /[-]/g.exec(string); //not available in UK and Japan regExp_colon = /[:]/g.exec(string);
        let stringWithoutDash = [...regExp_dash.input];
        stringWithoutDash.splice(regExp_dash.index, 2);
        modifiedString += stringWithoutDash.join('').slice(0, stringWithoutDash.join().length).toLowerCase();
    })();
    return wordsSlicer(modifiedString);
};

const wordsSlicer = string => {
    const arrayToReturn = [],
        separatorPosition = [0];
    for (let i = 0; i < string.length; i++) {
        if (string[i] === ' ') separatorPosition.push(i);
    }
    for (let j = 0; j < separatorPosition.length; j++) {
        if (separatorPosition[j] + 1 !== undefined) {
            arrayToReturn.push(
                string.slice(separatorPosition[j], separatorPosition[j + 1])
            );
        }
    }
    return arrayToReturn;
};

const matcher = (keyWord, itemName) => {
    let isMatchedCount = 0;
    let counter = 0;
    const wordCompare = (keyWordArr, itemNameArr, elementToSearch) => {
        for (let k = 0; k < keyWordArr.length; k++) {
            if (keyWordArr[k] === itemNameArr[k]) {
                counter += 1
            } else counter *= 0
            if (counter === elementToSearch.length) {
                isMatchedCount += 1;
            }
        }
    };

    for (let i = 0; i < keyWord.length; i++) {
        for (let j = 0; j < itemName.length; j++) {
            const destructedKeyWord = [...keyWord[i]],
                destructedItemName = [...itemName[j]];
            wordCompare(destructedKeyWord, destructedItemName, keyWord[i])
        }
    }
    return isMatchedCount === keyWord.length - 1;
};

const domainParser = (iteratorPos, url) => {
    const slicePositionFirst = iteratorPos[1];
    const slicePositionSecond = iteratorPos[2];
    return url.slice(slicePositionFirst + 1, slicePositionSecond);
};

const getUrlParam = (iteratorPos, url) => {
    const slicePositionFirst = iteratorPos[iteratorPos.length - 1];
    const slicePositionSecond = iteratorPos[iteratorPos.length];
    return (url.slice(slicePositionFirst + 1, slicePositionSecond));
};


const pageReload = () => {
    if (found) {
        console.log('proccesing check out of items');
        found = false;
        return 0;
    }
    chrome.tabs.reload(id, () => console.log('elements not founded'));
    console.log(refreshingInterval);
    setTimeout(pageReload, refreshingInterval);
}



