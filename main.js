var downloadImageButton = document.getElementById("downloadImageButton");
var downloadDataFileButton = document.getElementById("downloadDataFileButton");
var resetToDefautsButton = document.getElementById("resetToDefautsButton");

var canvasWidth = c.width;
var canvasHeight = c.height;

function frameProperties(x, y, width, height, thickness, lineColor, fillColor, cornerRadius) {
    this.X = x;
    this.Y = y;
    this.Width = width;
    this.Height = height;
    this.Thickness = thickness;
    this.LineColor = lineColor
    this.FillColor = fillColor;
    this.CornerRadius = cornerRadius;
}

var DEFAULT_CARD_POSITIONOFFSET = 2;
var DEFAULT_CARD_CORNERRADIUS = 15;
var DEFAULT_CARD_THICKNESS = 2;
var DEFAULT_PIC_CORNERRADIUS = 0;
var DEFAULT_PIC_THICKNESS = 1;
var DEFAULT_LINE_COLOR = "#000000";
var DEFAULT_FILL_COLOR = "#FFFFFF";
var DEFAULT_TITLE = "Title";
var DEFAULT_TEXT = "";
var DEFAULT_PIC_WIDTH = 220;
var DEFAULT_PIC_HEIGHT = 155;
var DEFAULT_PIC_Y = 55;
var DEFAULT_PIC_OFFSET_X = 0;
var DEFAULT_PIC_OFFSET_Y = 0;
var DEFAULT_TITLE_X = canvasWidth / 2;
var DEFAULT_TITLE_Y = 37;
var DEFAULT_TITLE_FONT = "bold italic 22px Sylfaen";
var DEFAULT_TEXT_COLOR = "#000000";
var DEFAULT_TEXT_FONT = "18px Sitka";
var DEFAULT_TEXT_X = canvasWidth / 2;
var DEFAULT_TEXT_Y = 240;
var DEFAULT_TEXT_WIDTH = 250;
var DEFAULT_TEXT_HEIGHT = 18;
var DEFAULT_PIC_URL = "";

function getCenterPictureX(cardWidth, picWidth, cardX) {
    return (cardWidth / 2) - (picWidth / 2) + cardX;
}

function CardProperties() {
    this.CardFrame = new frameProperties(DEFAULT_CARD_POSITIONOFFSET, DEFAULT_CARD_POSITIONOFFSET, canvasWidth - (DEFAULT_CARD_POSITIONOFFSET * 2), canvasHeight - (DEFAULT_CARD_POSITIONOFFSET * 2), DEFAULT_CARD_THICKNESS, DEFAULT_LINE_COLOR, DEFAULT_FILL_COLOR, DEFAULT_CARD_CORNERRADIUS);
    this.PicFrame = new frameProperties(getCenterPictureX(this.CardFrame.Width, DEFAULT_PIC_WIDTH, this.CardFrame.X), this.CardFrame.Y + DEFAULT_PIC_Y, DEFAULT_PIC_WIDTH, DEFAULT_PIC_HEIGHT, DEFAULT_PIC_THICKNESS, DEFAULT_LINE_COLOR, DEFAULT_FILL_COLOR, DEFAULT_PIC_CORNERRADIUS);

    this.Title = DEFAULT_TITLE;
    this.Text = DEFAULT_TEXT;
    this.CenterPic = true;
    this.StretchPic = true;
    this.PicOffsetX = DEFAULT_PIC_OFFSET_X;
    this.PicOffsetY = DEFAULT_PIC_OFFSET_Y;
    this.TitleX = DEFAULT_TITLE_X;
    this.TitleY = DEFAULT_TITLE_Y;
    this.TitleFont = DEFAULT_TITLE_FONT;
    this.TextColor = DEFAULT_TEXT_COLOR;
    this.TextFont = DEFAULT_TEXT_FONT;
    this.TextX = DEFAULT_TEXT_X;
    this.TextY = DEFAULT_TEXT_Y;
    this.TextWidth = DEFAULT_TEXT_WIDTH;
    this.TextHeight = DEFAULT_TEXT_HEIGHT;
    this.FileData64 = null;
}

