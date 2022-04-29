export const cartCheckout = () => {
    chrome.storage.local.get(['paymentType', 'userInfo'],
        (response) => {
            console.log(response)
            switch (response.paymentType) {
                case 'Credit Card':
                    const expYear = response.userInfo.cardExp.slice(3),
                        expMouth = response.userInfo.cardExp.slice(0, 2);
                    document.getElementsByName('order[billing_name]')[0].value = response.userInfo.name;
                    document.getElementsByName('order[email]')[0].value = response.userInfo.email;
                    document.getElementsByName('order[tel]')[0].value = response.userInfo.phone;
                    document.getElementsByClassName('input string required order_billing_address')[0].lastChild.value = response.userInfo.streetLine1;
                    document.getElementsByClassName('input string optional order_billing_address_2')[0].lastChild.value = response.userInfo.streetLine2;
                    document.getElementsByClassName('input string optional order_billing_address_3')[0].lastChild.value = response.userInfo.streetLine3;
                    document.getElementsByName('order[billing_city]')[0].value = response.userInfo.city;
                    document.getElementsByName('order[billing_zip]')[0].value = response.userInfo.postcode;
                    document.getElementsByName('credit_card[cnb]')[0].value = response.userInfo.cardNum;
                    const selectBlock = document.getElementById('cvv_row').getElementsByTagName('select');
                    selectBlock[0].value = expMouth;
                    selectBlock[1].value = '20' + expYear;
                    document.getElementsByName('credit_card[ovv]')[0].value = response.userInfo.cardCvv;
                    document.getElementsByClassName('iCheck-helper')[1].click();
                    document.getElementsByClassName('button ')[0].click();
                    break;
                case 'PayPal':
                    document.getElementById('payment_type_radio_paypal').click();
            }
        });
};