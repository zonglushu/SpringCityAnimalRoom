// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
   // 获取数据库实例
   const db = cloud.database();
   // 图片fileID的前缀
   const fileIdPrefix='cloud://lovers-2ghufp1ec04bc518.6c6f-lovers-2ghufp1ec04bc518-1344238052'
   
   try {
    // 查询某个集合的所有数据
    
    const countResult = await db.collection('material').count();
    const total=countResult.total
    const result = await db.collection('material').limit(total).get() // 替换为你的集合名称
    // 获取临时文件链接
    const materialList=result.data;
    // 缩略图文件ID列表
    const thumbnailFileIDList=materialList.map(material=>fileIdPrefix + material.thumbnail)
    // 实际渲染图文件ID列表
    const textureFileIDList=materialList.map(material=> fileIdPrefix + material.textureUrl)

    const thumbnailFileUrlList= await cloud.getTempFileURL({
      fileList:thumbnailFileIDList,
    });
    const textureFileUrlList = await cloud.getTempFileURL({
      fileList: textureFileIDList,
    });
    // 将素材列表中的URL替换为临时URL
    const updatedMaterialList = materialList.map((material, index) => {
      return {
        ...material, // 保留素材的其他字段
        thumbnail: thumbnailFileUrlList.fileList[index].tempFileURL, // 替换缩略图URL
        textureUrl: textureFileUrlList.fileList[index].tempFileURL, // 替换实际渲染图URL
      };
    });
      
    return {
      code: 0,
      message: '查询成功',
      data: updatedMaterialList, // 返回查询到的数据
      
    };
  } catch (err) {
    return {
      code: -1,
      message: '查询失败',
      error: err,
    };
  }
}