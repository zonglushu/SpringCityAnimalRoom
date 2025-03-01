import Vec2 from 'vec2';
import {UUID} from 'uuidjs';
//  鼠标按下时触发的函数,柯里化，返回一个函数，但是该函数可以访问到上层函数的参数
const handleControlDragStart=(editableObject,state)=>{
  return (e)=>{
    console.log("要拉伸")
    state.scaling = true;
    if(!editableObject.defaultDistance){
      const{distance , angle}=getChangeDataFromObj(e,editableObject);
      editableObject.defaultDistance=distance;
      editableObject.angle=angle;
    }
    if (editableObject.editorContainer) {
      editableObject.editorContainer.interactive = false;
    }
  }
}

 // 移动时触发的函数
const handleControlDragMove=(editableObject,state)=> {
   return (e)=>{
     console.log("正在拉伸")

    const editorContainer = editableObject.editorContainer;
    if (state.scaling) {
      const { distance, angle } = getChangeDataFromObj(e,editableObject);
  
      // 把当前的距离 除以 最开始的具体，得到缩放了多少
      const vScale = distance / editableObject.defaultDistance;
  
      const vAngle = angle - editableObject.defaultAngle;
  
      const originMap = editableObject.originDataMap;
      // const delBtn = editableObject.delBtn;
      const controlBtn = editableObject.controlBtn;
  
      // const delData = originMap.deleteIconSprite;
      const ctrlData = originMap.controlIconSprite;
      const editObjData = originMap.editorContainer;
  
      // if (delBtn) {
      //   delBtn.width = delData.width / v     Scale;
      //   delBtn.height = delData.height / vScale;
      // }
  
      if (controlBtn) {
        controlBtn.width = ctrlData.width / vScale;
        controlBtn.height = ctrlData.height / vScale;
      }
  
      // 等比缩放基础元素
      editorContainer.width = vScale * editObjData.width;
      editorContainer.height = vScale * editObjData.height;
      editorContainer.rotation = vAngle;
    }
   }
};

const handleControlDragEndOrExit=(editorContainer,state)=>{
  return ()=>{
    state.scaling = false;
    if (editorContainer) {
      editorContainer.interactive = true;
    }
  }

}

export function initDeleteEvent(editableObject){
  if(editableObject.delBtn){
    // 设置interactive，让其可以接受用户触发的事件
    editableObject.delBtn.interactive=true;
    //给删除按钮挂上pointerdown事件（用户按下鼠标/触摸屏幕）
    // 若用户触摸删除按钮，就触发删除事件，并把该对象传给监听者（person/prop）
    editableObject.delBtn.on("touchstart",(event)=>{
      event.stopPropagation(); // 阻止事件冒泡

      editableObject.emit("Delete",editableObject);
      editableObject.editorContainer=null;
    })
  }
}

export function initControlEvent(editableObject) {
  
  
  const state = { scaling: false }; // 使用闭包管理状态
  if (editableObject.controlBtn) {
    // 使操作按钮可交互
    // editableObject.editorContainer.interactive=false
    // editableObject.editorContainer.interactiveChildren = true;

    editableObject.controlBtn.interactive = true;
    editableObject.controlBtn.interactiveChildren = true;

    const onCtrlDown= handleControlDragStart(editableObject,state)
    const onCtrlMove= handleControlDragMove(editableObject,state)
    const onCtrlUpOrOut = handleControlDragEndOrExit(editableObject.editorContainer,state)
    // 用户按下鼠标/触摸屏幕---->触发pointerdown函数---->开始拖拽元素
    editableObject.controlBtn.on("touchstart", onCtrlDown);
    // 用户移动鼠标或手指----->触发pointermove---->更新对象的位置、缩放和旋转
    editableObject.controlBtn.on("touchmove", onCtrlMove);
    // 用户释放鼠标/结束触摸 ---->触发pointerup/pointerupoutside事件---->结束拖拽
    // pointerup 正常释放鼠标、pointerupoutside 在目标对象外部释放鼠标
    editableObject.controlBtn.on("touchend", onCtrlUpOrOut);
    // editableObject.controlBtn.on("pointerupoutside", onCtrlUpOrOut);
  }
}

 // 计算操作对象与事件点（操作按钮）之间的距离和角度
export function getChangeDataFromObj(e,editableObject) {
  const editorContainer = editableObject.editorContainer;
  const globalData = e.data.global;
  const a = new Vec2(editorContainer?.x || 0, editorContainer?.y || 0);
  const b = new Vec2(globalData.x, globalData.y);
  return {
    distance: a.distance(b),
    angle: Math.atan2(
      globalData.y - (editorContainer?.y || 0),
      globalData.x - (editorContainer?.x || 0)
    ),
  };
};

// 控制元素可以拖拽
// 已实现
export function makeObjectDraggable(editableObject) {
  editableObject.editorContainer.interactive = true; // 使之可以被监听到事件

  /** 用于存储触发时的坐标位置 */
  let coordStartData = null;
  /** 用来标识是否在拖拽中 */
  let dragging = false;
  let originObjPosition = null;

  /**
   * 事件按下触发
   *
   * @param {PIXI.InteractionEvent} e
   */
  const onDragStart = (e) => {
    // console.log("开始拖拽")
    setTimeout(() => {
      editableObject.emit("Selected", editableObject);
    }, 100);
    coordStartData = {
      x: e.data.global.x,
      y: e.data.global.y,
    };
    dragging = true;
    originObjPosition = { x: editableObject.editorContainer.x, y: editableObject.editorContainer.y };
  };

  /**
   * 事件抬起触发
   *
   */
  const onDragEnd = () => {
    coordStartData = null;
    dragging = false;
  };

  /**
   * 事件移动触发
   *
   */
  const onDragMove = (e) => {
    // console.log("开始移动")
    if (dragging) {
      const newPosition = e.data.global;
      if (coordStartData) {
        const distanceX = newPosition.x - coordStartData.x;
        const distanceY = newPosition.y - coordStartData.y;
        editableObject.editorContainer.x = originObjPosition.x + distanceX;
        editableObject.editorContainer.y = originObjPosition.y + distanceY;
              // 动态调整子组件的 hitArea 位置
      // editorContainer.children.forEach((child) => {
      //   if (child.hitArea) {
      //     child.hitArea.x += distanceX;
      //     child.hitArea.y += distanceY;
      //   }
      // });
      }

    }
  };

  // 绑定事件
  editableObject.editorContainer.on('touchstart', onDragStart);
  editableObject.editorContainer.on('touchend', onDragEnd);
  // editorContainer.on('pointerupoutside', onDragEnd);
  editableObject.editorContainer.on('touchmove', onDragMove);
  return editableObject.editorContainer;
}


export function getRandomId() {
  return UUID.generate()
}

