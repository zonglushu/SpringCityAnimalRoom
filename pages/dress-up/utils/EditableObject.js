import EventEmitter from "./eventemitter3";
import {ControlBtn} from './editer/controlBtn'
import {DeleteBtn} from './editer/deleteBtn'
import {DashedRectangle} from './editer/dashedRectangle'
import {initControlEvent,initDeleteEvent,getChangeDataFromObj,makeObjectDraggable} from './EditUtils'
const offsetList = [0, 50, -50]; // 模块级变量
let addedNum = 0; // 模块级变量
export class EditableObject extends EventEmitter{
  constructor(app,PIXI) {
    super();
    //该app是PIXI的应用程序，是整个游戏的PIXI的application
    this.app=app;

    this.PIXI=PIXI;
    // editableTarget是人物PIXI或者prop
    this.editableTarget=null;
    // 存储当前的可编辑对象.是包括人物、三个编辑组件的container
    this.editorContainer=null
    // 虚线对象，是自定义的虚线对象
    this.dashLine = null;
    // 删除按钮对象，也是自定义的，用于删除当前可编辑对象
    this.delBtn = null;
    // 控制按钮对象，允许用户对可编辑对象进行控制操作（如缩放、旋转等）
    this.controlBtn = null;
    // 存储可编辑对象的原始数据，如（位置，大小、旋转角度等），以便用户操作后可以恢复到原始状态
    this.originDataMap = {};
    // 存储默认旋转角度
    this.defaultAngle = 0;
    // 默认距离值
    this.defaultDistance = 0;
  }
  

  // 获取三个控制组件
  getAllControlSprite = () => {
    // 把getChildByName的this绑定为this.editorContainer，并且给力一个名字为getSprite
    const getSprite = this.editorContainer.getChildByName.bind(
      this.editorContainer
    );
    const delBtn = getSprite("delBtn");
    const ctrlBtn = getSprite("ctrlBtn");
    const dashline = getSprite("dashline");

    return {
      delBtn,
      ctrlBtn,
      dashline,
    };
  };
  recoverEditable(){
    const { delBtn, ctrlBtn, dashline } = this.getAllControlSprite();
    delBtn.visible = true;
    ctrlBtn.visible = true;
    // dashline.visible = true;
  }  

  // 在这里会创建三个编辑对象，然后将人物PIXI容器和这三个编辑对象再放到一起，
  // 也就是一个操作容器（三个编辑对象、人物对象）
  async makeSpriteEditable(){
    // // 触发被选择事件，将该editableObject传给监听者(persn/prop),然后将廷泽
    // setTimeout(() => {
    //   this.emit("Selected", this);
    // }, 100);
    // 如果这个对象已经造出来了，那就重新不会再创建一遍，之间给他恢复编辑状态
    // 获取人物/道具所处的位置,XY是坐标，PX、PY是旋转中心点坐标
    const obj = this.editableTarget;
    // const originX = obj.x;
    // const originY = obj.y;
    const originPX = obj.pivot.x;
    const originPY = obj.pivot.y;
    // 建立contanier
    this.editorContainer = new this.PIXI.Container();
    this.editorContainer.interactive = true;
    this.editorContainer.interactiveChildren = true;
    this.app.stage.addChild(this.editorContainer);
    makeObjectDraggable(this)

    // 将这些信息重置，因为后续要把人物添加到容器中，需要重新定义位置
    obj.x = 0;
    obj.y = 0;
    obj.pivot.x = 0;
    obj.pivot.y = 0;
    // 创建三个用来编辑的物品
    this.dashLine =  new DashedRectangle(this.PIXI,this.editableTarget).create();
    // 从缓存中异常加载纹理，所以要等，不能异步
    this.delBtn = await new DeleteBtn(this.PIXI, this.editableTarget,this.app).create();
    this.controlBtn = await new ControlBtn(this.PIXI, this.editableTarget).create();
    this.editorContainer.addChild(this.controlBtn,this.delBtn)
    setTimeout(() => {
      this.emit("Selected", this);
    }, 100);
    this.saveObjectOriginData()

    initControlEvent(this)
    initDeleteEvent(this)

    this.editorContainer.addChild( this.editableTarget);
    // 将容器的位置设置为原来人物的位置
    // container.x = originX;
    // container.y = originY;
    this.editorContainer.position.set(
      this.app.screen.width / 2 +offsetList[addedNum++ % 3],
      this.app.screen.height / 2
    );
    this.editorContainer.pivot.x = originPX;
    this.editorContainer.pivot.y = originPY;
    this.editableTarget.anchor.set(0.5); // 子元素锚点居中
    this.editableTarget.position.set(0, 0); 
    // this.editorContainer = container;

    console.log("可操作对象",this.editorContainer)
    // 现在没有风险，但是未来可能会有风险
    this.app.stage.addChild(this.editorContainer);
    // 保存对象原始位置关系？？？？？
    this.saveObjectOriginData();
  }
  // 将一些基础信息都加载到这个OriginDataMap中，最后就从这个Map中获取就可以
  saveObjectOriginData = () => {
    const originDataMap = this.originDataMap;
    const ctrlBtn = this.controlBtn;
    const delBtn = this.delBtn;
    const dashLine = this.dashLine;
    const editorContainer = this.editorContainer;

    // 存下编辑实例的基础数据
    originDataMap.editorContainer = {
      width: editorContainer.width,
      height: editorContainer.height,
      x: editorContainer?.x,
      y: editorContainer?.y,
    };
    // originDataMap.dash = {
    //   x: dashLine?.x,
    //   y: dashLine?.y,
    //   width: dashLine?.width,
    //   height: dashLine?.height,
    // };
    // originDataMap.deleteIconSprite = {
    //   x: delBtn?.x,
    //   y: delBtn?.y,
    //   width: delBtn?.width,
    //   height: delBtn?.height,
    // };
    originDataMap.controlIconSprite = {
      x: ctrlBtn?.x,
      y: ctrlBtn?.y,
      width: ctrlBtn?.width,
      height: ctrlBtn?.height,
    };
  };


  makeObjectUnEditable() {
    const { delBtn, ctrlBtn, dashline } = this.getAllControlSprite();

    delBtn.visible = false;
    ctrlBtn.visible = false;
    // dashline.visible = false;
  }





}