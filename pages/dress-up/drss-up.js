// pages/drss-up.js
// 手动实现 Intl 的替代方案


import { Prop } from "./utils/prop";

import {createPIXI} from "../../libs/pixi.miniprogram"
import  {Datatype} from "./utils/types"
import {DressEntrance} from "./utils/dressEntrence"
import {TextureResourceLoader} from './utils/textureResourceLoader'




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

Page({
  // 全部服饰素材
  materialsList:[],
  // 入口类
  dressEntrance:null,

  miniPIXI:null,

  pixiApp:null,
  /**
   * 页面的初始数据
   */
  data: {
    // 被激活标签页
    activeTab: Datatype.ROLE.id,
    // 当前分类的服饰素材
    currentMaterialsList:[],
    // tab栏分类
    tabs:[],
  },
  // 处理素材列表的逻辑
    loadGridData(type){
      
      const items=this.materialsList.filter(item=>item.dataType===type)
      console.log("切换tab时所展示的数据",items)
      this.setData({
        activeTab:type,
        currentMaterialsList:items
      })
    },
    async fetchAndStoreMaterials(){
      try {
        const res = await wx.cloud.callFunction({
          name: 'getMaterials', // 替换为你的云函数名称
        });
        this.materialsList=res.result.data
        this.setData({currentMaterialsList:
          this.materialsList.filter(item=>item.dataType===1)}, () => {
          console.log('首次加载时，过滤出人物的素材:', this.data.currentMaterialsList); // 确保更新后打印
        })
      } catch (err) {
        console.error('查询失败:', err);
      }
    },
    // 切换标签时需要触发的方法
    onTabChange(event) {
      const type = event.detail.name;
      this.loadGridData(type);
    },
    // 图片点击事件处理函数
    onImageTap(event) {
      const item = event.currentTarget.dataset.item; // 获取传递的 item

      const {name,width,height}=item
      if(item.dataType===Datatype.PROP.id)
      {
        const propInfo={name,width,height}
        console.log(propInfo)
        this.dressEntrance.addProp(propInfo)
        // const prop=new Prop(this.pixiApp,this.miniPIXI,propInfo)
      }
      // 在这里处理 item 的逻辑
      // 例如：跳转到详情页、显示弹窗等
    },

    // 工具函数：查询 Canvas 节点
  queryCanvas(selector = '#pixiCanvas') {
    return new Promise((resolve) => {
      wx.createSelectorQuery()
        .select(selector)
        .node()
        .exec(resolve);
    });
  },
  queryTab(selector = '.tabs-container'){
    return new Promise((resolve) => {
      wx.createSelectorQuery()
        .select(selector)
        .boundingClientRect()
        .exec(resolve);
    });
  },

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
  // 处理小程序触摸事件 
  handleTouch(e) {
    // 将e事件（touchstart/touchmove）等加入到emit的事件系统中，这样绑定touchstart事件的sprite就可以监听
    // 转发事件到 Pixi 

    this.miniPIXI.dispatchEvent(e);
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
    


  // 生成miniPIXI对象,并为其添加诸多功能
  generateMiniPIXI(canvasNode,stageWidth){
     //加载pixi
     const PIXI = createPIXI(canvasNode,stageWidth);//传入canvas，传入canvas宽度，用于计算触摸坐标比例适配触摸位置
     this.miniPIXI=PIXI
     unsafeEval(PIXI);//适配PIXI里面使用的eval函数
     installSpine(PIXI);//注入Spine库
     installAnimate(PIXI);//注入Animate库
     installCubism4(PIXI,Live2DCubismCore);
     installPixiLive2d(PIXI,live2d,Live2DCubismCore);
     TextureResourceLoader.initialize(this.miniPIXI)
     return PIXI
  },
  createContainers(app,PIXI) {

    // stage--->EditableObjecct(parentContainer)---> childContainer(人物) -----> sprite
    // 根容器设置
    app.stage.interactive = true;
    app.stage.interactiveChildren = true;

    // 父容器
    const parentContainer = new PIXI.Container();
    parentContainer.interactive = true;
    parentContainer.interactiveChildren = true;
    app.stage.addChild(parentContainer);

    // 子容器
    // const childContainer = new PIXI.Container();
    // childContainer.interactive = true;
    // parentContainer.addChild(childContainer);

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
    parentContainer.addChild(sprite);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
      // 根据数据分类设置tab
    this.setData({tabs:Object.values(Datatype)
    .map(type=>({title:type.title,id:type.id}))},()=>{console.log('更新后的tabs',this.data.tabs)})
    await this.fetchAndStoreMaterials(); 
    console.log(this.materialsList)
    const [tabs]= await this.queryTab()
    // tab栏距离顶部的高度
    const tabsTop=tabs.top
    // 获取舞台高度
    const{stageWidth,stageHeight}=this.calculateStageSize()
    // 获取屏幕的canvas节点
    const [canvasInfo]= await this.queryCanvas()
    const canvasNode=canvasInfo.node;
    this.miniPIXI= createPIXI(canvasNode,stageWidth);//传入canvas，传入canvas宽度，用于计算触摸坐标比例适配触摸位置
    
    unsafeEval(this.miniPIXI);//适配PIXI里面使用的eval函数
    installSpine(this.miniPIXI);//注入Spine库
    installAnimate(this.miniPIXI);//注入Animate库
    installCubism4(this.miniPIXI,Live2DCubismCore);
    installPixiLive2d(this.miniPIXI,live2d,Live2DCubismCore);
    TextureResourceLoader.initialize(this.miniPIXI)

    // console.log(miniPIXI)
    const priorityTypes = [Datatype.ROLE.id, Datatype.FACE.id]; // 优先加载 head 和 body 类型的资源
    console.log("画布宽度",stageWidth)
    console.log("画布高度",stageHeight)
    
     this.pixiApp = new this.miniPIXI.Application({
      view:canvasNode,
      width: stageWidth,
      height: stageHeight,
      backgroundColor: 0x7356db,    
    });
    this.pixiApp.stage.interactive = true;
    this.pixiApp.stage.interactiveChildren = true;
    this.dressEntrance= new DressEntrance(this.miniPIXI,stageWidth,stageHeight,this.pixiApp)

   // 将所有的图片资源加载到PIXI中成为纹理对象
    TextureResourceLoader.priorityLoadByDataType(this.materialsList,priorityTypes,
      (progress) => {
        console.log(`Loading progress: ${progress}%`);
      }).then(() => {
        console.log("All resources loaded!");
        })



     
  },

  


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})