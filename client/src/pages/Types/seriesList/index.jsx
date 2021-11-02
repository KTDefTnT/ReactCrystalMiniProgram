import React, { Component } from "react";
import Taro from "@tarojs/taro";

import { View, Canvas } from "@tarojs/components";
import ListView from "../components/listView";
import Header from "@components/Header";
import { POSITIONS } from "../../../core/constants";

import ShareImg from "../../../images/share.png";

import "./index.scss";

export default class Mine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      positionId: '',
      title: ''
    };
    this.$instance = Taro.getCurrentInstance();
  }

  componentDidMount() {
    const { params } = this.$instance.router;
    Taro.setNavigationBarTitle({
      title: params.title
    });
    let seriesList = POSITIONS.filter(item => item.id === params.id)[0].children;
    this.setState({
      positionId: params.id,
      title: params.title,
      data: seriesList
    });
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
    const { positionId } = this.state;
    Taro.navigateTo({
      url: `/pages/Types/crystalList/index?id=${positionId}&title=${item.label}&seriesId=${item.id}`,
    });
  }

  render() {
    const { data } = this.state;
    return (
      <View className="index-container">
        <Header />
        <View className="content-container">
          {/* 搜索栏目 */}
          <ListView handleTypeClick={this.handleTypeClick.bind(this)} data={data} />
        </View>
      </View>
    );
  }
}
