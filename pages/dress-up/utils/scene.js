export default class Scene{


  //使用dressEntrence，会给entrence传入sceneInfo，包括名称和在本地的路径,也就是他的核心思想就是
  //先把所有的资源给PIXI的loader,然后给出一个屏幕信息，让scene去找。
  // tabs只是展示的缩略图，真正要换装的时候，还是要把所有图片都放上去

  // dressEntrence 预先加载好所有的资源，然后不管什么东西要图片资源了，都去loader里面加载



  // app是整个换装游戏的PIXI应用，sceneInfo是整个屏幕的信息，如宽高
  constructor(app, sceneInfo) {
    this.app = app;
    this.sceneInfo = sceneInfo;
    this.create();
  }

  create(){
    // 从屏幕信息将名称和图片url解析出来
    const {name,url}=this.sceneInfo||{}
    if(!url || !name){
      return;
    }
    // 从整个换装游戏的PIXI应用中将stage这个根元素拿出来
    const {screen,stage}=this.app

  }
}