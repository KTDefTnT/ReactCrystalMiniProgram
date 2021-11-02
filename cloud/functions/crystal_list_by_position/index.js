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
  // const wxContext = cloud.getWXContext()
  try {
    const { pageNo, position, series } = event;
    console.log('position', position, 'series', series);
    const _ = db.command;
    const totalList = await crystalFile.aggregate()
      .match({
        position:_.eq(position),
        series: series ? _.eq(series) : ""
      })
      .count('total')
      .end();

    const resData = await crystalFile.aggregate()
      .match({
        position: _.eq(position),
        series: series ? _.eq(series) : ""
      })
      .skip((pageNo - 1) * 10)
      .limit(10)
      .end();

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