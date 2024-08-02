chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.type === 'updateState') {
        const inputState = message.inputState;
        chrome.tabs.query({url: '*://*.youtube.com/*'}, function (tabs) {
            for (const tab of tabs) {
                chrome.tabs.sendMessage(tab.id, {type: 'updateState', inputState});
            }
        });
    }
});


chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason === 'install' || details.reason === 'update') {

        if (details.reason === 'install') {
            const inputState = {
                autoSkip: true,
                rewind: true
            };
        chrome.storage.sync.set({inputState});            
        chrome.tabs.create({ url: 'https://youtube-skins.com/adskipper' });
        chrome.tabs.query({url: '*://*.youtube.com/*'}, function (tabs) {
            for (const tab of tabs) {
                chrome.scripting.executeScript({
                    target: {tabId: tab.id, allFrames : false},
                    files: ['content.js', 'content_isolated.js']
                });
            }
        });        
        }
    }
});


chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && tab.url.includes('youtube.com')) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['content.js']
        });
    }
});

chrome.tabs.onActivated.addListener(activeInfo => {
    const tabId = activeInfo.tabId;
    chrome.tabs.get(tabId, tab => {
        if (tab.url && tab.url.includes('youtube.com')) {
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ['content.js']
            });
        }
    });
});


chrome.runtime.setUninstallURL('https://youtube-skins.com/adskipper-feedback');    

