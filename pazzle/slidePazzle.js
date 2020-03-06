var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var size = 6;
var blocks = [];
var blockPadding = 1;
var blockSize = (canvas.width - (size + 1) * blockPadding) / size;
var blockColor = "#DDDDDD";
var blockBlankColor = "#ffffff";
var numbers = [];
var numberColor = "#000000";
var numberClearColor = "#ff0000";
var tempImg = new Image();
var x = 0;
var y = 0;

document.addEventListener("click", clickHandler, false)

function init(){
  tempImg.src = "./inu.png";
  tempImg.width = 550;
  tempImg.height = 550;
}

function makeNumber() {
  for (i = 0; i < size**2; i++) {
    numbers.push(i);
  }
  var a = numbers.length;
  <!-- size分の乱数を生成する -->
  while (a) {
    var j = Math.floor( Math.random() * a );
    var t = numbers[--a];
    numbers[a] = numbers[j];
    numbers[j] = t;
  }
}

function makeBlock() {
  for (var c = 0; c < size; c++) {
    blocks[c] = [];
    for (var r = 0; r < size; r++) {
      blocks[c][r] = { x: 0, y:0, num: 0};
    }
  }
}

function assignBlock(c, r) {
  var n = size * c + r;
  blocks[c][r].x = r * blockSize + (r+1) * blockPadding;
  blocks[c][r].y = c * blockSize + (c+1) * blockPadding;
  blocks[c][r].num = numbers[n];
}

function drawBlock() {
  for (var c = 0; c < size; c++) {
    for (var r = 0; r < size; r++) {
      assignBlock(c, r)
      ctx.beginPath();
      // ブロック描写
      ctx.rect(blocks[c][r].x, blocks[c][r].y, blockSize, blockSize);
      //ctx.drawImage(img,blocks[c][r].x, blocks[c][r].y, blockSize, blockSize);
      if (blocks[c][r].num == 0) {
        ctx.fillStyle = blockBlankColor;
        ctx.fill();
      } else {///////////////////////////////////////////////////////////////////////////////////////////
        ctx.fillStyle = blockColor;
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        y = Math.round((blocks[c][r].num-1) / (size));
        x = (blocks[c][r].num-1) % (size);
        if((blocks[c][r].num-1)%size == (size-1)){
          y -= 1;
        }
        ctx.fill();
        ctx.drawImage(tempImg,(x * blockSize + (x+1) * blockPadding),(y * blockSize + (y+1) * blockPadding),blockSize,blockSize, blocks[c][r].x, blocks[c][r].y, blockSize, blockSize);
        // 数字描写
        ctx.font = "italic 20px Arial";
        ctx.fillStyle = numberColor;
        ctx.textAlign = "center";
        ctx.fillText(blocks[c][r].num, blocks[c][r].x + (blockSize / 2), blocks[c][r].y + (blockSize / 2) + 10);
      }
      ctx.closePath();
    }
  }
  if (!CheckPattern()) {
    numbers = []
    makeNumber();
    drawBlock();
  }
}

function findBlankBlock() {
  for (var c = 0; c < size; c++) {
    for (var r = 0; r < size; r++) {
      if (blocks[c][r].num == 0){
        return blocks[c][r]; // 空きブロックの特定
      }
    }
  }
}

function moveBlock(block1, block2) {
  var x1 = block1.x;
  var y1 = block1.y;
  var x2 = block2.x;
  var y2 = block2.y;
  ctx.beginPath();
  ctx.rect(x1, y1, blockSize, blockSize);
  ctx.fillStyle = blockBlankColor;
  ctx.fill();
  //ctx.drawImage(tempImg,x1, y1, blockSize, blockSize);
  //ctx.drawImage(tempImg,(x * blockSize + (x+1) * blockPadding),(y * blockSize + (y+1) * blockPadding),blockSize,blockSize, x1, y1, blockSize, blockSize);
  ctx.closePath();

  ctx.beginPath();
  ctx.rect(x2, y2, blockSize, blockSize);
  ctx.fillStyle = blockColor;
  ctx.fill();

  y = Math.round((block1.num-1) / (size));
  x = (block1.num-1) % (size);
  if((block1.num-1)%size == (size-1)){
    y -= 1;
  }
  console.log(x,y);
  ctx.drawImage(tempImg,(x * blockSize + (x+1) * blockPadding),(y * blockSize + (y+1) * blockPadding),blockSize,blockSize, x2, y2, blockSize, blockSize);
  ctx.font = "italic 20px Arial";
  ctx.fillStyle = numberColor;
  ctx.textAlign = "center";
  ctx.fillText(block1.num, x2 + (blockSize / 2), y2 + (blockSize / 2) + 10);
  ctx.closePath();
  [block1.num, block2.num] = [block2.num, block1.num];
}

