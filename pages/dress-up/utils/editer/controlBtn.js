import {TextureResourceLoader} from '../textureResourceLoader'
// import ControlIcon from '../../img/control.png'
export class ControlBtn{


  // app还是整个换装游戏的应用
  // editableTarget是对应目标编辑对象（人/道具）
  constructor(PIXI, editableTarget) {
    this.PIXI = PIXI;
    this.editableTarget = editableTarget;
  }
// 创建一个
  async create() {
    const controlIconName = 'controlIcon';
    const texture= await TextureResourceLoader.loadTexture(controlIconName,"../../img/control.png")
    const sprite = this.PIXI.Sprite.from(texture);
    sprite.width = 31;
    sprite.height = 31;
    // 将锚点设置为精灵的中心点
    sprite.anchor.set(0.5,0.5);
    sprite.position.set(0,0); 

    // 获取可编辑目标的边界矩形
    // const globalPos = this.editableTarget.getGlobalPosition();
    // const parentPos = this.editableTarget.parent.getGlobalPosition();
  //   const rect = this.editableTarget.getLocalBounds();
  //   const { x, y, width,height } = rect;
  //   sprite.x = rect.x+width/2;
  //   sprite.y = rect.y-height/2;
  //   sprite.interactive=true
  //   console.log("控制按钮的坐标",x,y)
  //   sprite.hitArea = new this.PIXI.Circle(
  //     x,
  //     -2*height,
  //     100
  // );
  
 
    // const debugGraphics = new this.PIXI.Graphics()
    // .lineStyle(1, 0xff0000) // 红色边框
    // .drawCircle(
    //   0, // 圆心的 x 坐标（相对于精灵的局部坐标系）
    //   0, // 圆心的 y 坐标（相对于精灵的局部坐标系）
    //   100  // 半径
    // );
  
  // 将调试图形添加到精灵的容器中
  // sprite.addChild(debugGraphics);
// 绘制精灵的边界框
// const boundsGraphics = new this.PIXI.Graphics()
//   .lineStyle(1, 0x00ff00) // 绿色边框
//   .drawRect(-sprite.width/2, -sprite.height/2, sprite.width, sprite.height);
//   sprite.addChild(boundsGraphics);





    this.icon = sprite;
    sprite.name = 'ctrlBtn';
    return this.icon;
  }
}