import { Component } from "react";
import { View, Image, Text } from "@tarojs/components";
import Empty from "../empty/index.jsx";
import Tags from "../Tags/index.jsx";

import CollectActiveImg from "../../images/collect_active.png";
import CollectImg from "../../images/collect.png";

import "./index.scss";

const Node = ({
  item,
  isCollectList,
  collectList,
  handleLongPress,
  handleViewImage,
  handleCollect
}) => {
  return (
    <View className="crystal_item" onLongPress={() => handleLongPress(item)}>
      <Image
        mode="widthFix"
        className="crystal_image"
        src={item.fileID}
        onClick={() => handleViewImage(item.fileID)}
      ></Image>
      <View className="crystal_like">
        <Image
          onClick={() => handleCollect(item)}
          className="collect"
          src={
            isCollectList
              ? CollectActiveImg
              : collectList.includes(item._id)
              ? CollectActiveImg
              : CollectImg
          }
        ></Image>
      </View>
    </View>
  );
};
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
    const fileIds = this.props.crystalList.map(item => item.fileID);
    this.props.handleViewImage && this.props.handleViewImage(fileID, fileIds);
  }

  // 收藏
  handleCollect(item) {
    this.props.handleCollect && this.props.handleCollect(item);
  }

  render() {
    const { collectList, crystalList, total, isCollectList } = this.props;
    // let leftList = [];
    // let rightList = [];
    // for (let i = 0; i < crystalList.length; i++) {
    //   let item = crystalList[i];
    //   i % 2 ? rightList.push(item) : leftList.push(item);
    // }
    return (
      <View className="list">
        <View
          className={
            this.props.type === "horizontal"
              ? "horizontal_list crystal_list"
              : "crystal_list"
          }
        >
          <View className="crystal_queue">
            {crystalList.map(item => (
              <Node
                item={item}
                key={item._id}
                isCollectList={isCollectList}
                collectList={collectList}
                handleLongPress={this.handleLongPress.bind(this)}
                handleViewImage={this.handleViewImage.bind(this)}
                handleCollect={this.handleCollect.bind(this)}
              />
            ))}
          </View>
          {/* <View className="crystal_queue">
            {leftList.map(item => (
              <Node
                item={item}
                key={item._id}
                isCollectList={isCollectList}
                collectList={collectList}
                handleLongPress={this.handleLongPress.bind(this)}
                handleViewImage={this.handleViewImage.bind(this)}
                handleCollect={this.handleCollect.bind(this)}
              />
            ))}
          </View>

          <View className="crystal_queue">
            {rightList.map(item => (
              <Node
                item={item}
                key={item._id}
                isCollectList={isCollectList}
                collectList={collectList}
                handleLongPress={this.handleLongPress.bind(this)}
                handleViewImage={this.handleViewImage.bind(this)}
                handleCollect={this.handleCollect.bind(this)}
              />
            ))}
          </View> */}
        </View>
        {/* 提示 */}
        <Empty total={total} list={crystalList} />
      </View>
    );
  }
}
