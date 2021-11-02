import React, { Component } from 'react'
import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';

import EmptyCollect from './images/empty_collect.png';
import EmptyData from './images/empty_data.png';

import './index.scss';

export default class Empty extends Component {
  constructor(props){
    super(props);
    this.state = {
      imageList: {
        data: EmptyData,
        collect: EmptyCollect
      }
    };
  }

  render() { 
    const { total = 0, list = [], type = 'data', emptyTitle = '暂无数据！', noMoreTitle='没有更多了' } = this.props;
    const { imageList } = this.state;

    return (
      <View className="empty_container">
        {
          (list.length >= total && total !== 0) && <View className="notice">{noMoreTitle}</View>
        }
        {
          (total === 0 && list.length ===0) && (
            <View>
              <Image mode="widthFix" src={imageList[type]}></Image>
              <View className="notice">{emptyTitle}</View>
            </View>
          )
        }
      </View>
    );
  }
}