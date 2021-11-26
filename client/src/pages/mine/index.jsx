import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { checkUserAuth, isAdmin } from '@utils/auth';

import AvatarImg from '@images/mine/avatar.png';
import AboutUsImg from '@images/aboutUs.png';
import PaintingImg from '@images/painting.png';
import CollectActiveImg from '@images/collect_active.png';
import ShareImg from '@images/share.png';

import { View, Image } from '@tarojs/components'
import { AtList, AtListItem } from 'taro-ui';

import './index.scss'

export default class Mine extends Component {
  constructor (props) {
    super(props);
    this.state = {
      userInfo: {},
      hasAuth: false
    }
  }

  async componentDidShow () {
    let isAuth = await checkUserAuth(); // 用户授权
    if (isAuth) {
      Taro.getStorage({
        key: 'userInfo',
        success: res => {
          this.setState({
            userInfo: res.data
          });
        },
        fail: () => {
          this.setState({
            userInfo: {}
          });
        }
      });
    }
    
    let hasAuth = await isAdmin();
    this.setState({
      hasAuth
    });
  }

  onShareAppMessage() {
    return {
      title: '仲远晶瓷画',
      path: '/pages/index/index',
      imageUrl: ShareImg
    };
  }

  linkTo = async (url) => {
    let isAuth = await checkUserAuth();
    if (!isAuth) return;
    Taro.navigateTo({
      url
    })
  }

  handleLogin(){
    checkUserAuth();
  }

  render () {
    const { userInfo, hasAuth } = this.state;
    return (
      <View className='mine-container'>
        <View className="header">
          {/* <View className="wave"></View> */}
          <View className="content">
            <Image className="avatar" src={userInfo.avatarUrl ? userInfo.avatarUrl : AvatarImg} onClick={this.handleLogin.bind(this)}></Image>
            <View className="user-info">{userInfo.nickName}</View>
          </View>
        </View>
        <View className="mine-list">
          <AtList>
            <AtListItem
              title='我的收藏'
              arrow='right'
              thumb={CollectActiveImg}
              onClick={this.linkTo.bind(this, '/pages/MineList/collectList/index')}
            />
            {
              hasAuth && <AtListItem
                title='新增晶瓷画'
                arrow='right'
                thumb={PaintingImg}
                onClick={this.linkTo.bind(this, '/pages/MineList/paintingAdd/index')}
              />
            }
            <AtListItem
              title='关于我们'
              arrow='right'
              thumb={AboutUsImg}
              onClick={this.linkTo.bind(this, '/pages/MineList/aboutUs/index')}
            />
          </AtList>
        </View>
      </View>
    )
  }
}
