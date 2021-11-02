import { Component } from "react";
import Taro from "@tarojs/taro";
import { View } from '@tarojs/components';

import './index.scss';

export default class Header extends Component {
  render() {
    return (
      <View className="banner">
        <View className="name">仲远晶瓷画</View>
      </View>
    );
  }
}
