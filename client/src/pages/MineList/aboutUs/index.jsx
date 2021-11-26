import React, { Component } from 'react'
import Taro from '@tarojs/taro'

import { View, Button  } from '@tarojs/components'
import './index.scss'

export default class AboutUs extends Component {
  render () {
    return (
      <View className="about-us-container">
        <View className="name">关于晶瓷画</View>
        <View className="description">
        晶瓷画采用微喷转印技术配合优等水晶材料，利用全新
          热熔工艺技术和专用设备经过简单工序把高清图案热熔入水晶材料上，
          使画和水晶材料浑然一体后，中间没有空气与杂质，表面晶莹剔透，像玉瓷一般效果，有着高端的艺术价值。画面几十年不变色 ，防潮，防摔，易擦洗。图像清晰逼真、色彩艳丽，经热熔工艺处理好后
          ，画面剔透晶莹，效果如同水晶，边缘呈流线型，画与背板浑然一体，具有的视觉享受。画面与空气隔绝，防止氧化，永久保真不褪色、耐水防潮、抗腐耐磨、抗紫外线。打破了传统装饰画和拉米娜单一的直板造型，造型设计丰富多样，让每一件产品具有灵魂，突显其无与伦比的尊贵，其迎合了现代人对生活艺术的需求，值得去珍藏、欣赏。
        </View>
        {/* <View className="name">地址</View>
        <View className="description">
          湖北省襄阳市樊城区高新区团山镇陆寨八组78号
        </View>
        <View className="name">联系方式</View>
        <View className="description link">
          <View>胡女士：17665411515</View>
          <View>王先生：19971616843</View>
        </View> */}
        <View className="share">
          <Button className="share-button" open-type="share">推荐给好友</Button>
        </View>
      </View>
    );
  }
}