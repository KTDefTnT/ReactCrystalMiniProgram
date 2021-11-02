// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
// 晶瓷画数据表
const crystalUsers = db.collection('crystal_users');

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const { OPENID } = wxContext;
  const { id, collected } = event;
  
  const _ = db.command;
  
  try {
    // 用户已有收藏 更新
    const respData = await crystalUsers.where({
      openId: OPENID,
    }).update({
      data: {
        idList: collected ? _.pull(id) : _.push(id)
      }
    });
    return {
      data: {...respData},
      type: 'success',
      msg: collected ? '取消成功！' 
        : (respData.stats.updated === 0 ? '收藏失败': '收藏成功！')
    };
  } catch(e) {
    return {
      data: e,
      type: 'error',
      msg: '服务器出错！'
    }
  }
}