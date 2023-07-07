
let mainHue = Math.floor(Math.random() * 360);
let drawNS_X = 0.01;
let drawNS_Y = 0.01;

let lineDensity = 0.6;
let lineThickness = 6;
let lineLength = 12;


function NYRoom(_x, _y, _width, _height, _colorA, _colorB) {

    let nodes = [];

    // has stick
    if (random() < 0.3) {
        nodes = drawStick(_x, _y, _width, _height, _colorA, _colorB);
    }

    NYRect(_x, _y, _width, _height, _colorA, _colorB);

    // has windows
    if (random() < 0.6) {
        let windowType = floor(random(0, 3));
        windowType = 0;

        if (windowType == 0) {
            let windowSizeX = random(3, 12);
            let windowSizeY = random(3, 12);

            if (windowSizeY < 0.1 * _height)
                windowSizeY = 0.1 * _height;

            let windowSpace = max(windowSizeX, windowSizeY) * random(1.4, 3);
            let windowCountX = floor(_width * 0.8 / windowSpace);

            let startX = _x + _width * random(0.04, 0.16);
            let startY = _y + random(0.1, 0.9) * _height;

            for (let i = 0; i < windowCountX; i++) {
                let xPos = startX + i * windowSpace;
                let yPos = startY;

                let whiteColorA = new NYColor(0, 0, 100, 1.0);
                let whiteColorB = new NYColor(0, 0, 100, 1.0);
                // NYRect(xPos, yPos, windowSizeX, windowSizeY, whiteColorA, whiteColorB);
                // fill('white');
                // rect(xPos, yPos, windowSizeX, windowSizeY);
                NYRect(xPos, yPos, windowSizeX, windowSizeY, whiteColorA, whiteColorB);
            }
        }
    }

    return nodes;
}

function NYRect(_x, _y, _width, _height, _colorA, _colorB) {

    // draw vertical lines
    if (random() < 0.5) {
        let lineCountX = floor(_width * lineDensity);
        if (lineCountX == 0)
            lineCountX = 1;

        let lineSpacingX = _width / (lineCountX - 1);
        let lineCountY = floor(_height / lineLength);
        if (lineCountY == 0)
            lineCountY = 1;

        let drawLineLength = _height / (lineCountY);

        let fromColor = _colorA;
        let toColor = _colorB;

        for (let x = 0; x < lineCountX; x++) {
            for (let y = 0; y < lineCountY; y++) {
                let xPos = _x + x * lineSpacingX;
                let yPos = _y + y * drawLineLength;

                let sizeNoise = noise(xPos * drawNS_X, yPos * drawNS_Y);

                let nowColor = NYLerpColor(fromColor, toColor, y / lineCountY);
                let randomizedColor = nowColor.getRandomColor(4, 4, 4);
                randomizedColor.a = 0.8;
                randomizedColor.applyStroke();

                push();
                translate(xPos, yPos);

                strokeWeight(lineThickness * sizeNoise);
                line(0, 0, 0, drawLineLength);
                pop();
            }
        }
    }
    else // draw horizontal lines
    {
        let lineCountX = floor(_width / lineLength);
        if (lineCountX == 0)
            lineCountX = 1;

        let lineCountY = floor(_height * lineDensity);
        if (lineCountY == 0)
            lineCountY = 1;

        let lineSpacingY = _height / (lineCountY - 1);
        let drawLineLength = _width / (lineCountX);

        let fromColor = _colorA;
        let toColor = _colorB;

        for (let y = 0; y < lineCountY; y++) {
            for (let x = 0; x < lineCountX; x++) {
                let xPos = _x + x * drawLineLength;
                let yPos = _y + y * lineSpacingY;

                let sizeNoise = noise(xPos * drawNS_X, yPos * drawNS_Y);

                let nowColor = NYLerpColor(fromColor, toColor, x / lineCountX);
                let randomizedColor = nowColor.getRandomColor(4, 4, 4);
                randomizedColor.a = 0.8;
                randomizedColor.applyStroke();


                push();
                translate(xPos, yPos);

                strokeWeight(lineThickness * sizeNoise);
                line(0, 0, drawLineLength, 0);
                pop();
            }
        }
    }
}

