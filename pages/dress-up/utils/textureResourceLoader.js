// 还是有一定风险，调用前必须要初始化，但是不知道有没有进行，所以要把创建
// miniPIXI和初始化放一起
export class TextureResourceLoader{
  
  // 静态属性，用于存储纹理缓存和 PIXI 实例
  static textureCache = new Map();
  static PIXI = null;
  // 初始化静态属性
  static initialize(PIXI) {
    TextureResourceLoader.PIXI = PIXI;
  }
  // 加载单个纹理（带缓存）
  static async loadTexture(name, textureUrl) {
    if (this.textureCache.has(name)) {
      return this.textureCache.get(name);
    }
    const texture = await this.PIXI.Assets.load(textureUrl);
    this.textureCache.set(name, texture);
    return texture;
  }
  // 通过name返回对应图片纹理对象
  static getTextureFromCache(name){
    // 检查 Map 中是否存在以 name 为键的纹理对象
    if (this.textureCache.has(name)) {
      return this.textureCache.get(name); // 返回对应的纹理对象
    }

    // 如果找不到，抛出错误
    throw new Error(`Texture with name "${name}" not found in cache.`);
  } 

  // 根据 dataType 进行优先级加载
  static async priorityLoadByDataType(materialList, priorityTypes, onProgress) {
    const total = materialList.length;
    let loaded = 0;

    // 优先加载高优先级的资源
    const highPriorityMaterials = materialList.filter((material) =>
      priorityTypes.includes(material.dataType)
    );
    await Promise.all(
      highPriorityMaterials.map(async (material) => {
        await this.loadTexture(material.name, material.textureUrl);
        loaded++;
        onProgress?.(Math.ceil((loaded / total) * 100));
      })
    );

    // 延迟加载其他资源
    const lowPriorityMaterials = materialList.filter(
      (material) => !priorityTypes.includes(material.dataType)
    );
    console.log(lowPriorityMaterials)
    for (const material of lowPriorityMaterials) {
      await this.loadTexture(material.name, material.textureUrl);
      loaded++;
      onProgress?.(Math.ceil((loaded / total) * 100));
    }
    console.log(this.textureCache)
  }
  
}
