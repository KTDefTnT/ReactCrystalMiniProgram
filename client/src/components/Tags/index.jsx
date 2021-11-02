import { Component } from "react";
import { POSITIONS } from "../../core/constants";
import { View } from "@tarojs/components";
import { AtTag } from "taro-ui";

import "./index.scss";

export default class Tags extends Component {
  constructor(props) {
    super(props);
    this.state = {
      size: "small",
      type: "primary"
    };
  }

  render() {
    const {
      position = [],
      size = this.state.size,
      type = this.state.type
    } = this.props;
    const selectedList = POSITIONS.filter(item => position == item.id);

    return (
      <View className="tag-container">
        {selectedList.map(item => (
          <AtTag className="tag" type={type} size={size} name={item.id} active>
            {item.label}
          </AtTag>
        ))}
      </View>
    );
  }
}
