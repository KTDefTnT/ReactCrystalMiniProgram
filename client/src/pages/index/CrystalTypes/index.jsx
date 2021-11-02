import { Component } from "react";

import { POSITIONS } from "../../../core/constants";
import { View, Image, Text } from "@tarojs/components";
import { AtGrid } from "taro-ui";

import "./index.scss";

export default class CrystalTypes extends Component {
  handleTypeClick(item) {
    this.props.handleTypeClick && this.props.handleTypeClick(item);
  }

  render() {
    const data = POSITIONS.map(item => {
      item.value = item.label;
      return item;
    });
    return (
      <View className="crystal-types">
        <AtGrid
          data={data}
          mode="square"
          columnNum={4}
          onClick={this.handleTypeClick.bind(this)}
        />
      </View>
    );
  }
}
