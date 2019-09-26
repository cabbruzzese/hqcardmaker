var c = document.getElementById("drawingCanvas");
var dc_ctx = c.getContext("2d");
var currentImage = null;
var currentUrl = "";

function validFileBlob(fileBlob) {
    if (fileBlob === null || fileBlob === undefined) {
        return false;
    }

    return true;
}

function validFileData64(fileData64) {
    if (fileData64 === null || fileData64 === undefined) {
        return false;
    }

    if (!fileData64.startsWith("data:image/png;base64,")) {
        return false;
    }

    return true;
}

function loadDrawImageFileDataURI(fileData64) {
    if (!validFileData64(fileData64)) {
        return;
    };

    if (currentUrl === fileData64) {
        return;
    }

    var imgCallback = function (ev) {
        currentImage = ev.target;
    };

    var loadingImage = new Image;
    loadingImage.setAttribute('crossOrigin', 'anonymous');
    loadingImage.onload = imgCallback;
    currentUrl = fileData64;
    loadingImage.src = currentUrl;
}

function drawImageFromCardUrl(cardProperties) {
    loadDrawImageFileDataURI(cardProperties.FileData64);

    if (currentImage !== null && IsImageLoaded(currentImage)) {
        if (cardProperties.StretchPic) {
            dc_ctx.drawImage(currentImage, cardProperties.PicFrame.X, cardProperties.PicFrame.Y, cardProperties.PicFrame.Width, cardProperties.PicFrame.Height);
        }
        else {
            var offsetX = cardProperties.PicOffsetX;
            var offsetY = cardProperties.PicOffsetY;
            var srcWidth = currentImage.naturalWidth;
            var srcHeight = currentImage.naturalHeight;
            dc_ctx.save();
            dc_ctx.rect(cardProperties.PicFrame.X, cardProperties.PicFrame.Y, cardProperties.PicFrame.Width, cardProperties.PicFrame.Height);
            dc_ctx.stroke();
            dc_ctx.clip();
            dc_ctx.drawImage(currentImage, offsetX, offsetY, srcWidth, srcHeight, cardProperties.PicFrame.X, cardProperties.PicFrame.Y, srcWidth, srcHeight);
            dc_ctx.restore();
        }
    }
}

function drawFrame(cardFrame) {
    dc_ctx.save();
    dc_ctx.strokeStyle = cardFrame.LineColor;
    dc_ctx.fillStyle = cardFrame.FillColor;
    dc_ctx.lineWidth = cardFrame.Thickness;
    roundRect(dc_ctx, cardFrame.X, cardFrame.Y, cardFrame.Width, cardFrame.Height, cardFrame.CornerRadius, true, true);
    dc_ctx.restore();
}

function drawTitle(text, font, x, y, color, isCenter) {
    dc_ctx.save();
    dc_ctx.fillStyle = color;
    dc_ctx.font = font;
    if (isCenter) {
        dc_ctx.textAlign = "center";
    }
    dc_ctx.fillText(text, x, y);
    dc_ctx.restore();
}

function drawText(text, font, x, y, color, isCenter, width, height) {
    dc_ctx.save();
    dc_ctx.fillStyle = color;
    dc_ctx.font = font;
    if (isCenter) {
        dc_ctx.textAlign = "center";
    }
    wrapText(dc_ctx, text, x, y, width, height);
    dc_ctx.restore();
}

function drawTitleAndText(cardProperties) {
    drawTitle(cardProperties.Title, cardProperties.TitleFont, cardProperties.TitleX, cardProperties.TitleY, cardProperties.TextColor, true);
    drawText(cardProperties.Text, cardProperties.TextFont, cardProperties.TextX, cardProperties.TextY, cardProperties.TextColor, true, cardProperties.TextWidth, cardProperties.TextHeight);
}

function RenderDrawingCanvas(cardProperties) {
    dc_ctx.clearRect(0, 0, c.width, c.height);
}

function RenderFrame(cardProperties) {
    RenderDrawingCanvas(cardProperties);

    drawFrame(cardProperties.CardFrame);
    drawFrame(cardProperties.PicFrame);

    if (validFileData64(cardProperties.FileData64)) {
        drawImageFromCardUrl(cardProperties);
    }

    drawTitleAndText(cardProperties);
}

function StartRenderLoop(cardProperties) {
    setInterval(RenderFrame, 33, cardProperties);
}

function GetImageDataFromRenderer() {
    var imageData = c.toDataURL("image/png");
    return imageData;
}