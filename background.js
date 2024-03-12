chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
    });
});
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getTranslations") {
        fetch(chrome.runtime.getURL('translations.json'))
            .then(response => response.json())
            .then(data => sendResponse({ data: data }))
            .catch(error => console.error('Error loading the translation file:', error));
        return true;  // Will respond asynchronously.
    }
});  