import { TextureResourceLoader } from "../textureResourceLoader";

export class DeleteBtn{
    // app还是整个换装游戏的应用
  // editableTarget是对应目标编辑对象（人/道具）
  constructor(PIXI, editableTarget,app) {
    this.app=app
    this.PIXI = PIXI;
    this.editableTarget = editableTarget;
  }

  async create() {
    
    const controlIconName = 'deleteIcon';
    const texture= await TextureResourceLoader.loadTexture(controlIconName,"../../img/delete.png")
    const sprite = this.PIXI.Sprite.from(texture);
    sprite.width = 31;
    sprite.height = 31;
    sprite.anchor.set(0.5);
    sprite.position.set(0, 0); // 向左上偏移

    // // this.editableTarget.position.y = 0;
    // const rect = this.editableTarget.getBounds();
    // const { x, y ,width,height} = rect;
    // console.log("要设置道具的坐标",x,y)
    // sprite.x = x;
    // sprite.y = y;
    // console.log("初始的点击区域",sprite.hitArea)
    // 绘制纹理区域的边框
// const graphics = new this.PIXI.Graphics();
// graphics.lineStyle(2, 0x0000ff);
// graphics.drawRect(    sprite.x - sprite.width / 2, // 全局 x 坐标
//   sprite.y - sprite.height / 2, // 全局 y 坐标
//   500, // 宽度
//   500 // 高度
//   );
// sprite.addChild(graphics)x/
// this.app.stage.addChild(graphics)
  //   sprite.hitArea = new this.PIXI.Circle(
  //     x, // 本地坐标系中的 x
  //     -2.12*height, // 本地坐标系中的 y
  //     100
  // );
    this.icon = sprite;
    sprite.name = 'delBtn';
    return this.icon;
  }
}