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
  try {
    const wxContext = cloud.getWXContext();
    const { OPENID } = wxContext;
    const resData = await crystalUsers.where({
      openId: OPENID
    }).get();
    console.log('resData', resData);
    return {
      data: resData.data[0],
      type: resData.data.length > 0 ? 'success' : 'error',
      msg: resData.data.length > 0 ? '查询成功' : '请登录！'
    }
  } catch(e) {
    return {
      data: [],
      type: 'error',
      msg: '请登录！'
    }
  }
}