function copyCardProperties(sourceCardProperties, destinationCardProperties) {
    destinationCardProperties.CardFrame = sourceCardProperties.CardFrame;
    destinationCardProperties.PicFrame = sourceCardProperties.PicFrame;
    destinationCardProperties.Title = sourceCardProperties.Title;
    destinationCardProperties.Text = sourceCardProperties.Text;
    destinationCardProperties.CenterPic = sourceCardProperties.CenterPic;
    destinationCardProperties.StretchPic = sourceCardProperties.StretchPic;
    destinationCardProperties.PicOffsetX = sourceCardProperties.PicOffsetX;
    destinationCardProperties.PicOffsetY = sourceCardProperties.PicOffsetY;
    destinationCardProperties.TitleX = sourceCardProperties.TitleX;
    destinationCardProperties.TitleY = sourceCardProperties.TitleY;
    destinationCardProperties.TitleFont = sourceCardProperties.TitleFont;
    destinationCardProperties.TextColor = sourceCardProperties.TextColor;
    destinationCardProperties.TextFont = sourceCardProperties.TextFont;
    destinationCardProperties.TextX = sourceCardProperties.TextX;
    destinationCardProperties.TextY = sourceCardProperties.TextY;
    destinationCardProperties.TextWidth = sourceCardProperties.TextWidth;
    destinationCardProperties.TextHeight = sourceCardProperties.TextHeight;
    destinationCardProperties.FileData64 = sourceCardProperties.FileData64;
}

var cardProperties = new CardProperties();

function downloadImage() {
    var link = document.createElement('a');
    link.download = cardProperties.Title + '_cardimage.png';
    link.href = GetImageDataFromRenderer();
    link.dispatchEvent(new MouseEvent(`click`, { bubbles: true, cancelable: true, view: window }));
}

function downloadCardData() {
    var fileName = cardProperties.Title + '_carddata.json';
    downloadJsonFromObject(cardProperties, fileName);
}

function loadCardFromFile(fileObj, callback) {
    if (fileObj.files === null || fileObj.files.length === 0) {
        return;
    }

    var reader = new FileReader();

    reader.onload = function (event) {
        var jsonObj = JSON.parse(event.target.result);

        copyCardProperties(jsonObj, cardProperties);

        callback();
    }

    reader.readAsText(fileObj.files[0]);
}

var titleText = document.getElementById("titleText");
var cardText = document.getElementById("cardText");
var centerPic = document.getElementById("centerPic");
var stretchPic = document.getElementById("stretchPic");
var picOffsetX = document.getElementById("picOffsetX");
var picOffsetY = document.getElementById("picOffsetY");
var cardBorderColor = document.getElementById("cardBorderColor");
var cardBorderThickness = document.getElementById("cardBorderThickness");
var cardFillColor = document.getElementById("cardFillColor");
var picWidth = document.getElementById("picWidth");
var picHeight = document.getElementById("picHeight");
var picX = document.getElementById("picX");
var picY = document.getElementById("picY");
var textColor = document.getElementById("textColor");
var titleX = document.getElementById("titleX");
var titleY = document.getElementById("titleY");
var titleFont = document.getElementById("titleFont");
var textX = document.getElementById("textX");
var textY = document.getElementById("textY");
var textFont = document.getElementById("textFont");
var textWidth = document.getElementById("textWidth");
var textHeight = document.getElementById("textHeight");
var fileBlob = document.getElementById("fileBlob");
var cardDataBlob = document.getElementById("cardDataBlob");

