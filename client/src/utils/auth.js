import Taro from '@tarojs/taro'
const app = Taro.getApp().$app;


function checkUserRegister() {
  return new Promise((resolve, reject) => {
    Taro.cloud.callFunction({
      name: 'crystal_is_register',
      success: res => {
        if (res.result.type === 'error') {
          Taro.showModal({
            title: '提示',
            content: '您未授权，部分功能将不可使用',
            success: modelInfo => {
              if (modelInfo.confirm) {
                Taro.getUserProfile({
                  desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
                  success: user => {
                    
                    Taro.cloud.callFunction({
                      name: 'crystal_login',
                      data: {
                        userInfo: user.userInfo
                      },
                      success: resData => {
                        Taro.setStorage({
                          key: 'userInfo',
                          data: {
                            ...resData.result.data,
                            ...user.userInfo
                          }
                        })
                        resolve(true);
                      },
                      fail: () => {
                        resolve(false);
                      }
                    })
                  },
                  fail: () => {
                    Taro.showToast({
                      title: '您未授权，部分功能将不可使用'
                    });
                    resolve(false);
                  }
                });
              } else if (modelInfo.cancel) {
                Taro.showToast({
                  title: '您未授权，部分功能将不可使用'
                });
                resolve(false);
              }
            }
          });
        } else {
          Taro.setStorage({
            key: 'userInfo',
            data: res.result.data
          })
          resolve(true);
        }
      },
      fail: () => {
        resolve(false);
      }
    })
  });
}

function checkUserAuth() {
  return new Promise((resolve, reject) => {
    Taro.getStorage({
      key: 'userInfo',
      success: function (res) {
        resolve(true);
      },
      fail: async (res) => {
        const result = await checkUserRegister()
        resolve(result);
      }
    })
  });
}

function isAdmin () {
  return new Promise((resolve, reject) => {
    Taro.getStorage({
      key: 'userInfo',
      success: res => {
        let adminList = app.globalData.adminOpenIdList || [];
        resolve(adminList.includes(res.data.openId));
      },
      fail: () => {
        resolve(false);
      }
    });
  })
}

export {
  checkUserAuth,
  isAdmin
}