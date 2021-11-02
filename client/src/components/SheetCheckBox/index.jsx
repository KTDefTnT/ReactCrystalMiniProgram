import { Component } from "react";
import { View } from "@tarojs/components";
import { AtActionSheet, AtCheckbox } from "taro-ui";

// import { POSITIONS } from "../../core/constants";

import './index.scss';

export default class SheetCheckBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpened: false,
      checkedList: []
    };
  }

  handleChange(value) {
    this.setState({
      checkedList: value
    })
  }

  // 取消选择
  handleCancel() {
    this.props.cancel && this.props.cancel();
    this.setState({
      isOpened: false
    });
  }

  // 选中
  handleConfirm() {
    let selectedList = this.props.data.filter(item => this.state.checkedList.includes(item.value));
    this.props.confirm && this.props.confirm(this.state.checkedList, selectedList);
    this.setState({
      isOpened: false
    });
  }

  render() {
    const { isOpened } = this.state;
    const { data } = this.props;
    const title = (
      <View className="sheet-check-box__title">
        <View className="sheet-check-box__cancel" onClick={this.handleCancel.bind(this)}>取消</View>
        <View className="sheet-check-box__confirm" onClick={this.handleConfirm.bind(this)}>确定</View>
      </View>
    );
    return (
      <View className="sheet-check-box">
        <AtActionSheet isOpened={this.props.isOpened || isOpened} title={title}>
          <AtCheckbox
            options={data}
            selectedList={this.state.checkedList}
            onChange={this.handleChange.bind(this)}
          />
        </AtActionSheet>
      </View>
    );
  }
}
