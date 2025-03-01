import EventEmitter from "./eventemitter3";
import { Prop } from "./prop";
export  class DressEntrance extends EventEmitter {
  constructor(PIXI,stageWidth,stageHeight,app) {
    super()
    // const { sceneInfo } = defaultInfo;
    // 创建换装游戏全局的一个应用
    this.app = app
    this.stageWidth=stageWidth;
    this.stageHeight=stageHeight;
    // // 首先创建一个场景类，就是整个游戏的最低层，相当于背景
    // this.scene = new Scene(this.app, sceneInfo);
    this.PIXI=PIXI
    // 缓存最原始加载的纹理,是基础资源层
    this.textureCache = new Map();
    // 存基于纹理创建的Person和Props对象，是业务逻辑层
    // 由于是js，我们需要额外明确类型，该对象的每一个属性就是person或prop对象的字符串key，其值就是对应的persion和prop对象
    this.MaterialPool={}; 
  }

    // // 创建精灵
    // createSprite(name, x = 0, y = 0) {
    //   if (!this.textureCache.has(name)) {
    //     throw new Error(`Texture for ${name} not found in cache!`);
    //   }
    //   const texture = this.textureCache.get(name);
    //   const sprite = new PIXI.Sprite(texture);
    //   sprite.x = x;
    //   sprite.y = y;
    //   this.app.stage.addChild(sprite);
    //   return sprite;
    // }
    // 处理ItemSelect事件，当用户选择某个素材时，会触发ItemSelect事件，并更新素材为可编辑状态
    onSelect = (selectItem) => {
      this.emit('ItemSelect', selectItem); // 触发 ItemSelect 事件
      console.log("选择事件")
      if (!selectItem) {
        return;
      }
      for (const item of Object.entries(this.MaterialPool)) {
        const [, material] = item;
        if (material.key !== selectItem.key) {
          material.makeObjectUnEditable(); // 其他素材不可编辑
        } else {
          material.recoverEditable(); // 当前素材可编辑
        }
      }
    };
    // 处理ItemDelete事件，当用户删除某个素材时，触发ItemDelete，从场景中移除该素材。
    onDelete = (item) => {
      // TODUO 这个事件还是没有人绑定
      this.emit('ItemDelete', item); // 触发 ItemDelete 事件
      console.log("现在有几个",this.MaterialPool)
      if (item && item.editorContainer) {
        // 释放pool 该key和该key的值
        delete this.MaterialPool[item.key]; // 从素材池中移除
        // 一会看看这个怎么删除
        this.app.stage.removeChild(item.editorContainer); // 从场景中移除对象
      }
    };

    addPerson(){

    }
    addProp(propsInfo){
      const prop=new Prop(this.app,this.PIXI,propsInfo)
      this.MaterialPool[prop.key]=prop;
      prop.on("Selected",this.onSelect);
      prop.on("Delete",this.onDelete);
      return prop
    }
}