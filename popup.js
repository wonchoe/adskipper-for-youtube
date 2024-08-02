function localize() {
    document.querySelector('#label_auto_skip').innerHTML = chrome.i18n.getMessage("skip");
    document.querySelector('#label_rewind').innerHTML = chrome.i18n.getMessage("rewind");   
}


function setHooks(){
    chrome.storage.sync = chrome.storage.sync || {};

    const autoSkipInput = document.getElementById('input_auto_skip');
    const rewindInput = document.getElementById('input_rewind');

    autoSkipInput.addEventListener('change', function () {
        const inputState = {
            autoSkip: autoSkipInput.checked,
            rewind: rewindInput.checked
        };
        chrome.storage.sync.set({inputState});
        chrome.runtime.sendMessage({ type: 'updateState', inputState });
    });

    rewindInput.addEventListener('change', function () {
        const inputState = {
            autoSkip: autoSkipInput.checked,
            rewind: rewindInput.checked
        };
        chrome.storage.sync.set({inputState});
        chrome.runtime.sendMessage({ type: 'updateState', inputState });
    });    
}
// Load input state from Chrome storage when the popup opens
window.addEventListener('DOMContentLoaded', function () {
    localize();
    chrome.storage.sync.get('inputState', function (storageData) {
        if (storageData && storageData.inputState) {
            const autoSkipInput = document.getElementById('input_auto_skip');
            const rewindInput = document.getElementById('input_rewind');

            autoSkipInput.checked = storageData.inputState.autoSkip;
            rewindInput.checked = storageData.inputState.rewind;
        }
    });
    
    setHooks();    
});