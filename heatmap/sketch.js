let data; // 存储运动状态的数据（0: 未点击, 1: 点击1次, 2: 点击2次）
let year = 2025; // 当前年份
let cellSize = 20; // 每个日期块的大小
let padding = 5; // 日期块之间的间距
let cols = 7; // 每周7天
let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; // 2025年每月的天数

function setup() {
  createCanvas(900, 630); // 画面尺寸调整为900x630
  data = new Array(12).fill().map(() => new Array(31).fill(0)); // 初始化数据（12个月，每月最多31天）
  loadData(); // 加载之前保存的数据
}

function draw() {
  background("#9DFFD4"); // 背景颜色
  drawHeatmap(); // 绘制热力图
}

function drawHeatmap() {
  let startX = 50; // 起始x坐标
  let startY = 50; // 起始y坐标
  let monthWidth = (cellSize + padding) * cols + 30; // 每个月的宽度
  let monthHeight = (cellSize + padding) * 6 + 50; // 每个月的高度

  for (let month = 0; month < 12; month++) {
    // 计算当前月的起始坐标
    let x = startX + (month % 4) * monthWidth; // 列偏移
    let y = startY + Math.floor(month / 4) * monthHeight; // 行偏移

    // 绘制月份标签
    fill("#FF58C2");
    textSize(22);
    text(getMonthName(month), x, y - 12);

    for (let day = 1; day <= daysInMonth[month]; day++) {
      let row = Math.floor((day - 1) / cols); // 计算行号
      let col = (day - 1) % cols; // 计算列号

      let cellX = x + col * (cellSize + padding); // 计算x坐标
      let cellY = y + row * (cellSize + padding); // 计算y坐标

      // 根据运动状态设置颜色
      if (data[month][day - 1] == 1) {
        fill("#FF89B6"); // 粉色表示点击1次
      } else if (data[month][day - 1] == 2) {
        fill("#DB266B"); // 深粉色表示点击2次
      } else {
        fill("#FFFFFF"); // 白色表示未点击
        strokeWeight(0); // 无边框
      }

      // 绘制日期块
      rect(cellX, cellY, cellSize, cellSize);

      // 绘制日期标签
      fill("#E8699A");
      textSize(10);
      text(day, cellX + 2, cellY + 10);
    }
  }
}

function mousePressed() {
  let startX = 50; // 起始x坐标
  let startY = 50; // 起始y坐标
  let monthWidth = (cellSize + padding) * cols + 30; // 每个月的宽度
  let monthHeight = (cellSize + padding) * 6 + 50; // 每个月的高度

  for (let month = 0; month < 12; month++) {
    // 计算当前月的起始坐标
    let x = startX + (month % 4) * monthWidth; // 列偏移
    let y = startY + Math.floor(month / 4) * monthHeight; // 行偏移

    for (let day = 1; day <= daysInMonth[month]; day++) {
      let row = Math.floor((day - 1) / cols); // 计算行号
      let col = (day - 1) % cols; // 计算列号

      let cellX = x + col * (cellSize + padding); // 计算x坐标
      let cellY = y + row * (cellSize + padding); // 计算y坐标

      // 判断鼠标是否点击了当前日期块
      if (mouseX > cellX && mouseX < cellX + cellSize && mouseY > cellY && mouseY < cellY + cellSize) {
        data[month][day - 1] = (data[month][day - 1] + 1) % 3; // 切换运动状态（0 -> 1 -> 2 -> 0）
        saveData(); // 保存数据
        console.log("Clicked: " + getMonthName(month) + " " + day); // 打印点击的月份和日期
      }
    }
  }
}

function saveData() {
  // 将数据保存到 localStorage
  let dataString = JSON.stringify(data); // 将数据转换为字符串
  localStorage.setItem("heatmapData", dataString); // 保存到 localStorage
}

function loadData() {
  // 从 localStorage 加载数据
  let dataString = localStorage.getItem("heatmapData"); // 获取保存的数据
  if (dataString) {
    data = JSON.parse(dataString); // 将字符串转换为数组
  }
}

function getMonthName(month) {
  // 返回月份名称
  let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return monthNames[month];
}