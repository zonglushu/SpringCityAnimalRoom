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

// Canvas 转临时文件（Promise 封装）
const canvasToTempFile=(canvasNode)=> {
  console.log("要转换为图片的canvas节点信息",canvasNode)
  return new Promise((resolve, reject) => {
    wx.canvasToTempFilePath({
      canvasId: canvasNode,
      fileType: 'png',
      quality: 1, // 质量 0-1
      success: (res) => resolve(res.tempFilePath),
      fail: reject,
    });
  });
};

  // 核心：提取 WebGL 像素数据生成图片
const captureWebGLToTempFile = (canvasNode, gl) => {
    return new Promise((resolve, reject) => {
      const canvas = canvasNode;
  
      // 1. 读取 WebGL 像素数据
      const pixels = new Uint8Array(canvas.width * canvas.height * 4);
      gl.readPixels(
        0, 0,
        canvas.width, canvas.height,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        pixels
      );
  
      // 2. 垂直翻转像素数据
      const flippedPixels = new Uint8Array(pixels.length);
      const rowBytes = canvas.width * 4;
      for (let y = 0; y < canvas.height; y++) {
        const srcRow = pixels.subarray(y * rowBytes, (y + 1) * rowBytes);
        const dstRow = flippedPixels.subarray((canvas.height - y - 1) * rowBytes);
        dstRow.set(srcRow);
      }
  
      // 3. 获取 WXML 中的 2D Canvas
      const query = wx.createSelectorQuery();
      query.select('#savImg')
        .fields({ node: true, size: true })
        .exec((res) => {
          const tempCanvas = res[0].node; // 获取 Canvas 节点
          console.log("临时的canvas",tempCanvas)
          const tempCtx = tempCanvas.getContext('2d'); // 获取 2D 上下文
  
          // 设置 Canvas 尺寸
          tempCanvas.width = canvas.width;
          tempCanvas.height = canvas.height;
  
          // 4. 将像素数据绘制到 2D Canvas
          const imageData = tempCtx.createImageData(canvas.width, canvas.height);
          imageData.data.set(flippedPixels);
          tempCtx.putImageData(imageData, 0, 0);
  
          // 5. 保存为图片
          wx.canvasToTempFilePath({
            canvas: tempCanvas,
            fileType: 'png',
            success: (res) => resolve(res.tempFilePath),
            fail: (err) => {
              console.error('图片保存失败:', err);
              reject(new Error('生成图片失败'));
            }
          });
        });
    });
  };
  
  
  
  
  



// 错误处理
const handleImgError=(error)=> {
  console.error('保存失败:', error);
  if (error.errMsg.includes('auth deny')) {
    wx.showModal({
      title: '权限不足',
      content: '请到设置中允许访问相册',
      success: (res) => {
        if (res.confirm) wx.openSetting();
      }
    });
  } else {
    wx.showToast({ title: '生成图片失败', icon: 'none' });
  }
}


export async function saveImg(canvasNode,gl){
  try {
    // 生成临时图片路径
    const tempFilePath = await captureWebGLToTempFile(canvasNode,gl);

    // 检查相册权限
    const { authSetting } = await wx.getSetting({});
    if (!authSetting['scope.writePhotosAlbum']) {
      await wx.authorize({ scope: 'scope.writePhotosAlbum' });
    }

    // 保存到相册
    await wx.saveImageToPhotosAlbum({ filePath: tempFilePath });
    wx.showToast({ title: '保存成功', icon: 'success' });
  } catch (error) {
    handleImgError(error);
  }
}

