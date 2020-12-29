var browser = browser || chrome;
browser.tabs.onActivated.addListener(tabHandler);
browser.tabs.onUpdated.addListener(tabHandler);
var blacklist = [];
var initial_data = ["http://example.com/", "https://www.salesforce.com/", "https://theuselessweb.com/", "https://www.imf-formacion.com/", "http://192.168.0.2/"];

function tabHandler(tabId, status, tabContent) {
    if (tabContent == undefined) return;
    browser.storage.local.get(data => {
        if (data.blacklist)  blacklist = data.blacklist;
        console.log("Blacklist size - tabHandler(): " + blacklist.length);
        console.log(blacklist);
        blacklist.forEach(url => {
            if (tabContent.url == url) {
                try {
                    browser.tabs.remove(tabId);
                }
                catch (e) {
                    return;
                }
            }
        });
    });
}

browser.runtime.onInstalled.addListener(d => {
    console.log("onInstalled");
    browser.storage.local.set({
        blacklist: initial_data
    });
})

