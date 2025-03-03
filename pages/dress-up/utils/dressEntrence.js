import EventEmitter from "./eventemitter3";
import { Person } from "./person";
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
    this.currentRole=null
  }


    addPerson(personInfo){
      const person=new Person(this.app,this.PIXI,personInfo)
      this.MaterialPool[person.key]=person;
      person.on("Selected",this.onSelect);
      person.on("Delete",this.onDelete);
      return person
    }
    addProp(propsInfo){
      const prop=new Prop(this.app,this.PIXI,propsInfo)
      this.MaterialPool[prop.key]=prop;
      prop.on("Selected",this.onSelect);
      prop.on("Delete",this.onDelete);
      return prop
    }
    changeRoleDress(dressInfo){
      const currentEditableRole=this.MaterialPool[this.currentRole]
      currentEditableRole.changeDress(dressInfo)
    }
    onSelect = (selectItem) => {
      this.emit('ItemSelect', selectItem); // 触发 ItemSelect 事件
      if (!selectItem) {
        return;
      }
      for (const item of Object.entries(this.MaterialPool)) {
        const [, material] = item;
        if (material.key !== selectItem.key) {
          material.makeObjectUnEditable(); // 其他素材不可编辑
        } else {
          if(material instanceof Person){
            this.currentRole=selectItem.key
          } 
          console.log("被选择的item",material)
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
}