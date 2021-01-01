var browser = browser || chrome;
var initial_data = ["http://example.com/", "https://www.salesforce.com/", "https://theuselessweb.com/", "https://www.imf-formacion.com/"];
var blacklist = [];


//#region Table control

function reloadTable () {
    $("#blTable").empty();
    loadTable();
}

function loadTable () {
    let table = document.getElementById("blTable"), i = 0;
    blacklist.forEach(item => {
         tr = table.insertRow(-1);
         tr.addEventListener("dblclick", handleDelete);
         tr.id = i++;
         cell = tr.insertCell(-1);
         cell.innerHTML = item;
    });
}

//#endregion

//#region Blacklist and file operations


function resetBlacklist() {
    let resetChoice = confirm ("Are you sure you want to reset blacklist?");
    if (!resetChoice) {
        displayStatus(2);
        return ;
    }
    browser.storage.local.set({
        blacklist: initial_data
    }, function() {
        blacklist = $.extend(true, [], initial_data); // deep copy
        reloadTable();
        displayStatus(3);
    });
}

function downloadBlacklist () {
    let element = document.createElement('a');
    const blacklistJSON = JSON.stringify(blacklist);
    element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(blacklistJSON));
    element.setAttribute('download', 'blacklist-' + Date.now() + ".json");
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function uploadBlacklist () {
   // button works as input element
   document.getElementById("file-import").click();
}

function handleFile () {
   if (this.files.length != 0) {
       var reader = new FileReader();
       reader.onload = function(file) {
           try {
            jsArr =  JSON.parse(this.result);
            verifyUrlArray(jsArr); // is json array in correct format?
            iterateAndCloseTabs();
            loadLocalStorage();
            displayStatus(4);
           }
           catch (e) {
               if (e.toString() === "..") {
                   displayError(4);
                   return ;
               }
               displayError(3);
           }
         
       }
       reader.readAsText(this.files[0]);
   }
}



function handleDelete () {
    blacklist.splice(this.id, 1);
    browser.storage.local.set({
        blacklist: blacklist
    }, function() {
        reloadTable ();
        displayStatus(1);
    });
}

function loadLocalStorage () {
    browser.storage.local.set({ blacklist: blacklist }, reloadTable);
}
//#endregion

//#region Blacklist and tab operations

function iterateAndCloseTabs() {
    // close active tabs that contain blacklisted URLs (from uploaded blacklist)
       browser.tabs.query({}, function(tabs) { 
         for (let i = blacklist.length - 1; i>=0; i--){
            for (let j = tabs.length - 1; j>=0; j--) {
                if (blacklist[i] == trimURL(tabs[j].url))  {
                    browser.tabs.remove(tabs[j].id);
                    tabs.splice(j,1);
                }
            }
        }
         });
    }
    
function closeTabs (url) {
        browser.tabs.query({}, function(tabs) { 
            tabs.forEach(tab => {
                if (trimURL(tab.url) === url) browser.tabs.remove(tab.id);
            });
        });
    }
    
function updateBlacklistAndTabs (url) {
        // add url to blacklist and close tabs containing that url
        displayStatus(0);
        blacklist.push(url);
        browser.storage.local.set({ blacklist: blacklist }, function(){
            closeTabs(url);
        });
    }
    
    
function blacklistInputURL () {
        //works with url from input field
        let url = document.getElementById("bInput").value;
        if (browserURL({url: url, errorCode: 2})) return ;
    
        if (url!=null && url.length!=0) {
            url = trimURL(url);
            if (validateUrl(url) && blacklist.indexOf(url) == -1) {
                updateBlacklistAndTabs(url);
                reloadTable(); 
            }
            else  displayError(2);
        }
        else displayError(2);
    }
    
    
function blacklistCurrentURL() {
      //works with url from current tab
      browser.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            if (browserURL({url: tabs[0].url, errorCode: 1})) return ;
            if (blacklist.indexOf(tabs[0].url)== -1) {
                var url = trimURL(tabs[0].url);
                updateBlacklistAndTabs(url);
            }
          }); 
}
//#endregion

$(function() {
    // tab switch
    $( "#tabs" ).tabs();
});


window.onload = function() {
    document.getElementById("di").addEventListener("click", blacklistCurrentURL);
    document.getElementById("refresh").addEventListener("click", resetBlacklist);
    document.getElementById("bButton").addEventListener("click", blacklistInputURL);
    document.getElementById("bInput").style.backgroundColor = "white";
    document.getElementById("export").addEventListener("click", downloadBlacklist);
    document.getElementById("import").addEventListener("click", uploadBlacklist);
    document.getElementById("file-import").addEventListener("change", handleFile);
    browser.storage.local.get(data => {
        if (data.blacklist)   blacklist = data.blacklist;
        loadTable();
    });
}