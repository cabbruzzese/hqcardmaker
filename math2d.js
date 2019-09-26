function Point2d(x = 0, y = 0) {
    this.x = x;
    this.y = y;
}

function GetMouseFromCanvas(canvas, ev) {
    var rectangle = canvas.getBoundingClientRect();
    var x = ev.clientX - rectangle.left;
    var y = ev.clientY - rectangle.top;

    return new Point2d(x, y);
}