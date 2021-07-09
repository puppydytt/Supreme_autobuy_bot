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
        logOut = document.createElement('button'),
        presetSelect = document.createElement('select'),
        ukOption = document.createElement('option'),
        usaOption = document.createElement('option'),
        japanOption = document.createElement('option');
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

    presetSelect.className = 'presetSelect';
    ukOption.textContent = 'UK';
    usaOption.textContent = 'USA';
    japanOption.textContent = 'Japan';
    presetSelect.appendChild(ukOption);
    presetSelect.appendChild(usaOption);
    presetSelect.appendChild(japanOption);


    select.appendChild(optionPaypal);
    select.appendChild(optionCard);

    main.appendChild(presetSelect);
    main.appendChild(switcher);
    main.appendChild(option);
    main.appendChild(timer);
    main.appendChild(select);
    main.appendChild(logOut);


    chrome.storage.local.get(['enable'], (storage) => {
        storage.enable ? switcher.value = 'Enabled' : switcher.value = 'Disabled';
    });

    chrome.storage.local.get('paymentType', (storage) => {
        switch (storage.paymentType) {
            case 'PayPal':
                select.value = 'PayPal';
                break;
            case 'Card':
                select.value = 'Card';
                break;
            default:
                select.value = 'Card'
                break;
        }
    });

    chrome.storage.local.get('presetOption', (storage) => {
       switch (storage.presetOption) {
           case 'UK':
               presetSelect.value = 'UK';
               break;
           case 'USA':
               presetSelect.value = 'USA';
               break;
           case 'Japan':
               presetSelect.value = 'Japan';
               break;
           default:
               presetSelect.value = 'Select Option';
               break
       }
    });

    switcher.addEventListener('click', () => switcherButton(switcher));

    presetSelect.addEventListener('change', (e) => {
        chrome.storage.local.set({presetOption: e.target.value});
    });

    option.addEventListener('click', () => {
        chrome.tabs.create({
            url: '../main.html'
        })
    });

    timer.addEventListener('click', () => {
        chrome.tabs.create({
            url: '../timer/timerUi.html'
        });
    });

    select.addEventListener('change', (e) => {
        console.log(e.target.value)
        chrome.storage.local.set({paymentType: e.target.value});
    });

    logOut.addEventListener('click', () => {
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
