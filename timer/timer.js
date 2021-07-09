let timerController = '',
    hoursDeclared = 0,
    minutesDeclared = 0,
    secondsDeclared = 0,
    amPmDeclared = '',
    refreshIntervalDeclared = 0,
    stopTimer = false;

document.addEventListener('DOMContentLoaded', () => {
    let main = document.getElementById('main'),
        hours = document.getElementById('hours'),
        minutes = document.getElementById('min'),
        seconds = document.getElementById('sec'),
        setTimer = document.getElementById('setTimer'),
        amPm = document.getElementById('amPm'),
        refreshInterval = document.getElementsByClassName('refreshInterval')[0];
    timerController = main.children[0].children[0];
    hours.addEventListener('input', (e) => declareTimer(e));
    minutes.addEventListener('input', (e) => declareTimer(e));
    seconds.addEventListener('input', (e) => declareTimer(e));
    hours.addEventListener('keydown', (e) => rollBackInput(e));
    minutes.addEventListener('keydown', (e) => rollBackInput(e));
    seconds.addEventListener('keydown', (e) => rollBackInput(e));
    setTimer.addEventListener('click', () => setInterval(hours.value, minutes.value, seconds.value, amPm.value, refreshInterval));
});

const setInterval = (hours, minutes, seconds, amPm, refreshInterval) => {
    hoursDeclared = hours;
    minutesDeclared = minutes;
    secondsDeclared = seconds;
    amPmDeclared = amPm;
    refreshIntervalDeclared = refreshInterval.value;
    setCountDown();
};

const setCountDown = () => {
    const isDecimal = num => {
        if (num * -1 > num) {
            return num * -1
        } else return num
    };
    const date = new Date(),
        localHours = date.getHours(),
        localMinutes = date.getMinutes(),
        localSeconds = date.getSeconds();
    let timeCalled = 0;
    const dateExpression = [],
        formattedDate = [],
        timer = [];
    const timeGenerator = () => {
        for (let i = 1; i < 13; i++) {
            if (timeCalled === 0) {
                dateExpression.push([i, 'AM']);
            } else if (timeCalled === 1) {
                dateExpression.push([i, 'PM', i + 12 === 24 ? 0 : i + 12]);
            }
        }
        ++timeCalled;
        if (timeCalled === 2) return null;
        timeGenerator();
    }
    timeGenerator();
    for (let j = 0; j < dateExpression.length; j++) {
        if (parseFloat(hoursDeclared) === dateExpression[j][0] && amPmDeclared === 'PM' && dateExpression[j][1] === 'PM') {
            formattedDate.push(dateExpression[j][2], minutesDeclared, secondsDeclared);
        } else if (parseFloat(hoursDeclared) === dateExpression[j][0] && amPmDeclared === 'AM' && dateExpression[j][1] === 'AM') {
            formattedDate.push(dateExpression[j][0], minutesDeclared, secondsDeclared);
        }
    }
    if (stopTimer) {
        stopTimer = false;
        return null;
    }
    timer.push(isDecimal(formattedDate[0] - localHours), isDecimal(formattedDate[1] - localMinutes), isDecimal(formattedDate[2] - localSeconds));
    if (parseFloat(timer[0]) === 0 && parseFloat(timer[1]) === 0 && parseFloat(timer[2]) === 0) {
        chrome.runtime.sendMessage({refreshInterval: refreshIntervalDeclared, comment: 'reload'});
    }
    renderTimer(timer, amPmDeclared);
    setTimeout(setCountDown, 1000);
};

const renderTimer = (time, amPm) => {
    const timerBlock = document.createElement('div'),
        renderHours = document.createElement('a'),
        renderMinutes = document.createElement('a'),
        renderSeconds = document.createElement('a'),
        mainContainer = document.getElementById('rerenderElement'),
        removeTimerButton = document.createElement('input');
    timerBlock.className = 'timerBlock';
    renderHours.className = 'hoursBlock';
    renderMinutes.className = 'minutesBlock';
    renderSeconds.className = 'secondsBlock';
    renderHours.textContent = time[0] + ' : ';
    renderMinutes.textContent = time[1] + ' : ';
    renderSeconds.textContent = 60 - time[2];
    removeTimerButton.type = 'button';
    removeTimerButton.className = 'removeTimerButton';
    removeTimerButton.value = 'remove Timer';
    timerBlock.appendChild(renderHours);
    timerBlock.appendChild(renderMinutes);
    timerBlock.appendChild(renderSeconds);
    timerBlock.appendChild(removeTimerButton);
    removeTimerButton.addEventListener('click', () => removeTimer(mainContainer));
    switch (mainContainer.children[0].className) {
        case 'timerBlock':
            mainContainer.removeChild(mainContainer.children[0]);
            mainContainer.appendChild(timerBlock);
            break;
        case 'dateContainer':
            mainContainer.removeChild(mainContainer.children[0]);
            mainContainer.appendChild(timerBlock);
    }
};

const removeTimer = (mainContainer) => {
    stopTimer = true;
    mainContainer.removeChild(mainContainer.children[0]);
    mainContainer.appendChild(timerController);
};

const rollBackInput = e => {
    console.log(e)
    let key = e.key,
        currentInput = e.path[0],
        currentId = 0,
        path = e.path[1].children;
    for (let i = 0; i < 3; i++) {
        if (path[i].id === currentInput.id) currentId = i;
    }
    const nextElement = currentId + 1 === 3 ? path[2] : path[currentId + 1],
        previousElement = path[currentId - 1] === undefined ? path[0] : path[currentId - 1];
    if (key === 'Backspace' && currentInput.value.length === 0) previousElement.focus();
};

const declareTimer = e => {
    let regExp = /[0-9]/,
        value = e.target.value,
        currentInput = e.path[0],
        currentId = 0,
        path = e.path[1].children;
    for (let i = 0; i < 3; i++) {
        if (path[i].id === currentInput.id) currentId = i;
    }
    const nextElement = currentId + 1 === 3 ? path[2] : path[currentId + 1],
        previousElement = path[currentId - 1] === undefined ? path[0] : path[currentId - 1];
    if (value.length === currentInput.maxLength) nextElement.focus();
    else if (previousElement.value.length !== previousElement.maxLength) {
        if (currentId !== 0) {
            previousElement.value = currentInput.value;
            previousElement.focus();
            currentInput.value = '';
        }
    }
};