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
//
export const dressSpriteStyles = {
  HAIR: (params) => {
    const { sprite, person,personContanierHeight } = params;
    sprite.x = 0;
    sprite.y = -personContanierHeight / 2;
    sprite.zIndex = 1;
  },
  FACE: (params) => {
    const { sprite, person } = params;
    const hairSprite = person[Datatype.HAIR.name];
    sprite.x = hairSprite.x;
    sprite.y = hairSprite.y;
    sprite.zIndex = 2;
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
};

