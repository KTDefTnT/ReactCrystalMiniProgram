// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
// 晶瓷画数据表
const crystalUsers = db.collection('crystal_users');

/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 * 
 * event 参数包含小程序端调用传入的 data
 * 
 */
exports.main = async (event, context) => {
   // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）等信息
   const wxContext = cloud.getWXContext()
  // 查看当前用户是否已存在
  try {
    const { OPENID, APPID } = wxContext;
    const { userInfo } = event;

    const existUser = await crystalUsers.where({
      openId: OPENID
    }).get();

    if (Object.keys(existUser.data).length !== 0) {
      return {
        data: {},
        type: 'error',
        msg: '该用户已注册'
      };
    }
    await crystalUsers.add({
      data: {
        appId: APPID,
        openId: OPENID,
        createTime: new Date(),
        idList: [],
        ...userInfo
      }
    })

    return {
      data: {
        appId: APPID,
        openId: OPENID,
        createTime: new Date(),
        ...userInfo
      },
      type: 'success',
      msg: '注册成功！'
    }
  }catch(e) {
    return {
      data: e,
      type: 'error',
      msg: '服务器出错！请重试'
    };
  }
}

