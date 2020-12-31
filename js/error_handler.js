const errResponse = [" Chrome/Firefox URLs cannot be blacklisted!", " Incorrect URL or already exists in blacklist!"];
const statusResponse = [" URL successfully blacklisted!", " URL successfully removed from the blacklist!"];
var colors = ["red", "orange", "green"];
var error = false;

function inputColorSwitch () {
    let input = document.getElementById("bInput");
    let flag = input.style.backgroundColor === "white";
    if (flag) {
        input.style.backgroundColor = "#de6868";
        return ;
    } 
    input.style.backgroundColor = "white";
}

function switchIcon () {
    let icon = document.getElementById("statusIcon");
    let color = icon.style.color;
    if (color === "greenyellow") {
        icon.style.color = "red";
        icon.className="fa fa-exclamation-circle";
        error = true;
        return ;
    }
    icon.style.color = "greenyellow";
    icon.className="fa fa-check-circle";
    error = false;
}

function displayError (errorCode) {
 
   switch(errorCode) {
       case 0:
            inputColorSwitch();
       case 1:
           if (!error) switchIcon ();
           document.getElementById("statusLabel").innerHTML = errResponse[0];
           break;
       case 2:
           if (!error) {
           switchIcon();
           inputColorSwitch();
           }
           document.getElementById("statusLabel").innerHTML = errResponse[1];
           break;
       default:
           return;
   }
}

function displayStatus (statusCode) {
    if (error){
        switchIcon();
        inputColorSwitch();
    } 
    switch (statusCode) {
        case 0:
            document.getElementById("statusLabel").innerHTML = statusResponse[0];
            break;
        case 1:
            document.getElementById("statusLabel").innerHTML = statusResponse[1];
            break;
        case 2:
            break;
    }
}