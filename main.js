"use strict"

document.addEventListener("DOMContentLoaded", () => {
    document.getElementsByClassName('saveInfo')[0].addEventListener('click', () => onSetData());
    chrome.storage.local.get(['userInfo'], (response) => {
        console.log(response)
        if (response.userInfo !== undefined) {
            document.getElementById('name').value = response.userInfo.name
            document.getElementById('email').value = response.userInfo.email
            document.getElementById('phone').value = response.userInfo.phone
            document.getElementById('street1').value = response.userInfo.streetLine1
            document.getElementById('street2').value = response.userInfo.streetLine2
            document.getElementById('street3').value = response.userInfo.streetLine3
            document.getElementById('sizeCloth').value = response.userInfo.sizeCloth
            document.getElementById('city').value = response.userInfo.city
            document.getElementById('postcode').value = response.userInfo.postcode
            document.getElementById('sizeSneakers').value = response.userInfo.sizeSneakers
            document.getElementById('in1').value = response.userInfo.cardNum
            document.getElementById('cardExp').value = response.userInfo.cardExp
            document.getElementById('cardCvv').value = response.userInfo.cardCvv
        }
    });

    let elValue = 0,
        exValue = 0;

    const stringFormatter = e => {
        elValue = e.target.value;
        exValue = elValue.length === 1 ? elValue.length : exValue
        console.log(exValue)
        let spaceCount = 0;
        if (elValue.length >= 4) {
            const el = document.getElementsByClassName('cardNum')[0];
            if (elValue.length <= 16) {
                console.log('done')
                for (let i = 0; i < elValue.length; i++) if (elValue[i] === ' ') ++spaceCount;
                if (elValue.length >= 4) {
                    console.log(true)
                    if (spaceCount > 0) {
                        let valueLength = elValue.length - spaceCount;
                        console.log(spaceCount, elValue.length, valueLength, 'va')
                        if (valueLength % 4 === 0) el.value = elValue + ' '
                    } else el.value = elValue + ' ';
                }
            }
        } else {
            const dynamicNode = e.target;
            if (dynamicNode.value.length !== elValue.length) {
                const splicedValue = dynamicNode.value.slice(dynamicNode.length - 1, dynamicNode.length);
                console.log(splicedValue.length)
                dynamicNode.value = splicedValue;
            } else return 0;
        }
    };

    let evenString = '';
    let oddString = '';
    let isSet = false;
    let isRemovable = false;
    let increased = false;
    let decreased = true;

    const expDateMask = (e, n, className, separator) => {
        const elValue = e.target.value,
            el = document.getElementsByClassName(className)[0];
        valueChangeAnalyser(className, n);
        console.log(isRemovable)
        if (elValue.length < evenString.length || elValue.length < oddString.length) {
            console.log('length decreased');
            if (isRemovable) {
                console.log('stack called isRemovable promise')
                for (let i = 0; i < elValue.length; i++) {
                    const slicedValue = elValue.slice(0, i)
                    if (elValue[i] === separator) el.value = slicedValue
                }
            }
        } else if (elValue.length >= evenString.length || elValue.length >= oddString.length) {
            console.log('length increased')
            if (!isSet) elValue.length === 3 ? el.value = valueToInject(elValue, separator, n) : null;
        }
        valueChangeAnalyser(className, n);
        isPersist(className, separator);
        onRemove(className, separator);
    };

    const valueChangeAnalyser = (elClass, n) => {
        const elValue = document.getElementsByClassName(elClass)[0].value;
        switch (elValue.length % n === 0) {
            case true:
                evenString = elValue;
                break;
            case false:
                oddString = elValue;
                break;
        }
        console.log(evenString, oddString, 'call stack from Value_change_analyser') //stopped here;
    };

    const valueToInject = (value, separator, separateEach) => {
        const stringedArray = [];
        for (let i = 0; i < value.length; i++) {
            i === separateEach ? stringedArray.push(separator) : null;
            stringedArray.push(value[i]);
        }
        return stringedArray.join('')
    };

    const isPersist = (elClass, separator) => {
        const el = document.getElementsByClassName(elClass)[0];
        let wasDetectedSeparator = false;
        for (let i = 0; i < el.value.length; i++) {
            console.log(el.value[i])
            if (el.value[i] === separator) {
                isSet = true;
                wasDetectedSeparator = true
            } else if (!wasDetectedSeparator && isSet) isSet = false;
        }
        console.log(isSet, 'call from isPersist')
    };

    const onRemove = (elClass, separator) => {
        let value = document.getElementsByClassName(elClass)[0].value,
            valueLengthAfterSeparator = 0;
        void (() => {
            for (let i = 0; i < value.length; i++) {
                value[i] === separator ? valueLengthAfterSeparator = value.slice(i + 1, value.length) : null
            }
        })();
        valueLengthAfterSeparator.length === 1 ? isRemovable = true : isRemovable = false //<-- stopped, plan for tomorrow make isRemovableChecker in component which reading if value decrease remove num and separator, also add regExp add chromeStorageSet, make switcher
        //make mask multi usable with cardNum input
        console.log(valueLengthAfterSeparator, 'call from onRemove', isRemovable)
    };

    const onSetData = () => {
        alert('Data Saved')
        let userInfo = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            streetLine1: document.getElementById('street1').value,
            streetLine2: document.getElementById('street2').value,
            streetLine3: document.getElementById('street3').value,
            city: document.getElementById('city').value,
            postcode: document.getElementById('postcode').value,
            sizeCloth: document.getElementById('sizeCloth').value,
            sizeSneakers: document.getElementById('sizeSneakers').value,
            cardNum: document.getElementById('in1').value,
            cardExp: document.getElementById('cardExp').value,
            cardCvv: document.getElementById('cardCvv').value
        }
        console.log(userInfo)
        chrome.storage.local.set({userInfo});
    };
});






