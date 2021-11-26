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

exports.main = async (event, context) => {
  let fileID = '';
  try {
    const {
      name,
      model,
      position,
      series,
      fileIds,
      description
    } = event;
    const wxContext = cloud.getWXContext()

    if (position === '') {
      return {
        data: {},
        type: 'error',
        msg: '请填写完整数据'
      }
    }

    for (let i = 0; i < fileIds.length; i++) {
      await crystalFile.add({
        data: {
          name,
          model,
          fileID: fileIds[i],
          description,
          position,
          series,
          openId: wxContext.OPENID,
          createTime: new Date(),
          updateTime: new Date()
        }
      });
    }
    
    return {
      data: {},
      msg: '新增成功!',
      type: 'success'
    };
  }catch(e) {
    await cloud.deleteFile({
      fileList: [fileID],
      success: res => {
        // handle success
        console.log('success', res.fileList)
      },
      fail: err => {
        // handle error
      },
    });
    return {
      data: e,
      msg: '新增失败！',
      type: 'error'
    }
  }
}

