const errResponse = [" Chrome/Firefox URLs cannot be blacklisted!", " Incorrect URL or already exists in blacklist!", " Failed to load file due to incorrect format!", " Failed to load file due to incorrect URL formats!"];
const statusResponse = [" URL successfully blacklisted!", " URL successfully removed from the blacklist!", " Resetting aborted!", " Blacklist successfully resetted!"];
var colors = ["red", "orange", "green"];
var error = false;

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
   let input = document.getElementById("bInput");
   console.log(input.style.backgroundColor);
   console.log(errorCode);
   switch(errorCode) {
       case 0:
            console.log(input.style);
            input.style.backgroundColor = "#de6868";
       case 1:
           if (!error) switchIcon ();
           document.getElementById("statusLabel").innerHTML = errResponse[0];
           break;
       case 2:
           if (!error) switchIcon();
           input.style.backgroundColor = "#de6868";
           document.getElementById("statusLabel").innerHTML = errResponse[1];
           break;
       case 3:
           if (!error) switchIcon ();
           document.getElementById("statusLabel").innerHTML = errResponse[2];
           break;
        case 4:
            if (!error) switchIcon ();
            document.getElementById("statusLabel").innerHTML = errResponse[3];
            break;
         
       default:
           return;
   }
}

function displayStatus (statusCode) {
    let input = document.getElementById("bInput");
    if (error){
        switchIcon();
        input.style.backgroundColor = "white";
    } 
    switch (statusCode) {
        case 0:
            document.getElementById("statusLabel").innerHTML = statusResponse[0];
            break;
        case 1:
            document.getElementById("statusLabel").innerHTML = statusResponse[1];
            break;
        case 2:
            document.getElementById("statusLabel").innerHTML = statusResponse[2];
            break;
        case 3:
            document.getElementById("statusLabel").innerHTML = statusResponse[3];
            break;
    }
}