var measurectx = null;

function fontRemoveFormat(font, format) {
    var fontElements = font.split(' ');

    var index = fontElements.indexOf(format);

    if (index > -1) {
        fontElements.splice(index, 1);
    }

    return fontElements.join(' ');
}

function fontAddFormat(font, format) {
    var fontElements = font.split(' ');

    var index = fontElements.indexOf(format);

    if (index === -1) {
        fontElements.unshift(format);
    }

    return fontElements.join(' ');
}

function fontToggleFormat(font, bold, italic) {
    newFont = font;
    if (bold) {
        newFont = fontAddFormat(newFont, "bold");
    } else {
        newFont = fontRemoveFormat(newFont, "bold");
    }

    if (italic) {
        newFont = fontAddFormat(newFont, "italic");
    } else {
        newFont = fontRemoveFormat(newFont, "italic");
    }

    return newFont;
}

function tokenMeasure(token) {
    measurectx.save();
    measurectx.textAlign = "start";
    measurectx.font = token.Format.FontCalculated;
    var metrics = measurectx.measureText(token.Text);
    measurectx.restore();

    return metrics.width;
}

function tokenizeFormat(font, bold, italic) {
    this.Font = font;
    this.Bold = bold;
    this.Italic = italic;
    this.FontCalculated = fontToggleFormat(font, bold, italic);
}

function tokenizeToken(text, tokenFormat, tokenWidth) {
    this.Text = text;
    this.Format = tokenFormat;
    this.Width = tokenWidth;
}

function tokenizeParagraph(tokens) {
    this.Tokens = tokens;
}

function tokenizeTextData(paragraphs) {
    this.Paragraphs = paragraphs;
}

function tokenizeIsBold(font, bold) {
    return bold || font.includes('bold');
}

function tokenizeIsItalic(font, italic) {
    return italic || font.includes('italic');
}

function tokenizePushToken(token, font, bold, italic, paragraph) {
    if (token === null || token === undefined || token === '') {
        return;
    }

    var tokenFormat = new tokenizeFormat(font, tokenizeIsBold(font, bold), tokenizeIsItalic(font, italic));
    var textToken = new tokenizeToken(token, tokenFormat, 0);
    textToken.Width = tokenMeasure(textToken);
    paragraph.Tokens.push(textToken);
}

function tokenizeText(text, font, context) {
    measurectx = context;

    var token = '';

    var bold = false;
    var italic = false;

    var paragraph = new tokenizeParagraph([]);
    var textData = new tokenizeTextData([paragraph]);

    var i = 0;
    while (i < text.length) {
        var ch = text[i];

        switch (ch) {
            case ' ':
                token = token + ch;
                tokenizePushToken(token, font, bold, italic, paragraph);
                token = '';
                break;
            case '\n':
                tokenizePushToken(token, font, bold, italic, paragraph);
                token = '';

                paragraph = new tokenizeParagraph([]);
                textData.Paragraphs.push(paragraph);
                break;
            case '*':
                tokenizePushToken(token, font, bold, italic, paragraph);
                token = ch;

                //***xyz
                while (i + 1 < text.length && text[i + 1] === '*') {
                    i++
                    ch = text[i];
                    token = token + ch;
                }

                if (token === '***') {
                    bold = !bold;
                    italic = !italic;
                }
                else if (token === '**') {
                    bold = !bold;
                }
                else if (token === '*') {
                    italic = !italic;
                }
                else { //treat **** as a string
                    tokenizePushToken(token, font, bold, italic, paragraph);
                }
                token = '';
                break;
            default:
                token = token + ch;

                if (i + 1 === text.length) {
                    tokenizePushToken(token, font, bold, italic, paragraph);
                    token = '';
                }
                break;
        }

        i++;
    }

    return textData;
}

function drawTokens(context, tokenData, x, y, maxWidth, lineHeight) {
    if (tokenData === null || tokenData === undefined)
        return;

    var centerText = context.textAlign === "center";

    context.save();
    textAlign = "start";
    var yPos = y;
    for (var p = 0; p < tokenData.Paragraphs.length; p++) {
        var paragraph = tokenData.Paragraphs[p];

        var tokenLine = [];
        var lineWidth = 0;
        for (var t = 0; t < paragraph.Tokens.length; t++) {
            var token = paragraph.Tokens[t];

            if (lineWidth + token.Width >= maxWidth) {
                //draw line
                drawTokenLine(context, tokenLine, x, yPos, lineWidth, centerText);

                //clear line
                lineWidth = 0;
                tokenLine = [];
                yPos += lineHeight;
            }

            lineWidth += token.Width;
            tokenLine.push(token);
        }
        if (tokenLine.length > 0) {
            drawTokenLine(context, tokenLine, x, yPos, lineWidth, centerText);
        }

        yPos += lineHeight;
    }
    context.restore();
}

function drawTokenLine(context, tokenLine, x, y, lineWidth, centerText) {
    var xPos = x;
    if (centerText) {
        xPos -= (lineWidth / 2);
    }
    for (var t = 0; t < tokenLine.length; t++) {
        var token = tokenLine[t];

        context.textAlign = "start";
        context.font = token.Format.FontCalculated;
        context.fillText(token.Text, xPos, y);

        xPos += token.Width;
    }
}