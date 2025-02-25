function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
}


let data; // 存储运动状态的数据（0: 未点击, 1: 点击1次, 2: 点击2次）
let totalClicks = 0;
let startX = 50;
let startY = 50;
let year = 2025;
let cellSize = 20;
let padding = 5;
let cols = 7;
let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// 必须先定义所有被调用的函数
// ================= 函数定义开始 =================
function loadData() {
  let dataString = localStorage.getItem("heatmapData");
  data = dataString ? JSON.parse(dataString) : null;
}

function setup() {
  createCanvas(900, 630);
  data = new Array(12).fill().map(() => new Array(31).fill(0));
  loadData();
  calculateTotalClicks();
}

function draw() {
  background("#9DFFD4");
  
  // 显示统计信息
  fill("#FF89B6");
  textSize(10);
  textAlign(LEFT, TOP);
  text(`Total Clicks: ${totalClicks}`, 50, 10);
  
  drawHeatmap(); // 现在可以正确调用
}

// 核心修复：正确定义 drawHeatmap 函数
function drawHeatmap() {
  let monthWidth = (cellSize + padding) * cols + 30;
  let monthHeight = (cellSize + padding) * 6 + 50;

  for (let month = 0; month < 12; month++) {
    let x = startX + (month % 4) * monthWidth;
    let y = startY + floor(month / 4) * monthHeight;

    // 绘制月份标签
    fill("#FF58C2");
    textSize(22);
    text(getMonthName(month), x, y - 22);

    for (let day = 1; day <= daysInMonth[month]; day++) {
      let row = floor((day - 1) / cols);
      let col = (day - 1) % cols;
      let cellX = x + col * (cellSize + padding);
      let cellY = y + row * (cellSize + padding);

      // 修复颜色显示逻辑
      if (data[month][day - 1] === 1) {
        fill("#FF89B6");
      } else if (data[month][day - 1] === 2) {
        fill("#DB266B");
      } else {
        fill("#CCCCCC"); // 将未点击状态改为灰色
      }

      // 绘制日期块
      stroke(200);
      rect(cellX, cellY, cellSize, cellSize);

      // 显示日期数字
      fill(0);
      textSize(10);
      text(day, cellX + 2, cellY + 10);
    }
  }
}

function mousePressed() {
  let monthWidth = (cellSize + padding) * cols + 30;
  let monthHeight = (cellSize + padding) * 6 + 50;
  let updated = false;

  for (let month = 0; month < 12; month++) {
    let x = startX + (month % 4) * monthWidth;
    let y = startY + floor(month / 4) * monthHeight;

    for (let day = 1; day <= daysInMonth[month]; day++) {
      let row = floor((day - 1) / cols);
      let col = (day - 1) % cols;
      let cellX = x + col * (cellSize + padding);
      let cellY = y + row * (cellSize + padding);

      // 修复点击检测逻辑
      if (mouseX > cellX && mouseX < cellX + cellSize && 
          mouseY > cellY && mouseY < cellY + cellSize) {
        data[month][day - 1] = (data[month][day - 1] + 1) % 3;
        updated = true;
      }
    }
  }

  if (updated) {
    saveData();
    calculateTotalClicks();
    redraw(); // 强制重绘画布
  }
}

function saveData() {
  localStorage.setItem("heatmapData", JSON.stringify(data));
}

function calculateTotalClicks() {
  totalClicks = data.flat().reduce((acc, val) => acc + val, 0);
}

function getMonthName(month) {
  // 返回月份名称
  let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return monthNames[month];
}

function drawHeatmap() {
  let monthWidth = (cellSize + padding) * cols + 30;
  let monthHeight = (cellSize + padding) * 6 + 50;

  for (let month = 0; month < 12; month++) {
    let x = startX + (month % 4) * monthWidth;
    let y = startY + floor(month / 4) * monthHeight;

    fill("#FF58C2");
    textSize(18);
    text(getMonthName(month), x, y - 24);

    for (let day = 1; day <= daysInMonth[month]; day++) {
      let row = floor((day - 1) / cols);
      let col = (day - 1) % cols;
      let cellX = x + col * (cellSize + padding);
      let cellY = y + row * (cellSize + padding);

      // 设置圆角矩形
      rectMode(CORNER);
      let cornerRadius = 3; // 圆角半径

      // 根据状态设置颜色
      if (data[month][day - 1] === 1) {
        fill("#FF89B6");
      } else if (data[month][day - 1] === 2) {
        fill("#DB266B");
      } else {
        fill("#CCCCCC");
      }

      // 绘制圆角矩形
      rect(cellX, cellY, cellSize, cellSize, cornerRadius);

      // 根据状态设置文字颜色
      if (data[month][day - 1] === 0) {
        fill("#FFFFFF"); // 灰色格子时文字白色
      } else {
        fill("#FFFFFF"); // 点击后保持文字白色
      }
      
      noStroke();
      textSize(10);
      textAlign(LEFT, TOP);
      text(day, cellX + 2, cellY + 2); // 调整文字位置
    }
  }
}
