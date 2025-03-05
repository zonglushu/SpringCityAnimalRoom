
// 在 utils/enum.js 中定义
export const Datatype = Object.freeze({
  ROLE: {id:1,"title":'角色','name':'ROLE'}, // 角色
  FACE: {id:2,"title":'脸部','name':'FACE'}, // 脸部
  HAIR: {id:3,"title":'发型','name':'HAIR'}, // 头发
  JACKET: {id:4,"title":'上衣','name':'JACKET'}, // 上衣
  TROUSERS: {id:5,"title":'裤子','name':'TROUSERS'}, // 裤子
  ACCESSORIES: {id:6,"title":'饰品','name':'ACCESSORIES'}, // 饰品
  SCENE: {id:7,"title":'场景','name':'SCENE'}, // 场景
  PROP: {id:8,"title":'道具','name':'PROP'}, // 道具
});
const MAXZINDEX=10
export const dressSpriteStyles = {
  HAIR: (params) => {
    const { sprite, personContanier,personContanierHeight } = params;
    sprite.x = 0;
    sprite.y = -personContanier.height/2-sprite.height/2;
    sprite.zIndex = MAXZINDEX;
  },
  FACE: (params) => {
    const { sprite, person } = params;
    const hairSprite = person[Datatype.HAIR.name];
    sprite.x = hairSprite.x;
    sprite.y = hairSprite.y;
    sprite.zIndex = ++hairSprite.zIndex;
  },
  JACKET: (params) => {
    const { sprite, person } = params;
    sprite.x = 0;
    sprite.y = person['HAIR'].y + person['HAIR'].height;
    sprite.zIndex = 4;
  },
  TROUSERS: (params) => {
    const { sprite, person } = params;
    sprite.x = 0;
    sprite.y = person['JACKET'].y + 150;
    sprite.zIndex = 3;
    sprite.width = person['JACKET'].width - 30;
  },
  ACCESSORIES:(params) =>{
    const {sprite,person} = params;
    const faceSprite = person[Datatype.FACE.name];
    sprite.x=0; 
    sprite.y=faceSprite.y;
    sprite.zIndex=++faceSprite.zIndex;
  }

};
// 添加道具方法
const addProp=({item,dressEntrance})=>{
  const { name, width, height } = item;
  const propInfo = { name, width, height };
  dressEntrance.addProp(propInfo);
}
// 添加人物方法
const addRole=({item,dressEntrance,materialsList})=>{
  const defaultPersonMaterialMap = {
    '默认男': ["精神小伙", "呵呵", "基础上衣", "基础裤子", '圆眼镜'],
    '默认女': ["温柔卷发", "呵呵", "基础上衣", "基础裤子", '圆眼镜']
  };
  const { name, width, height } = item;
  const defaultMaterialName = defaultPersonMaterialMap[name] || [];
  const defaultMaterial = materialsList.filter(material =>
    defaultMaterialName.includes(material.name)
  );
  console.log("基础素材", defaultMaterial);

  const personSize = { width: 400, height: 800 };
  const personInfo = { name, width, height, defaultMaterial, personSize };
  dressEntrance.addPerson(personInfo);
}
// 添加人物各部分装饰方法
const addDress=({item,dressEntrance})=>{
  const { name, width, height, dataType, textureUrl } = item;
  console.log("装饰信息", item);
  const dressInfo = { name, width, height, dataType, textureUrl };
  dressEntrance.changeRoleDress(dressInfo);
}
const addScene=({item,dressEntrance})=>{
  const {name}=item
  const sceneInfo={name}
  dressEntrance.changeScene(sceneInfo)
  console.log("背景信息",item)}
export const addMaterial=new Proxy(
  {
  [Datatype.ROLE.id]:addRole,
  [Datatype.PROP.id]:addProp,
  [Datatype.SCENE.id]:addScene,
  default:addDress
  },
  {
    get(target, prop) {
      return prop in target ? target[prop] : target.default;
    }
  })
