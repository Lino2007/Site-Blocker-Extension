function trURL (input) {
    let pos = input.indexOf("//");
    if (pos== -1) return null;
    pos = input.indexOf ("/", pos+2);
    if (pos == -1) {
        input += "/";
        pos = input.length;
    }
    return input.slice(0, pos+1);
 }

 function validateUrl(value)
{
    let regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    return regexp.test(value);
} 

function browserURL (infoURL) {
    if (infoURL.url.includes("chrome://")) {
        displayError(infoURL.errorCode);
        return true;
    } 
    return false;
}

function verifySiteArray(arr) {
    let temp = [];
    arr.forEach(url => {
        console.log(url);
        console.log(validateUrl(url));
        if (validateUrl(url)) temp.push(trURL(url));
        else {
          throw "..";
        }
    });
    blacklist = $.extend(true, [], temp);
    iterateAndCloseTabs(null);
}

 
 