async function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(3);
  background(30);
  colorMode(HSB);


  let bgColorA = new NYColor(mainHue, random(10, 50), random(10, 40));
  let bgColorB = new NYColor(mainHue, random(10, 50), random(10, 60));
  NYRect(0, 0, width, height, bgColorA, bgColorB);

  await sleep(1);

  // blendMode(MULTIPLY);
  let rowsCount = floor(random(3, 12));
  let rowHeightStep = (height * 0.8) / rowsCount;

  let lastBlocks = [];
  let nowBlocks = [];

  let lastNodes = [];
  let nowNodes = [];

  baseBri = 30;

  for (let r = 0; r < rowsCount; r++) {
    let maxHeight = height - r * rowHeightStep;
    let xCount = floor(random(3, 6));
    let xRatios = processWidthRatios(xCount);
    let startX = 0;

    if (r % 2 == 0) {
      startX = width - xRatios[0] * width;
    }

    mainHue += random(-30, 30);
    baseBri = random(30, 60);
    baseSat = random(30, 60);

    for (let x = 0; x < xCount; x++) {
      let buildingWidth = xRatios[x] * width;
      let buildingHeight = random(0.4, 1.0) * maxHeight;

      let xPos = startX;
      let yPos = height - buildingHeight;

      nowBlocks = createBlocks(xPos, yPos, buildingWidth, buildingHeight);

      for (let i = 0; i < nowBlocks.length; i++) {
        nowBlocks[i].createNodes();
        nowBlocks[i].drawRoomAndGetNodes();

        for (let j = 0; j < nowBlocks[i].nodes.length; j++) {
          nowNodes.push(nowBlocks[i].nodes[j]);
        }
      }
      await sleep(100);

      // draw from right to left
      if (r % 2 == 0) {
        startX -= buildingWidth;
      }
      // left to right
      else {
        startX += buildingWidth;
      }

      if (lastNodes.length != 0) {
        drawRandomConnections(lastNodes, nowNodes);
        await sleep(1);
      }

      lastNodes = nowNodes;
      nowNodes = [];
    }
  }
}

function createBlocks(_x, _y, _width, _height, _depth = 0) {
  let isSplit = false;

  if (_depth == 0)
    isSplit = true;
  else if (random() < 0.8)
    isSplit = true;

  if (_width < 50 || _height < 50)
    isSplit = false;

  if (isSplit) {

    if (random() < 0.5) {
      let splitRatio = random(0.3, 0.7);
      let rectA_X = _x;
      let rectA_Y = _y;
      let rectA_Width = _width * splitRatio;
      let rectA_Height = _height;

      let rectB_X = _x + _width * splitRatio;
      let rectB_Y = _y;
      let rectB_Width = _width * (1 - splitRatio);
      let rectB_Height = _height;

      // add some randomness
      if (random() < 0.2) {
        rectA_Width *= random(0.9, 1.1);
        rectA_Height *= random(0.9, 1.1);
        rectB_Width *= random(0.9, 1.1);
        rectB_Height *= random(0.9, 1.1);

        rectA_X += random(-0.025, 0.025) * rectA_Width;
        rectA_Y += random(-0.025, 0.025) * rectA_Height;
        rectB_X += random(-0.025, 0.025) * rectB_Width;
        rectB_Y += random(-0.025, 0.025) * rectB_Height;
      }

      let blocksA = createBlocks(rectA_X, rectA_Y, rectA_Width, rectA_Height, _depth + 1);
      let blocksB = createBlocks(rectB_X, rectB_Y, rectB_Width, rectB_Height, _depth + 1);

      return blocksA.concat(blocksB);
    }
    else {
      let splitRatio = random(0.2, 0.8);
      let rectA_X = _x;
      let rectA_Y = _y;
      let rectA_Width = _width;
      let rectA_Height = _height * splitRatio;

      let rectB_X = _x;
      let rectB_Y = _y + _height * splitRatio;
      let rectB_Width = _width;
      let rectB_Height = _height * (1 - splitRatio);

      // add some randomness
      if (random() < 0.2) {
        rectA_Width *= random(0.9, 1.1);
        rectA_Height *= random(0.9, 1.1);
        rectB_Width *= random(0.9, 1.1);
        rectB_Height *= random(0.9, 1.1);

        rectA_X += random(-0.025, 0.025) * rectA_Width;
        rectA_Y += random(-0.025, 0.025) * rectA_Height;
        rectB_X += random(-0.025, 0.025) * rectB_Width;
        rectB_Y += random(-0.025, 0.025) * rectB_Height;
      }

      let blocksA = createBlocks(rectA_X, rectA_Y, rectA_Width, rectA_Height, _depth + 1);
      let blocksB = createBlocks(rectB_X, rectB_Y, rectB_Width, rectB_Height, _depth + 1);

      return blocksA.concat(blocksB);
    }
  }
  else {
    let newBlock = new NYBlock(_x, _y, _width, _height);
    newBlock.colorA = NYRandomColor();
    newBlock.colorB = NYRandomColor();

    return [newBlock];
  }

}

function processWidthRatios(_xCount) {
  let resultRatios = [];
  let totalSum = 0.0;

  for (let i = 0; i < _xCount; i++) {
    let randomRatio = random(1.0, 4.0);
    resultRatios.push(randomRatio);

    totalSum += randomRatio;
  }

  // normalize
  for (let i = 0; i < resultRatios.length; i++) {
    resultRatios[i] /= totalSum;
  }

  return resultRatios;
}

function shaffleArray(_array) {

  for (let i = 0; i < _array.length; i++) {
    randomIndex = floor(random(i, _array.length));
    if (randomIndex == i)
      continue;

    let temp = _array[i];
    _array[i] = _array[randomIndex];
    _array[randomIndex] = temp;
  }

}

function sortNodesUpDown(_nodes) {
  _nodes.sort(function (a, b) {
    if(a.y < b.y)
      return -1;
    else if(a.y > b.y)
      return 1;
    else
      return 0;
  });
}

function drawRandomConnections(_nodesA, _nodesB) {
  let connections = [];

  // shaffleArray(_nodesA);
  // shaffleArray(_nodesB);

  sortNodesUpDown(_nodesA);
  sortNodesUpDown(_nodesB);

  let drawCount = min(_nodesA.length, _nodesB.length);

  for (let i = 0; i < drawCount; i++) {
    let nodeA = _nodesA[i];
    let nodeB = _nodesB[i];

    connections.push(new Connection(nodeA, nodeB));
  }

  for (let i = 0; i < connections.length; i++) {
    noStroke();
    fill(0);
    // connections[i].drawCurve(random(0.01, 0.1) * height);
    connections[i].drawCurve(random(10, 60));
    // connections[i].drawLinear();
  }
}

function draw() {

}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}