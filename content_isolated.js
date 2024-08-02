const injectstyle = () => {
    injectstyle_style = document.createElement('style');
    injectstyle_style.id = 'injectstyle_id';
    injectstyle_style.innerHTML = 
            `
            .style-scope.ytd-rich-grid-renderer:has(.ytd-in-feed-ad-layout-renderer) {
            display:none;
            }
            .reel-video-in-sequence.style-scope.ytd-shorts:has(.ytd-ad-slot-renderer) {
            display:none;
            }    
            `;
    document.head.appendChild(injectstyle_style);
};

deletestyle = () => {
    element = document.getElementById('injectstyle_id');
    element && element.remove(); // Якщо element існує, виконуємо remove()
};

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.type === 'updateState') {
        inputState = message.inputState;
        autoSkipInput = inputState.autoSkip;
        document.body.dataset.ads = autoSkipInput;
        if (autoSkipInput) injectstyle();
        else deletestyle();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get('inputState', function (storageData) {
        console.log('setting loaded');        
        if (storageData && storageData.inputState) {
            document.body.dataset.ads = storageData.inputState.autoSkip;
            if (storageData.inputState.autoSkip) injectstyle();
        } else {
            document.body.dataset.ads = true;
            injectstyle();
        }
    });
});    