// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const { fileID, id } = event;
  let deleteResult = {};
  try {
    const crystalFile = db.collection('crystal_file');
    // 获取当前的数据信息
    const currInfo = await crystalFile.where({
      _id: id
    }).get();

    // 删除crystalFile的数据
    const resData = await crystalFile.where({
      _id: id
    }).remove();
    
    if (resData.stats.removed !== 0) {
      // 删除文件
      deleteResult = await cloud.deleteFile({
        fileList: [fileID]
      });
    }

    // 若有了deleteResult的数据 且stats不为0： 删除操作记录成功，但是删除文件不成功
    if(Object.keys(deleteResult).length === 0 && deleteResult.fileList.stats !== 0) {
      // 将数据还原
      crystalFile.add({data: currInfo.data[0]});
      return {
        data: {},
        msg: '删除失败！',
        type: 'error'
      }
    }
    
    return {
      data: {},
      msg: '删除成功！',
      type: 'success'
    }
  } catch(e) {
    return {
      data: e,
      msg: '删除失败,服务器出错！',
      type: 'error'
    }
  }
}