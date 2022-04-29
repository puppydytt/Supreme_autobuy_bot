export const TasksPage = () => {
    const newElement = document.createElement('div'),
        input = document.createElement('input'),
        addButton = document.createElement('input'),
        container = document.createElement('div'),
        aTag = document.createElement('a');
    newElement.className = 'tasksPage';
    input.className = 'keyWord';
    addButton.className = 'addButton';
    container.className = 'listOfItems';
    aTag.className = 'list';
    input.placeholder = 'Name of the Item';
    addButton.type = 'button';
    addButton.value = 'add';
    aTag.text = 'List:'
    addButton.addEventListener('click', () => addTask(container, input));
    newElement.appendChild(input);
    newElement.appendChild(addButton);
    newElement.appendChild(aTag);
    newElement.appendChild(container);
    chrome.storage.local.get(['keyWord'], (storage) => {
        if (storage.keyWord !== undefined) {
            for (let i = 0; i < storage.keyWord.length; i++) {
                const task = document.createElement('div'),
                    removeButton = document.createElement('input');
                task.className = 'task';
                removeButton.className = 'removeButton';
                removeButton.type = 'button';
                removeButton.value = 'Remove';
                removeButton.addEventListener('click', () => removeTask(container, task));
                console.log(storage.keyWord)
                task.textContent = storage.keyWord[i];
                container.appendChild(task);
                task.appendChild(removeButton);
            }
        }
    })
    return newElement;
};

const removeTask = (container, task) => {
    const valueOfTask = task.textContent;
    chrome.storage.local.get(['keyWord'], storage => {
        for (let i = 0; i < storage.keyWord.length; i++) {
            const modifiedStorage = storage.keyWord;
            if (valueOfTask === modifiedStorage[i]) {
                modifiedStorage.splice(i, 1);
                console.log(modifiedStorage)
                chrome.storage.local.set({keyWord: modifiedStorage});
                container.removeChild(task);
            }
        }
    });
};

const addTask = (container, input) => {
    const taskToSet = (modified) => {
        const task = document.createElement('div'),
            removeButton = document.createElement('input');
        task.className = 'task';
        removeButton.className = 'removeButton';
        removeButton.type = 'button';
        removeButton.value = 'Remove';
        removeButton.addEventListener('click', () => removeTask(container, task));
        task.textContent = input.value.toLowerCase();
        container.appendChild(task);
        task.appendChild(removeButton);
        input.value = '';
    };
    chrome.storage.local.get(['keyWord'], storage => {
        console.log(storage.keyWord.length)
        if (storage.keyWord.length === 0 || storage.keyWord.length === undefined) {
            console.log('firstTimeSetted')
            chrome.storage.local.set({keyWord: [input.value.toLowerCase()]}, () => taskToSet());
        } else if (storage.keyWord.length > 0) {
            const oldValue = storage.keyWord;
            oldValue.push(input.value.toLowerCase());
            chrome.storage.local.set({keyWord: oldValue}, () => taskToSet());
        }
    });
};