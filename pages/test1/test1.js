// 引入 Pixi.js（需适配小程序环境的版本）
import {createPIXI} from "../../libs/pixi.miniprogram"
//某些库或代码可能需要动态执行 JavaScript 代码，而 eval 在严格模式下会被禁用。unsafeEval 可以绕过这一限制。
var unsafeEval = require("../../libs/unsafeEval")
//Spine 是一个 2D 骨骼动画工具，Pixi-Spine 是 Pixi.js 的插件，用于加载和播放 Spine 动画
var installSpine = require("../../libs/pixi-spine")
//Pixi-Animate 是 Pixi.js 的插件，用于加载和播放 Adobe Animate（Flash）导出的动画
var installAnimate = require("../../libs/pixi-animate")
//Live2D 是一个 2D 角色动画技术，通常用于虚拟角色（如 VTuber）。
var live2d = require("../../libs/live2d.min")
//Cubism 是 Live2D 的核心技术，用于处理角色模型和动画。
var Live2DCubismCore = require("../../libs/live2dcubismcore.min")
//Cubism 4 是 Live2D 的最新版本，提供了更强大的功能和性能。
var installCubism4 = require("../../libs/cubism4")
//该插件将 Live2D 集成到 Pixi.js 中，用于在 Pixi.js 中渲染 Live2D 模型。
var installPixiLive2d = require("../../libs/pixi-live2d-display")
//补间动画是一种平滑过渡效果，通常用于对象的移动、缩放、旋转等
var myTween = require("../../libs/myTween")
var PIXI = {dispatchEvent:function(){}};
// 动画定时器


Page({
  // 页面数据
  data: {},
  // Pixi 应用实例
  pixiApp: null, // 存储 Pixi 实例
  stage: null,    // 根容器
  minPIXI:null,
  // 触摸状态标志
  isTouching: false,
  // 获取canvas舞台高度和宽度
  calculateStageSize(){
    const info = wx.getSystemInfoSync();
    const logicalWidth = info.screenWidth / info.pixelRatio;
    const logicalHeight = info.screenHeight / info.pixelRatio;
    // 设定设计稿基准宽度（如 750rpx）
    const designWidth = 750;
    // 计算画布高度（保留小数）
    const canvasHeight = Math.round(designWidth * logicalHeight / logicalWidth);
    // 最终画布尺寸
    const stageWidth = designWidth;
    const stageHeight = canvasHeight;
    return {stageWidth,stageHeight}
  },
  // 小程序事件绑定至pixi
  touchEvent(e) {
    storePIXI.dispatchEvent(e)
  },
    // pixi 事件处理
  baseMapPIXIEvent(stage) {
    stage.on("touchstart", function (e) {
          const global = e.data.global;
          console.log("touchstart-开始移动", global);
    });
    stage.on("touchmove", function (e) {
          const global = e.data.global;
          console.log("touchstart-移动中", global);
    });
    stage.on("pointerup", function (e) {
          const global = e.data.global;
          console.log("touchstart-移动结束", global);
    });
    stage.on("pointertap", function (e) {
          const global = e.data.global;
          console.log("touchstart-点击", global);
    });
  },
  // 页面生命周期 - 页面加载完成
  onReady() {
    this.initPixi();
  },
  // 初始化 Pixi 

    // 初始化 Pixi 
    initPixi() {
      const query = wx.createSelectorQuery();
      query.select('#pixiCanvas').node().exec((res) => {
        const canvas = res[0].node;
        const{stageWidth,stageHeight}=this.calculateStageSize()
        console.log(res)
        const PIXI = createPIXI(canvas,stageWidth);//传入canvas，传入canvas宽度，用于计算触摸坐标比例适配触摸位置
        this.minPIXI=PIXI
        unsafeEval(PIXI);//适配PIXI里面使用的eval函数
        installSpine(PIXI);//注入Spine库
        installAnimate(PIXI);//注入Animate库
        installCubism4(PIXI,Live2DCubismCore);
        installPixiLive2d(PIXI,live2d,Live2DCubismCore);
        // 创建 Pixi 应用 
        this.pixiApp = new PIXI.Application({
          view: canvas,
          width: 750,
          height: 1334,
          resolution: 1,
          antialias: true,
          backgroundColor: 0x7356db,

        });
        // this.baseMapPIXIEvent(this.pixiApp.stage)
        // 创建多级容器 
        this.createContainers(PIXI);
        this.baseMapPIXIEvent(this.pixiApp.stage)
      });
    },

        // pixi 事件处理
    baseMapPIXIEvent(stage) {
      stage.on("touchstart", function (e) {
            const global = e.data.global;
            console.log("touchstart-开始移动", global);
      });
      stage.on("touchmove", function (e) {
            const global = e.data.global;
            console.log("touchstart-移动中", global);
      });
      stage.on("pointerup", function (e) {
            const global = e.data.global;
            console.log("touchstart-移动结束", global);
      });
      stage.on("pointertap", function (e) {
            const global = e.data.global;
            console.log("touchstart-点击", global);
      });
    },




  
    // 创建嵌套容器及子元素 
    createContainers(PIXI) {
      const app = this.pixiApp;

      // stage--->EditableObjecct(parentContainer)---> childContainer(人物) -----> sprite
      this.stage = app.stage;
      
      // 根容器设置
      this.stage.interactive = true;
      this.stage.interactiveChildren = true;
  
      // 父容器
      const parentContainer = new PIXI.Container();
      parentContainer.interactive = true;
      parentContainer.interactiveChildren = true;
      this.stage.addChild(parentContainer);
  
      // 子容器
      const childContainer = new PIXI.Container();
      childContainer.interactive = true;
      parentContainer.addChild(childContainer);
  
      // 内部精灵
      const sprite = PIXI.Sprite.from('https://6c6f-lovers-2ghufp1ec04bc518-1344238052.tcb.qcloud.la/texture/accessories/%E5%9C%86%E7%9C%BC%E9%95%9C.png?sign=89bdb3cc83ee694e922323e6299a5949&t=1740656690');
      sprite.interactive = true;
      sprite.on('touchstart', (e) => {
        console.log('Sprite 被点击', e.data.global);
      });
      sprite.on('touchmove', (e) => {
        console.log('Sprite 被移动', e.data.global);
      });
      sprite.on('touchend', (e) => {
        console.log('Sprite 被停止', e.data.global);
      });
      childContainer.addChild(sprite);
    },
      // 处理小程序触摸事件 
  handleTouch(e) {
    // 将e事件（touchstart/touchmove）等加入到emit的事件系统中，这样绑定touchstart事件的sprite就可以监听
    // 转发事件到 Pixi 
    this.minPIXI.dispatchEvent(e);
  },

  onLoad() {

}






});
