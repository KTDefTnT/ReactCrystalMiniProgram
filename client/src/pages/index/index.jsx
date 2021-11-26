import React, { Component } from "react";
import Taro from "@tarojs/taro";
import { checkUserAuth } from "../../utils/auth";

import { View, Canvas } from "@tarojs/components";
import Header from "@components/Header";
import CrystalTypes from "./CrystalTypes";

import ShareImg from "../../images/share.png";

import "./index.scss";

export default class Mine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNo: 1,
      total: 0
    };
  }

  componentDidShow() {
    checkUserAuth();
  }

  // 分享
  onShareAppMessage() {
    return {
      title: "仲远晶瓷画",
      path: "/pages/index/index",
      imageUrl: ShareImg
    };
  }

  // 查看某一个分类
  handleTypeClick(item) {
    if (item.hasOwnProperty('children') && item.children.length > 0) {
      Taro.navigateTo({
        url: `/pages/Types/seriesList/index?id=${item.id}&title=${item.label}`,
      });
    } else {
      Taro.navigateTo({
        url: `/pages/Types/crystalList/index?id=${item.id}&title=${item.label}`,
      });
    }
  }

  render() {
    return (
      <View className="index-container">
        <Header />
        <View className="content-container">
          {/* 搜索栏目 */}
          <CrystalTypes handleTypeClick={this.handleTypeClick}/>
        </View>
      </View>
    );
  }
}
