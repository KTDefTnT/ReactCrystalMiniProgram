// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

exports.main = async (event, context) => {
  let fileID = '';
  try {
    const {
      name,
      model,
      position,
      series,
      description
    } = event;
    const wxContext = cloud.getWXContext()
    const crystalFile = db.collection('crystal_file');

    if (position === '') {
      return {
        data: {},
        type: 'error',
        msg: '请填写完整数据'
      }
    }

    const existList = await crystalFile.where({
      model
    }).get();


    let data = await cloud.uploadFile({
      cloudPath: `crystal/${event.path}`,
      fileContent: Buffer.from(event.file, 'base64'),
    });
    fileID = data.fileID;

    await crystalFile.add({
      data: {
        name,
        model,
        fileID,
        description,
        position,
        series,
        openId: wxContext.OPENID,
        createTime: new Date(),
        updateTime: new Date()
      }
    });
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

