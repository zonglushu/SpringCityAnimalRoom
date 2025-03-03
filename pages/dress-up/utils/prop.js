import { EditableObject } from "./EditableObject";
import { getRandomId } from "./EditUtils";
import {ControlBtn} from './editer/controlBtn'
import {DeleteBtn} from './editer/deleteBtn'
import {DashedRectangle} from './editer/dashedRectangle'
import { TextureResourceLoader } from "./textureResourceLoader";
import {initControlEvent,initDeleteEvent,getChangeDataFromObj,makeObjectDraggable} from './EditUtils'
import EventEmitter from "./eventemitter3";
const offsetList = [0, 50, -50]; // 模块级变量
let addedNum = 0; // 模块级变量
export class Prop extends EditableObject {

  constructor(app,PIXI,propsInfo){
    super(app,PIXI)
    // super(app,PIXI);
    this.app=app;
    this.PIXI=PIXI
    this.propsInfo=propsInfo;
    this.key=getRandomId();
    this.props=null;
    // 虚线对象，是自定义的虚线对象
    // this.dashLine = null;
    // // 删除按钮对象，也是自定义的，用于删除当前可编辑对象
    // this.delBtn = null;
    // // 控制按钮对象，允许用户对可编辑对象进行控制操作（如缩放、旋转等）
    // this.controlBtn = null;


    this.editableTarget=null;
    // 将props放到舞台中央
    this.create()
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
  makeObjectUnEditable() {
    const { delBtn, ctrlBtn, dashline } = this.getAllControlSprite();

    delBtn.visible = false;
    ctrlBtn.visible = false;
    // dashline.visible = false;
  }
 async create(){
    const {name}=this.propsInfo

    // 父容器
    // this.editorContainer = new this.PIXI.Container();
    // this.editorContainer.interactive = true;
    // this.editorContainer.interactiveChildren = true;
    // this.app.stage.addChild(this.editorContainer);
    // makeObjectDraggable(this)

    const texure=TextureResourceLoader.getTextureFromCache(name)
    // 内部精灵
    const sprite = this.PIXI.Sprite.from(texure);
    sprite.interactive = true;
    this.editableTarget=sprite;
    await this.makeSpriteEditable()

    // this.editorContainer.addChild(sprite);

    // sprite.position.set(0, 0); // 相对于父容器中心
    // 就是因为这个sprite.x和.y导致无法开启事件
    // sprite.x = this.app.screen.width / 4 + offsetList[addedNum++ % 3];
    // sprite.y = this.app.screen.height / 4;
    // this.dashLine =  new DashedRectangle(this.PIXI,sprite).create();
    // // 从缓存中异常加载纹理，所以要等，不能异步
    // this.delBtn = await new DeleteBtn(this.PIXI, sprite,this.app).create();
    // this.controlBtn = await new ControlBtn(this.PIXI, sprite).create();
    // this.editorContainer.addChild(this.controlBtn,this.delBtn)
    // setTimeout(() => {
    //   this.emit("Selected", this);
    // }, 100);
    // this.saveObjectOriginData()

    // initControlEvent(this)
    // initDeleteEvent(this)
    // 确保 controlBtn 在顶层

    console.log("父亲的位置",this.editorContainer.x, this.editorContainer.y)
    const bounds = this.controlBtn.getBounds(true);

    // const btndebug = new this.PIXI.Graphics()
    //   .lineStyle(1, 0x000000)
    //   .drawRect( -bounds.width / 2, // 锚点为中心时的边界
    //     -bounds.height / 2,
    //     bounds.width,
    //     bounds.height);
    //   this.controlBtn.addChild(btndebug)

    //    // 将子sprite放到contanier中
    // const bounds = sprite.getBounds(true);
    // this.editorContainer.pivot.set(bounds.width / 2, bounds.height / 2);
    // 将容器中心对齐舞台中心
    // this.editorContainer.position.set(
    //   this.app.screen.width / 2 +offsetList[addedNum++ % 3],
    //   this.app.screen.height / 2
    // );
    // sprite.anchor.set(0.5); // 子元素锚点居中
    // sprite.position.set(0, 0); 



    // 4. 打印调试信息
    console.log("Parent Position:", this.editorContainer.position);
    console.log("Parent Pivot:", this.editorContainer.pivot);
    console.log("Child Position:", sprite.position);
    console.log("Child Anchor:", sprite.anchor);
    // console.log("bounds",bounds.width,bounds.height)
    // 5. 可视化边界框（调试用）
    // const bounds = this.editorContainer.getBounds(true);

    const debug = new this.PIXI.Graphics()
      .lineStyle(1, 0x000000)
      .drawRect( -this.editorContainer.width / 2, // 锚点为中心时的边界
        -this.editorContainer.height / 2,
        this.editorContainer.width,
        this.editorContainer.height);
    this.editorContainer.addChild(debug);
    //绘制子元素边界框（绿色）
    const childDebug = new this.PIXI.Graphics()
    .lineStyle(1, 0x00ff00)
    .drawRect(
      -sprite.width / 2, // 锚点为中心时的边界
      -sprite.height / 2,
      sprite.width,
      sprite.height
    );
    

    sprite.addChild(childDebug);

  }
}