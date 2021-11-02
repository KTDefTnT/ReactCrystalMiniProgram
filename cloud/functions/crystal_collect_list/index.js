// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
// 晶瓷画数据表
const crystalUsers = db.collection('crystal_users');

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { OPENID = '' } = wxContext;
  const { openId } = event;
  try {
    console.log('OPENID', OPENID);
    const userInfo = await crystalUsers.where({
      openId: OPENID || openId
    }).get();
    return {
      data: userInfo.data[0].idList,
      type: 'success',
      msg: '查询成功'
    }
  } catch(e) {
    return {
      data: [],
      type: 'error',
      msg: '查询失败'
    }
  }
}