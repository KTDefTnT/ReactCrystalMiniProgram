import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { checkUserAuth } from '@utils/auth';

import { View, Image, Text } from '@tarojs/components'
import Empty from '@components/empty/index.jsx';

import CollectActiveImg from '@images/collect_active.png';
import ListView from '../../../components/ListView';
import ShareImg from '@images/share.png';

import './index.scss'

export default class CollectList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      // collectList: [],
      crystalList: [],
      pageNo: 1,
      total: 0,
      positionClass: {
        '玄关': 'primary',
        '餐厅': 'primary3',
        '客厅': 'primary1',
        '卧室': 'primary2'
      }
    }
  }

  onLoad () {
    this.getListData();
  }

  onShareAppMessage() {
    return {
      title: '仲远晶瓷画',
      path: '/pages/index/index',
      imageUrl: ShareImg
    };
  }

  handleViewImage (fileID) {
    Taro.previewImage({
      current: fileID,
      urls: [fileID]
    });
  }

  getListData () {
    Taro.showLoading({
      title: '加载中',
    });
    Taro.cloud.callFunction({
      name:'crystal_get_collect_list',
      data:{
        pageNo: this.state.pageNo
      },
      success: res => {
        Taro.hideLoading();
        if (res.result.type !== 'success') {
          this.setState({
            crystalList: [],
            total: 0
          });
          return;
        }
        const data = res.result.data;
        
        this.setState((state, props) => ({
          crystalList: state.crystalList.length < data.total
            ? [...state.crystalList, ...data.list]
            : data.list,
          total: data.total
        }));
      },
      fail: () => {
        Taro.showToast({
          title: '加载失败',
        });
        Taro.hideLoading();
      }
    });
  }

  // getCollectList () {
  //   Taro.cloud.callFunction({
  //     name:'crystal_collect_list',
  //     success: res => {
  //       if (res.result.type !== 'success') {
  //         this.setState({
  //           collectList: []
  //         });
  //         return;
  //       }
  //       this.setState({
  //         collectList: res.result.data
  //       });
  //     },
  //     fail: () => {
  //       this.setState({
  //         collectList: []
  //       });
  //     }
  //   });
  // }

  async handleCollect(item) {
    let isAuth = await checkUserAuth();
    if (!isAuth) return;
    Taro.showLoading({
      title: '取消收藏中...'
    });
    Taro.cloud.callFunction({
      name: 'crystal_collect',
      data: {
        id: item._id,
        collected: true
      },
      success: async res => {
        this.getListData();
        Taro.hideLoading();
        Taro.showToast({
          title: res.result.msg
        });
      },
      fail: () => {
        this.getListData();
        Taro.hideLoading();
      }
    });
  }

  // 到达底部
  onReachBottom () {
    const { crystalList, total } = this.state;
    if (total > crystalList.length) {
      this.setState((state)=>({
        pageNo: state.pageNo++
      }), () =>{
        this.getListData();
      });
    }
  }
  
  async onPullDownRefresh () {
    await this.getListData();
    Taro.stopPullDownRefresh();
  }

  render () {
    const { crystalList, positionClass, total } = this.state;
    return (
      <View>
        {/* 列表部分 */}
        <ListView
          crystalList={this.state.crystalList}
          isCollectList={true}
          total={this.state.total}
          handleViewImage={this.handleViewImage.bind(this)}
          handleCollect={this.handleCollect.bind(this)}
        />
      </View>
    );
  }
}