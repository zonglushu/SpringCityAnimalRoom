import { EditableObject } from "./EditableObject";
import { getRandomId } from "./EditUtils";
import { TextureResourceLoader } from "./textureResourceLoader";
import {  Datatype,dressSpriteStyles} from "./types";

// 人物必须是一个PIXI.container然后里面放五个Sprite实例（头发、配饰、表情、上衣、裤子）
export class Person extends EditableObject{

  constructor(app,PIXI,personInfo){
    super(app,PIXI)
    this.app=app
    this.PIXI=PIXI
    this.personInfo=personInfo
    // 用于管理person对象的key
    this.key=getRandomId();
    this.person={}
    // 人物容器，用来容纳人物的五大部分
    this.personContainer=null
    this.createPerson()
  }

  async createPerson(){
    // 构建人物容器，所以还不能直接加载人物的图片，因为加载后，如果要换东西的话，就不好换了
    // 比如发型，你就踢不掉
    this.personContainer = new this.PIXI.Container();
    // this.personContainer.width=this.personInfo.personSize.width
    // this.personContainer.height=this.personInfo.personSize.height
    this.personContainer.sortableChildren=true;
      
    this.editableTarget=this.personContainer
    this.createDress();
    // 因为创建contanier，往contanier里面放东西都是异步操作，所以需要
    // 等待，不能让其异步执行 
    await this.makeSpriteEditable()
    this.editorContainer.width=600
    this.editorContainer.height=1000
    console.log("可编辑后的外容器",this.editorContainer.getBounds())

    // console.log("最外层容器",this.editorContainer.getBounds())
    
    const debug = new this.PIXI.Graphics()
    .lineStyle(1, 0x000000)
    .drawRect( -this.editorContainer.width / 2, // 锚点为中心时的边界
      -this.editorContainer.height / 2,
      this.editorContainer.width,
      this.editorContainer.height);
    this.editorContainer.addChild(debug);
      //绘制子元素边界框（绿色）
      // const childBound=this.editableTarget.getBounds(true)
      const childDebug = new this.PIXI.Graphics()
      .lineStyle(1, 0x00ff00)
      .drawRect(
        -this.editableTarget.width/2,
        -this.editableTarget.height/2,
        this.editableTarget.width,
        this.editableTarget.height
      );
      this.editableTarget.addChild(childDebug);
  }
  createDress(){
    const { FACE, HAIR, JACKET, TROUSERS } = Datatype;
    const DefaultPersonElement = {HAIR, FACE,JACKET, TROUSERS };

    Object.entries(DefaultPersonElement).forEach(
      ([key,value])=>{
        const sprite=this.createSprite(value.id)
        sprite.name=key
        this.personContainer.addChild(sprite)
        this.person[key]=sprite
        const childBound=this.editableTarget.getBounds(true)

        dressSpriteStyles[key]({sprite:sprite,personContanier:this.personContainer,person:this.person,personContanierHeight:this.personInfo.personSize.height})}
      )
      console.log("人物",this.personContainer)


  } 
  createSprite(dataType){
    console.log("装饰ID",dataType)

    const dress=this.getMaterialByType(dataType)
    console.log("每个装饰信息",dress)
    const {name,width,height}=dress;
    const texure=TextureResourceLoader.getTextureFromCache(name)
    // 内部精灵
    const sprite = this.PIXI.Sprite.from(texure);
    //以自身中心为锚点，并将位置设置到父contanier中间
    sprite.anchor.set(0.5,0.5);
    sprite.position.set(0, 0); // 向左上偏移
    return sprite


    // 从PIXI资源加载器中加载资源
  }
  changeDress(dressInfo){
    // 选出需要变化的服装类型
    const dressType= Object.values(Datatype).find(item => item.id === dressInfo.dataType).name;
    // 找到对应的sprite
    const changedDress= this.personContainer.getChildByName(dressType)
    // 保存原来sprite的坐标
    const y=changedDress.y
    // 从缓存中找到新的纹理资源
    const texure= TextureResourceLoader.getTextureFromCache(dressInfo.name)
    console.log("新加载的纹理",texure)
    const index = this.personContainer.getChildIndex(changedDress); // 获取旧精灵的层级位置
    this.personContainer.removeChild(changedDress); // 从容器移除旧精灵
    // 通过新的纹理创建新的sprite
    const sprite = new this.PIXI.Sprite(texure);
    this.personContainer.addChildAt(sprite, index);
    sprite.anchor.set(0.5,0.5);
    sprite.position.set(0, 0); // 向左上偏移
    sprite.name=dressType
    const childBound=this.personContainer.getBounds(true)
    dressSpriteStyles[dressType]({sprite,personContanier:this.personContainer,person:this.person,personContanierHeight:this.personInfo.personSize.height})
    sprite.y=y;



  }
  getMaterialByType(dataType) {
    return this.personInfo.defaultMaterial.find((item) => item.dataType === dataType);
  }

  
}