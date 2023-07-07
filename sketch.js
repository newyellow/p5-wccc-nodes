async function setup() {
  createCanvas(800, 1000);
  pixelDensity(3);
  background(30);
  colorMode(HSB);


  let bgColorA = new NYColor(mainHue, random(10, 50), random(10, 40));
  let bgColorB = new NYColor(mainHue, random(10, 50), random(10, 60));
  NYRect(0, 0, width, height, bgColorA, bgColorB);

  await sleep(1);

  // blendMode(MULTIPLY);
  let startY = random(0.0, 0.2) * height;
  let stepY = random(0.01, 0.02) * height;

  let lastBlocks = [];
  let nowBlocks = [];

  let lastNodes = [];
  let nowNodes = [];

  baseBri = 10;
  for (let y = startY; y < height; y += stepY) {
    let xPos = random(-0.1, 1.1) * width;
    let yPos = y;

    baseBri += 1;

    let buildingWidth = random(0.05, 0.3) * width;
    let buildingHeight = random(0.1, 0.4) * height;

    xPos -= 0.5 * buildingWidth;
    yPos -= 0.5 * buildingHeight;

    nowBlocks = createBlocks(xPos, yPos, buildingWidth, buildingHeight);

    for (let i = 0; i < nowBlocks.length; i++) {
      nowBlocks[i].createNodes();
      nowBlocks[i].drawRoomAndGetNodes();

      for (let j = 0; j < nowBlocks[i].nodes.length; j++) {
        nowNodes.push(nowBlocks[i].nodes[j]);
      }
    }
    await sleep(1);

    if(lastNodes.length != 0)
    {
      drawRandomConnections(lastNodes, nowNodes);
      await sleep(1);
    }

    lastNodes = nowNodes;
    nowNodes = [];
  }

  // let blocksA = createBlocks(550, 100, 200, 600);
  // let nodesA = [];
  // for (let i = 0; i < blocksA.length; i++) {
  //   blocksA[i].createNodes();
  //   blocksA[i].drawRoomAndGetNodes();

  //   for (let j = 0; j < blocksA[i].nodes.length; j++) {
  //     nodesA.push(blocksA[i].nodes[j]);
  //   }
  // }

  // let blocksB = createBlocks(100, 400, 300, 400);
  // let nodesB = [];
  // for (let i = 0; i < blocksB.length; i++) {
  //   blocksB[i].createNodes();
  //   blocksB[i].drawRoomAndGetNodes();

  //   for (let j = 0; j < blocksB[i].nodes.length; j++) {
  //     nodesB.push(blocksB[i].nodes[j]);
  //   }
  // }

  // drawRandomConnections(nodesA, nodesB);


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

function drawRandomConnections(_nodesA, _nodesB) {
  let connections = [];

  shaffleArray(_nodesA);
  shaffleArray(_nodesB);

  let drawCount = min(_nodesA.length, _nodesB.length);

  for (let i = 0; i < drawCount; i++) {
    let nodeA = _nodesA[i];
    let nodeB = _nodesB[i];

    connections.push(new Connection(nodeA, nodeB));
  }

  for (let i = 0; i < connections.length; i++) {
    noStroke();
    fill(0);
    connections[i].drawCurve(random(0.01, 0.1) * height);
    // connections[i].drawLinear();
  }
}

function draw() {

}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}