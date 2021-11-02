import React, { Component } from "react";
import Taro from "@tarojs/taro";
import { View, Picker } from "@tarojs/components";
import SheetCheckBox from "@components/SheetCheckBox";

import ShareImg from "@images/share.png";
import { POSITIONS, SERIES } from "@core/constants";
import "./index.scss";

import {
  AtTextarea,
  AtImagePicker,
  AtForm,
  AtInput,
  AtList,
  AtListItem,
  AtButton
} from "taro-ui";

// const options = [POSITIONS, POSITIONS[0].children];
export default class PaintingAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "", // 名称
      description: "", // 描述
      files: [], // 图片
      model: "", // 类型
      position: "", // 类型
      crystalName: "",
      series: "", // 系列
      value: [0, 0],
      typeSeries: "",
      index: '',
      // positionOptions: options,
      isOpened: false
    };
  }

  onShareAppMessage() {
    return {
      title: "仲远晶瓷画",
      path: "/pages/index/index",
      imageUrl: ShareImg
    };
  }

  handleDescriptionChange = description => {
    this.setState({
      description
    });
  };

  handleUpload = files => {
    this.setState({
      files
    });
  };

  handleModelChange = model => {
    this.setState({
      model
    });
    return model;
  };

  handleNameChange = name => {
    this.setState({
      name
    });
    return name;
  };

  onColumnChange = e => {
    let index = e.detail.value;
    let column = e.detail.column;
    let prevValue = this.state.value;
    this.setState(prevState => ({
      positionOptions:
        column === 0
          ? [POSITIONS, POSITIONS[index].children || []]
          : prevState.positionOptions,
      value: column === 0 ? [index, 0] : [prevValue[0], index]
    }));
  };

  multiPickerChange = e => {
    // 选中的分类
    const selectedPosition = POSITIONS[e.detail.value[0]];
    const series = e.detail.value[1];
    // 选中的系列
    const selectedSeries = selectedPosition.hasOwnProperty("children")
      ? selectedPosition.children[series]
      : "";
    let typeSeries = selectedSeries
      ? selectedPosition.label
      : `${selectedPosition.label}/${selectedSeries.label}`;
    this.setState({
      position: selectedPosition.id,
      series: selectedSeries ? selectedSeries.id : "",
      typeSeries
    });
  };

  // 单个选择
  handlePickerChange = e => {
    console.log('333', e);
    let index = e.detail.value;
    const selectedPosition = POSITIONS[index];
    this.setState({
      index,
      position: selectedPosition.id,
      crystalName: selectedPosition.label
    });
  }

  // 重置
  reset = () => {
    this.setState({
      name: "", // 名称
      description: "", // 描述
      files: [], // 图片
      model: "", // 类型
      position: "", // 类型
      crystalName: "",
      series: "", // 系列
      value: [0, 0],
      index: "",
      typeSeries: "",
      // positionOptions: options,
      isOpened: false
    })
  }

  onSubmit = () => {
    if (this.state.files.length === 0) {
      Taro.showToast({
        title: "请上传图片",
        icon: "none",
        duration: 500
      });
      return;
    }
    const { files, position, series, model, description, name } = this.state;
    Taro.showLoading({
      title: "晶瓷画新增中..."
    });
    Taro.getFileSystemManager().readFile({
      filePath: files[0].url, //选择图片返回的相对路径
      encoding: "base64", //编码格式
      success: res => {
        //成功的回调
        Taro.cloud.callFunction({
          name: "crystal_upload",
          data: {
            path: `${model}_${Math.floor(Math.random() * 100000)}.png`,
            file: res.data,
            position,
            series,
            model,
            name,
            description
          },
          success: _res => {
            Taro.showToast({
              title: _res.result.msg,
              icon: _res.result.type,
              duration: 500
            });
            Taro.hideLoading();
            Taro.showModal({
              title: "提示",
              content: "是否需要继续新增?",
              success: modelInfo => {
                if (modelInfo.confirm) {
                  this.reset();
                } else if (modelInfo.cancel) {
                  Taro.switchTab({
                    url: "/pages/mine/index"
                  });
                }
              }
            });
          },
          fail(_res) {
            Taro.hideLoading();
          }
        });
      }
    });
    console.log("onSubmit", this.state);
  };

  render() {
    const {
      description,
      files,
      crystalName,
      name,
      model,
      positionOptions,
      index
    } = this.state;
    return (
      <View className="index">
        <AtForm>
          <AtTextarea
            className="textarea_container"
            value={description}
            onChange={this.handleDescriptionChange.bind(this)}
            maxLength={200}
            placeholder="请输入您的描述"
          />
          <AtImagePicker
            className="image_picker"
            files={files}
            onChange={this.handleUpload.bind(this)}
          />
          <Picker
            onChange={this.handlePickerChange.bind(this)}
            range={POSITIONS}
            value={index}
            rangeKey="label"
          >
            <AtList>
              <AtListItem title="系列" arrow="right" extraText={crystalName} />
            </AtList>
          </Picker>
          {/* <Picker
            mode="multiSelector"
            onChange={this.multiPickerChange.bind(this)}
            onColumnChange={this.onColumnChange.bind(this)}
            value={value}
            range={positionOptions}
            rangeKey="label"
          >
            <AtList>
              <AtListItem title="系列" arrow="right" extraText={typeSeries} />
            </AtList>
          </Picker> */}
          <AtInput
            title="名称"
            type="text"
            placeholder="名称"
            value={name}
            name="name"
            onChange={this.handleNameChange.bind(this)}
          />
          <AtInput
            clear
            title="型号"
            type="text"
            placeholder="型号"
            value={model}
            name="model"
            onChange={this.handleModelChange.bind(this)}
          />
        </AtForm>
        <AtButton
          className="submit_bottom"
          type="primary"
          onClick={this.onSubmit.bind(this)}
        >
          提交
        </AtButton>
      </View>
    );
  }
}
