var browser = browser || chrome;
var initial_data = ["http://example.com/", "https://www.salesforce.com/", "https://theuselessweb.com/", "https://www.imf-formacion.com/", "http://192.168.0.2/" ];
var blacklist = [];


function resetBlacklist() {
    browser.storage.local.set({
        blacklist: initial_data
    }, function() {
        blacklist = $.extend(true, [], initial_data);
        reloadTable();
    });
}


//todo: reimplement this function (r: inefficient and cf-ed)
function iterateAndCloseTabs(currentTab) {
   browser.tabs.query({}, function(tabs) { 
     if (currentTab!= null) tabs.splice(tabs.indexOf(currentTab), 1);
     let delFlag = false;
     for (let i = blacklist.length - 1; i>=0; i--){
        for (let j = tabs.length - 1; j>=0; j--) {
            if (blacklist[i] == trURL(tabs[j].url))  {
                browser.tabs.remove(tabs[j].id);
                tabs.splice(j,1);
                delFlag = true;
            }
        }
        if (delFlag==true) {
            blacklist.splice(i, 1);
            delFlag = false;
        }
    }
     });
}


function addUrl () {
    let url = document.getElementById("bInput").value;
    if (url.includes("chrome://")) {
        displayError(0); return;
    } 
    if (url!=null && url.length!=0) {
        url = trURL(url);
        if (validateUrl(url) && blacklist.indexOf(url) == -1) {
            console.log(url);
            displayStatus(0);
            blacklist.push(url);
            browser.storage.local.set({ blacklist: blacklist });
            iterateAndCloseTabs(null);
            loadTable();
        }
        else {
            displayError(2);
        }
    }
    else {
        displayError(2);
    }
}

function add() {
  browser.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        console.log("Blacklist size - add(): "+ blacklist.length);
        if ((tabs[0].url).includes("chrome://")) {
            displayError(1); return;
        }

        if (blacklist.indexOf(tabs[0].url)== -1) {
            console.log(tabs[0]);
            blacklist.push(trURL(tabs[0].url));
            displayStatus(0);
            browser.storage.local.set({ blacklist: blacklist }, function() {
            iterateAndCloseTabs(tabs[0]);
            browser.tabs.remove(tabs[0].id);
            loadTable();
            });
        }
      }); 
}
function reloadTable () {
    $("#blTable").empty();
    loadTable();
}

function handleDelete () {
    //console.log(this.id);
    blacklist.splice(this.id, 1);
    browser.storage.local.set({
        blacklist: blacklist
    }, function() {
        reloadTable ();
        displayStatus(1);
    });
}

function loadTable () {
    let table = document.getElementById("blTable"), i = 0;
    blacklist.forEach(item =>{
         tr = table.insertRow(-1);
         tr.addEventListener("dblclick", handleDelete);
         tr.id = i++;
         cell = tr.insertCell(-1);
         cell.innerHTML = item;
    });
}


window.onload = function() {
    document.getElementById("di").addEventListener("click", add);
    document.getElementById("refresh").addEventListener("click", resetBlacklist);
    document.getElementById("bButton").addEventListener("click", addUrl);
    document.getElementById("bInput").style.backgroundColor = "white";
    browser.storage.local.get(data => {
        if (data.blacklist)   blacklist = data.blacklist;
        loadTable();
    });
}