function clickHandler (e) {
  var rect = e.target.getBoundingClientRect();
  var blankBlock = findBlankBlock();
  for (var c = 0; c < size; c++) {
    for (var r = 0; r < size; r++) {
      var n = size * c + r;
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var conditionX = x > blocks[c][r].x && x < blocks[c][r].x + blockSize;
      var conditionY = y > blocks[c][r].y && y < blocks[c][r].y + blockSize;
      if (conditionX && conditionY && blocks[c][r].num != 0) {
        moveCondition1 = ((Math.round(blankBlock.x) == Math.round(blocks[c][r].x - (blockSize + blockPadding))) && (Math.round(blankBlock.y) == Math.round(blocks[c][r].y)));
        moveCondition2 = ((Math.round(blankBlock.x) == Math.round(blocks[c][r].x)) && (Math.round(blankBlock.y) == Math.round(blocks[c][r].y - (blockSize + blockPadding))));
        moveCondition3 = ((Math.round(blankBlock.x) == Math.round(blocks[c][r].x + (blockSize + blockPadding))) && (Math.round(blankBlock.y) == Math.round(blocks[c][r].y)));
        moveCondition4 = ((Math.round(blankBlock.x) == Math.round(blocks[c][r].x)) && Math.round(blankBlock.y) == Math.round(blocks[c][r].y + (blockSize + blockPadding)));
        //console.log(blocks);
        if (moveCondition1 || moveCondition2 || moveCondition3 || moveCondition4) {
          moveBlock(blocks[c][r], blankBlock);
        }
      }
    }
  }
  clearCondition();
}

function setNumberColor(block, color) {
  ctx.beginPath();
  ctx.font = "italic 20px Arial";
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.fillText(block.num, block.x + (blockSize / 2), block.y + (blockSize / 2) + 10);
  ctx.closePath();
}

function clearCondition() {
  var clear = 0
  for (c = 0; c < size; c++) {
    for (r = 0; r < size; r++) {
      var n = size * c + r + 1;
      if (blocks[c][r].num != 0) {
        if (blocks[c][r].num == n) {
          setNumberColor(blocks[c][r], numberClearColor);
          clear += 1;
        } else {
          setNumberColor(blocks[c][r], numberColor);
        }
      }
    }
  }
  if (clear == size**2-1) {
    setTimeout('alert("YOU WIN. CONGURATURATIONS!")', 100);
  }
}
function CheckPattern() {
  var t = [];
  for (c = 0; c < size; c++) {
    t[c] = []
    for (r = 0; r < size; r++) {
      n = size * c + r + 1
      if (t[c][r]) {
        t[c][r].push(n);
      } else {
        t[c][r] = n;
      }
    }
  }
  t[size-1].pop();
  var trust = [];
  for (i = 0; i < size; i++) {
    if (i % 2 == 0) {
      if (size % 2 == 0) {
        trust = trust.concat(t[i].reverse())
      } else {
        trust = trust.concat(t[i]);
      }
    } else {
      if (size % 2 == 0) {
        trust = trust.concat(t[i]);
      } else {
        trust = trust.concat(t[i].reverse())
      }
    }
  }

  var blockArray = [];
  for (c = 0; c < size; c++) {
    for (r = 0; r < size; r++) {
      if (c % 2 == 0) {
        if (size % 2 == 0) {
          blockArray.push(blocks[c][size-r-1].num)
        } else {
          blockArray.push(blocks[c][r].num);
        }
      } else {
        if (size % 2 == 0) {
          blockArray.push(blocks[c][r].num);
        } else {
          blockArray.push(blocks[c][size-r-1].num)
        }
      }
    }
  }
  blockArray = blockArray.filter(n => n != 0);

  var count = 0;
  var n = 0
  while(JSON.stringify(trust) != JSON.stringify(blockArray)) {
    labelW:
    for (i = 0; i < size**2; i++) {
      if (trust[n] == blockArray[i]) {
        count += i - n;
        blockArray = blockArray.filter(k => k != trust[n]);
        blockArray.splice(n, 0, trust[n])
        n++;
        break labelW;
      }
    }
  }
  return count % 2 == 0;
}

function drawField() {
  ctx.beginPath();
  ctx.strokeStyle = "rgb(0, 0, 0)";
  ctx.strokeRect(0, 0, canvas.width, canvas.height)
  ctx.closePath();
}
function make() {
  makeNumber();
  makeBlock();
}
function draw() {
  drawField();
  drawBlock();
  clearCondition();
}
init()
tempImg.addEventListener("load",function(){
  make()
  draw()
});
