// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
// 晶瓷画数据表
const crystalFile = db.collection('crystal_file');

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { OPENID } = wxContext;
  try {
    const { pageNo } = event;
    const _ = db.command;
    // 查询收藏的晶瓷画id
    const res = await cloud.callFunction({
      name: 'crystal_collect_list',
      data: {
        openId: OPENID
      }
    });

    const totalList = await crystalFile.aggregate()
      .match({
        _id: _.in(res.result.data)
      })
      .count('total')
      .end();

    const resData = await crystalFile.aggregate()
      .match({
        _id: _.in(res.result.data)
      })
      .skip((pageNo - 1) * 10)
      .limit(10)
      .end();

      console.log('resData', resData);
      return {
        data: {
          list: resData.list,
          total: totalList.list.length > 0 ? totalList.list[0].total : 0,
          pageNo
        },
        msg: '查询成功',
        type: 'success'
      }
  } catch (e) {
    return {
      data: e,
      msg: '查询失败',
      type: 'error'
    }
  }
}