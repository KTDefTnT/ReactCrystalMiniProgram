import { Component } from "react";
import { View, Image } from "@tarojs/components";
import Box from "../../../../images/painting/box.png";
import "./index.scss";

export default class ListView extends Component {
  handleTypeClick(item) {
    this.props.handleTypeClick && this.props.handleTypeClick(item);
  }

  render() {
    const { data } = this.props;
    return (
      <View className="list">
        {data.map(item => (
          <View className={`item bg_${item.id.slice(-1)}`} onClick={this.handleTypeClick.bind(this, item)}>
            <View className="item_content">{item.label}</View>
            <Image src={Box} />
          </View>
        ))}
      </View>
    );
  }
}
