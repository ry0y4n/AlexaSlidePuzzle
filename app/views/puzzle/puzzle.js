var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var size = 3;
var blocks = [];
var blockPadding = 1;
var blockSize = (canvas.width - (size + 1) * blockPadding) / size;
var blockColor = "#DDDDDD";
var blockBlankColor = "#ffffff";
var numbers = [];
var numberColor = "#000000";
var numberClearColor = "#ff0000";
//var opeNum = <%= @opeNum %>

document.addEventListener("click", clickHandler, false);

document.onkeydown = function(e) {
    let keyCode;

    if (e) event = e;

    if (event) {
        if (event.keyCode) {
            keyCode = event.keyCode;
        } else if (event.which) {
            keyCode = event.which;
        }
    }
    keyboardHandler(keyCode);
};

/*
window.onload = function() {
    setTimeout(function(){alexaHandler()}, 1000);
}
*/

function makeNumber() {
    for (i = 0; i < size**2; i++) {
        numbers.push(i);
    }
    var a = numbers.length;
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
            if (blocks[c][r].num == 0) {
                ctx.fillStyle = blockBlankColor;
                ctx.fill();
            } else {
                ctx.fillStyle = blockColor;
                ctx.shadowColor = 'rgba(0,0,0,0.3)';
                ctx.fill();
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
    ctx.closePath();

    ctx.beginPath();
    ctx.rect(x2, y2, blockSize, blockSize);
    ctx.fillStyle = blockColor;
    ctx.fill();

    ctx.font = "italic 20px Arial";
    ctx.fillStyle = numberColor;
    ctx.textAlign = "center";
    ctx.fillText(block1.num, x2 + (blockSize / 2), y2 + (blockSize / 2) + 10);
    ctx.closePath();
    [block1.num, block2.num] = [block2.num, block1.num];
}

function moveCondition(block1, block2, ope) {

    // 0,1,2,3=上,下,左,右
    switch (ope) {
        case 0:
            return ((Math.round(block1.x) == Math.round(block2.x)) && (Math.round(block1.y) == Math.round(block2.y - (blockSize + blockPadding))));
        case 1:
            return ((Math.round(block1.x) == Math.round(block2.x)) && (Math.round(block1.y) == Math.round(block2.y + (blockSize + blockPadding))));
        case 2:
            return ((Math.round(block1.x) == Math.round(block2.x - (blockSize + blockPadding))) && (Math.round(block1.y) == Math.round(block2.y)));
        case 3:
            return ((Math.round(block1.x) == Math.round(block2.x + (blockSize + blockPadding))) && (Math.round(block1.y) == Math.round(block2.y)));

    }
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
                moveCondition0 = moveCondition(blankBlock, blocks[c][r], 0); //上にブランクがあるか
                moveCondition1 = moveCondition(blankBlock, blocks[c][r], 1); //下にブランクがあるか
                moveCondition2 = moveCondition(blankBlock, blocks[c][r], 2); //左にブランクがあるか
                moveCondition3 = moveCondition(blankBlock, blocks[c][r], 3); //右にブランクがあるか
                
                if (moveCondition0 || moveCondition1 || moveCondition2 || moveCondition3) {
                moveBlock(blocks[c][r], blankBlock);
                }
            }
        }
    }
    clearCondition();
}

function alexaHandler () {
    var blankBlock = findBlankBlock();
    for (var c = 0; c < size; c++) {
        for (var r = 0; r < size; r++) {
            if (blocks[c][r].num != 0) {
                var condition = moveCondition(blankBlock, blocks[c][r], opeNum); 
    
                if (condition) {
                    // alert(c + ',' + r + ': blankBlock(' + blankBlock.x + ',' + blankBlock.y + '), blocks[c][r](' + blocks[c][r].x + ',' + blocks[c][r].y + ')');
                    moveBlock(blocks[c][r], blankBlock);
                }
            }
        }
    }
    clearCondition();
}

function asyncAlexaHandler (ope) {
    var blankBlock = findBlankBlock();
    for (var c = 0; c < size; c++) {
        for (var r = 0; r < size; r++) {
            if (blocks[c][r].num != 0) {
                var condition = moveCondition(blankBlock, blocks[c][r], ope); 
    
                if (condition) {
                    // alert(c + ',' + r + ': blankBlock(' + blankBlock.x + ',' + blankBlock.y + '), blocks[c][r](' + blocks[c][r].x + ',' + blocks[c][r].y + ')');
                    moveBlock(blocks[c][r], blankBlock);
                }
            }
        }
    }
    clearCondition();
}

function keyboardHandler(kcode) {
    var blankBlock = findBlankBlock();
    switch(kcode) {
        case 38:
            var keyOpe = 0;
            break;
        case 40:
            var keyOpe = 1;
            break;
        case 37:
            var keyOpe = 2;
            break;
        case 39:
            var keyOpe = 3;
            break;
    }
    for (var c = 0; c < size; c++) {
        for (var r = 0; r < size; r++) {
            if (blocks[c][r].num != 0) {
                var condition = moveCondition(blankBlock, blocks[c][r], keyOpe); 
    
                if (condition) {
                    // alert(c + ',' + r + ': blankBlock(' + blankBlock.x + ',' + blankBlock.y + '), blocks[c][r](' + blocks[c][r].x + ',' + blocks[c][r].y + ')');
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

make()
draw()