## 加载服饰素材策略

### 当前策略
先加载一次，每次切换tab时，选择对应类型数据

### 预期策略
// 当前行为
loadCategory('JACKET'); // 立即加载所有上衣

// 预加载策略
preload('TROUSERS');    // 提前加载裤子分类前5项
preload('ACCESSORIES'); // 提前加载饰品分类前3项

// 当用户点击"裤子"分类时：
if (hasPreloaded('TROUSERS')) {
  showPreloadedItems(); // 立即展示已缓存内容
  loadRestItems();      // 后台加载剩余内容
}

## canvas相关问题


在小程序中，**离屏 Canvas（`wx.createOffscreenCanvas`）** 是一种不直接渲染到页面的画布，它在后台处理图形计算，主要用于**性能优化**和**复杂场景的预处理**。以下是它的核心用途和实际案例：

---

### 一、离屏 Canvas 的核心用途

#### 1. **预渲染复杂图形（减少重复计算）**
   - **场景**：需要频繁绘制复杂图形（如游戏背景、粒子效果），但内容**无需实时更新**。
   - **优势**：将结果缓存到离屏 Canvas，后续直接复制（`drawImage`）到主 Canvas，减少重复渲染开销。
   - **示例**：
     ```javascript
     // 预渲染静态背景到离屏 Canvas
     const offscreen = wx.createOffscreenCanvas({ type: '2d', width: 300, height: 300 });
     const ctx = offscreen.getContext('2d');
     // 绘制复杂背景（耗时操作）
     ctx.fillStyle = 'blue';
     ctx.fillRect(0, 0, 300, 300);
     ctx.drawImage('/images/stars.png', 0, 0);

     // 主 Canvas 中直接复用
     const mainCtx = mainCanvas.getContext('2d');
     mainCtx.drawImage(offscreen, 0, 0); // 快速绘制预渲染内容
     ```

#### 2. **多 Canvas 协作（共享绘图内容）**
   - **场景**：多个可见 Canvas 需要共享同一图形（如分屏游戏、多视图图表）。
   - **优势**：在离屏 Canvas 统一绘制，再分别复制到各个主 Canvas，避免重复计算。
   - **示例**：
     ```javascript
     // 在离屏 Canvas 绘制共享的网格
     const gridCanvas = wx.createOffscreenCanvas({ type: '2d', width: 300, height: 300 });
     const gridCtx = gridCanvas.getContext('2d');
     drawGrid(gridCtx); // 绘制网格

     // 将网格复制到两个主 Canvas
     mainCanvas1.getContext('2d').drawImage(gridCanvas, 0, 0);
     mainCanvas2.getContext('2d').drawImage(gridCanvas, 0, 0);
     ```

#### 3. **后台处理（不影响主线程渲染）**
   - **场景**：需要异步处理图形计算（如滤镜、图像合成），避免阻塞主线程。
   - **优势**：通过 Web Worker 或定时器在后台操作离屏 Canvas，保持主线程流畅。
   - **示例**：
     ```javascript
     // 在 Web Worker 中处理图像滤镜
     const worker = wx.createWorker('workers/filter.js');
     worker.postMessage({
       canvas: offscreenCanvas, // 传递离屏 Canvas
       imagePath: '/images/photo.jpg'
     });

     // worker.js 中处理
     worker.onMessage(({ canvas, imagePath }) => {
       const ctx = canvas.getContext('2d');
       // 异步加载图像并应用滤镜
       wx.getImageInfo({ src: imagePath }).then(res => {
         ctx.drawImage(res.path, 0, 0);
         applyFilter(ctx); // 耗时操作
       });
     });
     ```

---

### 二、实际应用案例

#### 案例 1：游戏中的静态背景
- **问题**：游戏背景包含大量静态元素（如山脉、云层），每帧重绘会浪费性能。
- **解决方案**：预渲染到离屏 Canvas，每帧直接复制到主 Canvas。
  ```javascript
  // 初始化时预渲染
  const bgCanvas = wx.createOffscreenCanvas({ type: '2d', width: 800, height: 600 });
  drawBackground(bgCanvas.getContext('2d'));

  // 游戏循环中快速绘制
  function gameLoop() {
    mainCtx.drawImage(bgCanvas, 0, 0); // 背景
    drawPlayers(mainCtx);             // 动态角色
    requestAnimationFrame(gameLoop);
  }
  ```

#### 案例 2：图表中的动态数据更新
- **问题**：实时数据图表需要频繁重绘，但坐标轴和网格固定不变。
- **解决方案**：将坐标轴预渲染到离屏 Canvas，仅重绘数据部分。
  ```javascript
  // 预渲染坐标轴
  const axisCanvas = wx.createOffscreenCanvas({ type: '2d', width: 300, height: 200 });
  drawAxis(axisCanvas.getContext('2d'));

  // 更新数据时只重绘数据线
  function updateChart(data) {
    mainCtx.clearRect(0, 0, 300, 200);
    mainCtx.drawImage(axisCanvas, 0, 0); // 复制坐标轴
    drawDataLine(mainCtx, data);         // 绘制新数据
  }
  ```

---

### 三、注意事项
1. **兼容性**：部分小程序版本可能不支持 `wx.createOffscreenCanvas`，需测试基础库版本（建议 >= 2.7.0）。
2. **内存管理**：离屏 Canvas 占用内存，处理完成后需及时销毁：
   ```javascript
   offscreenCanvas = null; // 释放引用
   ```
3. **性能权衡**：过度使用离屏 Canvas 可能导致内存增加，需根据场景权衡。

---

### 总结
- **何时使用离屏 Canvas**：
  - 需要 **重复绘制复杂静态内容**。
  - 需在 **多个 Canvas 间共享图形**。
  - 后台处理 **耗时图形操作**（避免卡顿）。
- **性能提升关键**：通过预处理和缓存减少实时计算量。



## 当前预加载资源问题

当前是一次把所有资源都通过PIXI.Asserts加载到内存中，若图片资源过多或过大，导致卡顿
所以使用缓存管理+优先级加载+按需加载