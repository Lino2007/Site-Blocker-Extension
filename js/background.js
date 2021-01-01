var browser = browser || chrome;
browser.tabs.onActivated.addListener(tabHandler);
browser.tabs.onUpdated.addListener(tabHandler);
var blacklist = [];
var initial_data = ["http://example.com/", "https://www.salesforce.com/", "https://theuselessweb.com/", "https://www.imf-formacion.com/"];

function trURL (input) {
    let pos = input.indexOf("//");
    if (pos== -1) return null;
    pos = input.indexOf ("/", pos+2);
    if (pos == -1) pos = input.length;
    return input.slice(0, pos+1)
 }


function tabHandler(tabId, status, tabContent) {
    if (tabContent == undefined) return;
    browser.storage.local.get(data => {
        if (data.blacklist)  blacklist = data.blacklist;
        console.log("Blacklist size - tabHandler(): " + blacklist.length);
        console.log(blacklist);
        blacklist.forEach(url => {
            if (trURL(tabContent.url) == url) {
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
    browser.storage.local.set({
        blacklist: initial_data
    });
})

