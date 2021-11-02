import { Component } from "react";
import { View, Image, Text } from "@tarojs/components";
import Empty from "../empty/index.jsx";
import Tags from "../Tags/index.jsx";

import CollectActiveImg from "../../images/collect_active.png";
import CollectImg from "../../images/collect.png";

import "./index.scss";

export default class ListView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      longPress: false
    };
  }

  // 长按删除
  handleLongPress(item) {
    if (this.state.longPress || this.props.longPress) {
      this.props.handleLongPress(item);
    }
  }

  // 浏览图片
  handleViewImage(fileID) {
    this.props.handleViewImage && this.props.handleViewImage(fileID);
  }

  // 收藏
  handleCollect(item) {
    this.props.handleCollect && this.props.handleCollect(item);
  }

  render() {
    const { collectList, crystalList, total } = this.props;
    return (
      <View className="list">
        <View
          className={
            this.props.type === "horizontal"
              ? "horizontal_list crystal_list"
              : "crystal_list"
          }
        >
          {crystalList.map(item => {
            return (
              <View
                className="crystal_item"
                onLongPress={this.handleLongPress.bind(this, item)}
              >
                <Image
                  mode="widthFix"
                  className="crystal_image"
                  src={item.fileID}
                  onClick={this.handleViewImage.bind(this, item.fileID)}
                ></Image>
                <View className="crystal_content">
                  <View className="crystal_model">{item.model}</View>
                  <View className="crystal_desc">{item.description}</View>
                  <View className="crystal_info">
                    <Tags position={item.position} />
                    <View className="crystal_like">
                      <Image
                        onClick={this.handleCollect.bind(this, item)}
                        className="collect"
                        src={
                          collectList.includes(item._id)
                            ? CollectActiveImg
                            : CollectImg
                        }
                      ></Image>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
        {/* 提示 */}
        <Empty total={total} list={crystalList} />
      </View>
    );
  }
}
