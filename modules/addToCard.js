export const addToCart = () => {
    (() => {
        setTimeout(() => {
            chrome.storage.local.get(['userInfo'], (response) => {
                const putIntoTheCart = document.getElementsByName('commit')[0];
                getSizes(response.userInfo.sizeCloth);
                putIntoTheCart.click();
                setTimeout(() => {
                    const checkOutCart = document.getElementsByClassName('button checkout')[0];
                    checkOutCart.click();
                }, 700)
            })
        }, 100);
    })();

    const getSizes = param => {
        const select = document.getElementsByTagName('select')[0]
        for (let i = 0; i < select.options.length; i++) {
            if (select.options[i].text === param) {
                select.options.selectedIndex = i;
            }
        }
    };
};