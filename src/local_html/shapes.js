// -- header shapes --
function createShape(className, posX, posY) {
    const shape = document.createElement('div');
    shape.classList.add('shape', className);
    shape.style.left = posX + 'px';
    shape.style.top = posY + 'px';
    let test = Math.max(Math.random(), .2)*10;
    if(Math.random() < .5)
        test = -test;
    test += Math.random() * 180;
    shape.style.rotate = test + "deg"
    const size = Math.min(Math.max(.1, Math.random(), .6)) * 100;
    shape.style.width = size + "px";
    shape.style.height = size + "px";
    return shape;
}

function generateRandomShapeClass() {
    let temp = Math.random() < 0.5 ? 'shape-square' : 'shape-triangle';
    if(Math.random() < .5)
        temp = 'shape-circle'
    return temp;
}

function setRandomShapes() {
    const header = document.querySelector('header');

    const headerWidth = header.offsetWidth;
    const headerHeight = header.offsetHeight;
    let positionX = Math.random() * (headerWidth - 50);
    let randomOff = Math.random() * 100;
    let positionY = Math.random() < 0.5 ? headerHeight - randomOff : -randomOff;
    while(positionX < 200) {
        positionX = Math.random() * (headerWidth - 50);
        randomOff = Math.random() * 100;
        positionY = Math.random() < 0.5 ? headerHeight - randomOff : -randomOff;
    }
    const shape = createShape(generateRandomShapeClass(), positionX, positionY);

    header.appendChild(shape);
}

window.addEventListener('load', function() {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)/100;
    for(let i = 0; i < vw; i++)
        setRandomShapes()
});