titleText.addEventListener("keyup", function (ev) {
    cardProperties.Title = titleText.value;
});
cardText.addEventListener("keyup", function (ev) {
    cardProperties.Text = cardText.value;
});
centerPic.addEventListener("change", function (ev) {
    cardProperties.CenterPic = centerPic.checked;

    if (centerPic.checked === true) {
        updatePicXToCentered();
    }
});
stretchPic.addEventListener("change", function (ev) {
    cardProperties.StretchPic = stretchPic.checked;
});
picOffsetX.addEventListener("change", function (ev) {
    cardProperties.PicOffsetX = Number(picOffsetX.value);
});
picOffsetY.addEventListener("change", function (ev) {
    cardProperties.PicOffsetY = Number(picOffsetY.value);
});
cardBorderColor.addEventListener("change", function (ev) {
    cardProperties.CardFrame.LineColor = cardBorderColor.value;
});
cardBorderThickness.addEventListener("change", function (ev) {
    cardProperties.CardFrame.Thickness = Number(cardBorderThickness.value);
});
cardFillColor.addEventListener("change", function (ev) {
    cardProperties.CardFrame.FillColor = cardFillColor.value;
});
fileBlob.addEventListener("change", function (ev) {
    fileBlobObj = ev.target.files[0];

    if (validFileBlob(fileBlobObj)) {
        var dataUrl = URL.createObjectURL(fileBlobObj);
        convertToDataURLviaCanvas(dataUrl, function (base64Img) {
            cardProperties.FileData64 = base64Img;
        });
    }

});
picWidth.addEventListener("change", function (ev) {
    cardProperties.PicFrame.Width = Number(picWidth.value);

    if (cardProperties.CenterPic) {
        updatePicXToCentered();
    }
});
picHeight.addEventListener("change", function (ev) {
    cardProperties.PicFrame.Height = Number(picHeight.value);
});
picX.addEventListener("change", function (ev) {
    if (cardProperties.CenterPic) {
        updatePicXToCentered();
    } else {
        cardProperties.PicFrame.X = Number(picX.value);
    }
});
picY.addEventListener("change", function (ev) {
    cardProperties.PicFrame.Y = Number(picY.value);
});
textColor.addEventListener("change", function (ev) {
    cardProperties.TextColor = textColor.value;
});
titleX.addEventListener("change", function (ev) {
    cardProperties.TitleX = Number(titleX.value);
});
titleY.addEventListener("change", function (ev) {
    cardProperties.TitleY = Number(titleY.value);
});
titleFont.addEventListener("change", function (ev) {
    cardProperties.TitleFont = titleFont.value;
});
textX.addEventListener("change", function (ev) {
    cardProperties.TextX = Number(textX.value);
});
textY.addEventListener("change", function (ev) {
    cardProperties.TextY = Number(textY.value);
});
textFont.addEventListener("change", function (ev) {
    cardProperties.TextFont = textFont.value;
});
textWidth.addEventListener("change", function (ev) {
    cardProperties.TextWidth = Number(textWidth.value);
});
textHeight.addEventListener("change", function (ev) {
    cardProperties.TextHeight = Number(textHeight.value);
});

downloadImageButton.addEventListener("click", function (ev) {
    downloadImage();
});
downloadDataFileButton.addEventListener("click", function (ev) {
    downloadCardData();
});
resetToDefautsButton.addEventListener("click", function (ev) {
    resetToDefaults();
    updateControlsFromProperties();
});
cardDataBlob.addEventListener("change", function (ev) {
    loadCardFromFile(cardDataBlob, function () {
        updateControlsFromProperties();
    });
});

function updatePicXToCentered() {
    cardProperties.PicFrame.X = getCenterPictureX(cardProperties.CardFrame.Width, cardProperties.PicFrame.Width, cardProperties.CardFrame.X);
    updateControlsFromProperties();
}

function resetToDefaults() {
    var cardProperties_new = new CardProperties();

    copyCardProperties(cardProperties_new, cardProperties);
}

function updateControlsFromProperties() {
    titleText.value = cardProperties.Title;
    cardText.value = cardProperties.Text;
    centerPic.checked = cardProperties.CenterPic;
    stretchPic.checked = cardProperties.StretchPic;
    picOffsetX.value = cardProperties.PicOffsetX;
    picOffsetY.value = cardProperties.PicOffsetY;
    cardBorderColor.value = cardProperties.CardFrame.LineColor;
    cardBorderThickness.value = cardProperties.CardFrame.Thickness;
    cardFillColor.value = cardProperties.CardFrame.FillColor;
    picWidth.value = cardProperties.PicFrame.Width;
    picHeight.value = cardProperties.PicFrame.Height;
    picX.value = cardProperties.PicFrame.X;
    picY.value = cardProperties.PicFrame.Y;
    textColor.value = cardProperties.TextColor;
    titleX.value = cardProperties.TitleX;
    titleY.value = cardProperties.TitleY;
    titleFont.value = cardProperties.TitleFont;
    textX.value = cardProperties.TextX;
    textY.value = cardProperties.TextY;
    textFont.value = cardProperties.TextFont;
    textWidth.value = cardProperties.TextWidth;
    textHeight.value = cardProperties.TextHeight;
}

updateControlsFromProperties();

StartRenderLoop(cardProperties);