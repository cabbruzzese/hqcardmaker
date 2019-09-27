/**
 *-------------------------------------------------------------------------------------------------
 * From Tutorial: https://www.html5canvastutorials.com/tutorials/html5-canvas-wrap-text-tutorial/
 *-------------------------------------------------------------------------------------------------
 */
function wrapText(context, text, x, y, maxWidth, lineHeight) {
    var paragraphs = text.split('\n');
    var paragraphY = y;

    for (var p = 0; p < paragraphs.length; p++)
    {        
        var paragraph = paragraphs[p];
        var linesWritten = wrapTextParagraph(context, paragraph, x, paragraphY, maxWidth, lineHeight);

        paragraphY = paragraphY + (lineHeight * linesWritten);
    }
}

function wrapTextParagraph(context, text, x, y, maxWidth, lineHeight) {
    var words = text.split(' ');
    var line = '';
    var linesWritten = 0;

    for (var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + ' ';
        var metrics = context.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            linesWritten++;
            line = words[n] + ' ';
            y += lineHeight;
        }
        else {
            line = testLine;
        }
    }
    context.fillText(line, x, y);
    linesWritten++;

    return linesWritten;
}