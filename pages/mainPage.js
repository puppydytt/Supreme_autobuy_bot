const switcherButton = component => {
    chrome.storage.local.get(['enable'], (storage) => {
        switch (storage.enable) {
            case true:
                chrome.storage.local.set({enable: false});
                component.value = 'Disabled';
                break;
            case false:
                chrome.storage.local.set({enable: true});
                component.value = 'Enabled'
                break;
            default:
                chrome.storage.local.set({enable: false})
                component.value = 'Disabled';
                break;
        }
    });
};

const controlMenu = () => {
    const main = document.createElement('div'),
        switcher = document.createElement('input'),
        option = document.createElement('input'),
        timer = document.createElement('input'),
        select = document.createElement('select'),
        optionPaypal = document.createElement('option'),
        optionCard = document.createElement('option'),
        logOut = document.createElement('button');
    main.className = 'controlMenu';
    switcher.type = 'button';
    option.type = 'button';
    switcher.value = '';
    timer.value = 'Timer';
    timer.type = 'button';
    option.value = 'Size & Payment';
    optionPaypal.text = 'PayPal';
    optionCard.text = 'Card';
    logOut.textContent = 'Log Out';


    select.appendChild(optionPaypal);
    select.appendChild(optionCard);


    main.appendChild(switcher);
    main.appendChild(option);
    main.appendChild(timer);
    main.appendChild(select);
    main.appendChild(logOut);


    chrome.storage.local.get(['enable'], (storage) => {
        storage.enable ? switcher.value = 'Enabled' : switcher.value = 'Disabled';
    });


    switcher.addEventListener('click', () => switcherButton(switcher));

    option.addEventListener('click', ()=>{
        chrome.tabs.create({
            url: '../main.html'
        })
    });

    timer.addEventListener('click', () => {
        chrome.tabs.create({
            url: '../timer/timerUi.html'
        });
    });

    logOut.addEventListener('click', ()=>{
        window.location.reload();
        chrome.storage.local.remove('isAuthed');
    });

    return main;
};

export const MainPage = () => {
    const wrapper = document.createElement('div'),
        main = document.createElement('div'),
        control = controlMenu();
    wrapper.appendChild(control);


    return wrapper;
};