// draw stick according to the drawRoom params
function drawStick(_x, _y, _width, _height, _colorA, _colorB) {
    let stickPosX = _x + random(0.1, 0.9) * _width;
    let stickPosY = _y;

    let stickColor = NYLerpColor(_colorA, _colorB, random(0, 1));
    stickColor.s = random(30, 100);
    stickColor.b = random(6, 24);

    let stickRot = random(-20, 20);
    if (random() < 0.1)
        stickRot = random(-40, 40);

    let stickHeight = random(10, 120);

    return NYStick(stickPosX, stickPosY, random(3, 8), stickHeight, stickRot, stickColor)
}

function NYStick(_x, _y, _width, _height, _angle, _color) {

    let lineCount = floor(_height * lineDensity);

    let poleNodes = [];

    for (let i = 0; i < lineCount; i++) {
        let t = i / (lineCount - 1);

        let xPos = _x + sin(radians(_angle)) * _height * t;
        let yPos = _y - cos(radians(_angle)) * _height * t;

        let widthNoise = noise(xPos * 0.1, yPos * 0.1, 666);
        let nowWidth = widthNoise * _width * (1 - t) + 1;

        // draw
        _color.applyStroke();
        strokeWeight(random(1, 2));

        if (random() < 0.1) {
            let outWidth = nowWidth * random(1.4, 6);

            let x1 = xPos + sin(radians(_angle - 90)) * outWidth * 0.5;
            let y1 = yPos - cos(radians(_angle - 90)) * outWidth * 0.5;

            let x2 = xPos + sin(radians(_angle + 90)) * outWidth * 0.5;
            let y2 = yPos - cos(radians(_angle + 90)) * outWidth * 0.5;

            let nodePosRatioA = random(0.1, 0.4);
            let nodePosRatioB = 1 - nodePosRatioA;

            let nodeAX = lerp(x1, x2, nodePosRatioA);
            let nodeAY = lerp(y1, y2, nodePosRatioA);

            let nodeBX = lerp(x1, x2, nodePosRatioB);
            let nodeBY = lerp(y1, y2, nodePosRatioB);

            poleNodes.push(new NYNode(nodeAX, nodeAY));
            poleNodes.push(new NYNode(nodeBX, nodeBY));


            line(x1, y1, x2, y2);
        }
        else {
            let x1 = xPos + sin(radians(_angle - 90)) * nowWidth * 0.5;
            let y1 = yPos - cos(radians(_angle - 90)) * nowWidth * 0.5;

            let x2 = xPos + sin(radians(_angle + 90)) * nowWidth * 0.5;
            let y2 = yPos - cos(radians(_angle + 90)) * nowWidth * 0.5;


            line(x1, y1, x2, y2);
        }
    }

    return poleNodes;
}

function NYRandomColor(_hueOffset = 0) {

    let resultHue = mainHue + _hueOffset + random(-30, 30);
    let resultSat = random(40, 80);
    let resultBri = random(60, 100);

    if (random() < 0.06) {
        resultSat = 0;
        resultBri = 100;
    }

    resultHue = processHue(resultHue);

    return new NYColor(resultHue, resultSat, resultBri);
}

function NYLerpColor(_colorA, _colorB, _t) {
    let hueA = _colorA.h;
    let hueB = _colorB.h;

    let hueDiff = abs(hueB - hueA);

    if (abs((hueB - 360) - hueA) < hueDiff) {
        hueB -= 360;
    }
    else if (abs((hueB + 360) - hueA) < hueDiff) {
        hueB += 360;
    }

    let satA = _colorA.s;
    let briA = _colorA.b;
    let alphaA = _colorA.a;

    let satB = _colorB.s;
    let briB = _colorB.b;
    let alphaB = _colorB.a;

    let resultHue = lerp(hueA, hueB, _t);
    let resultSat = lerp(satA, satB, _t);
    let resultBri = lerp(briA, briB, _t);
    let resultAlpha = lerp(alphaA, alphaB, _t);

    if (resultHue < 0) {
        resultHue += 360;
    }
    else if (resultHue > 360) {
        resultHue -= 360;
    }

    return new NYColor(resultHue, resultSat, resultBri, resultAlpha);
}

function processHue(_hue) {
    let result = _hue % 360;
    if (result < 0) {
        result += 360;
    }
    return result;
}
