/**
 * 
 * MEthod from answer at: https://stackoverflow.com/questions/1977871/check-if-an-image-is-loaded-no-errors-with-jquery
 */
function IsImageLoaded(img) {
    // During the onload event, IE correctly identifies any images that
    // weren’t downloaded as not complete. Others should too. Gecko-based
    // browsers act like NS4 in that they report this incorrectly.
    if (!img.complete) {
        return false;
    }

    // However, they do have two very useful properties: naturalWidth and
    // naturalHeight. These give the true size of the image. If it failed
    // to load, either of these should be zero.
    if (img.naturalWidth === 0) {
        return false;
    }

    // No other way of checking: assume it’s ok.
    return true;
}

/**
 * 
 * Method from answer at: https://stackoverflow.com/questions/9714525/javascript-image-url-verify
 */
function checkURL(url) {
    return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

function validDrawImage(url) {
    if (url === null || url === "") {
        return false;
    }

    if (!checkURL(url)) {
        return false;
    }

    return true;
}

/**
 * 
 * Method from: http://jsfiddle.net/sz76c083/1/
 */
function downloadJsonFromObject(obj, fileName) {
    var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));

    var a = document.createElement('a');
    a.href = 'data:' + data;
    a.download = fileName;
    a.innerHTML = 'download JSON';
    a.dispatchEvent(new MouseEvent(`click`, { bubbles: true, cancelable: true, view: window }));

}

/**
 * 
 * Method from: https://stackoverflow.com/questions/34485420/how-do-you-put-an-image-file-in-a-json-object/34485762
 */
function convertToDataURLviaCanvas(url, callback, outputFormat) {
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function () {
        var canvas = document.createElement('CANVAS');
        var ctx = canvas.getContext('2d');
        var dataURL;
        canvas.height = this.height;
        canvas.width = this.width;
        ctx.drawImage(this, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        callback(dataURL);
        canvas = null;
    };
    img.src = url;
}

