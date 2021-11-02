import { Component } from "react";
import Taro from "@tarojs/taro";
import { checkUserAuth, isAdmin } from '../../../utils/auth';
import { View } from "@tarojs/components";
import ListView from '../../../components/ListView';

export default class CrystalList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNo: 1,
      total: 0,
      crystalList: [],
      collectList: [],
      position: "",
      series: ""
    };
    this.$instance = Taro.getCurrentInstance();
  }

  componentDidMount() {
    const { params } = this.$instance.router;
    Taro.setNavigationBarTitle({
      title: params.title
    });
    this.setState({
      position: params.id,
      series: params.seriesId || "",
      title: params.title
    }, () => {
      this.getCollectList();
      this.getListData(this.state.position, this.state.series);
    });
  }

  // 获取当前的收藏的信息
  getCollectList() {
    Taro.cloud.callFunction({
      name: "crystal_collect_list",
      success: res => {
        if (res.result.type !== "success") {
          this.setState({
            collectList: []
          });
          return;
        }
        this.setState({
          collectList: res.result.data
        });
      },
      fail: () => {
        this.setState({
          collectList: []
        });
      }
    });
  }

  handleViewImage(fileID) {
    Taro.previewImage({
      current: fileID,
      urls: [fileID]
    });
  }

  getListData(position = null, series = null, reset = false) {
    Taro.showLoading({
      title: "加载中"
    });
    Taro.cloud.callFunction({
      name: "crystal_list_by_position",
      data: {
        pageNo: this.state.pageNo,
        position,
        series
      },
      success: res => {
        Taro.hideLoading();

        if (res.result.type !== "success") {
          this.setState({
            crystalList: [],
            total: 0
          });
          return;
        }
        const data = res.result.data;

        this.setState((state, props) => ({
          crystalList:
            state.crystalList.length < data.total && !reset
              ? [...state.crystalList, ...data.list]
              : data.list,
          total: data.total
        }));
      },
      fail: () => {
        Taro.showToast({
          title: "加载失败"
        });
        Taro.hideLoading();
      }
    });
  }

  // 收藏
  async handleCollect(item) {
    let isAuth = await checkUserAuth();
    if (!isAuth) return;

    console.log('xx', this.state);
    const isCollected = this.state.collectList.includes(item._id);
    Taro.showLoading({
      title: isCollected ? "取消收藏中..." : "收藏中..."
    });
    Taro.cloud.callFunction({
      name: "crystal_collect",
      data: {
        id: item._id,
        collected: isCollected
      },
      success: async res => {
        await this.getCollectList();
        Taro.hideLoading();
        Taro.showToast({
          title: res.result.msg
        });
      },
      fail: () => {
        Taro.hideLoading();
      }
    });
  }

  // 到达底部
  onReachBottom() {
    const { crystalList, total } = this.state;
    if (crystalList.length < total) {
      this.setState(
        state => ({
          pageNo: state.pageNo + 1
        }),
        () => {
          this.getListData(this.state.position, this.state.series);
        }
      );
    }
  }

  async onPullDownRefresh() {
    await this.handleViewAll(this.state.position, this.state.series);
    Taro.stopPullDownRefresh();
  }

  // 管理员权限
  async handleLongPress(item) {
    console.log("handleTongTap");
    let hasAuth = await isAdmin();
    if (hasAuth) {
      // ! 待优化： 已被收藏的不能删除
      Taro.showModal({
        title: "提示",
        content: `确定要删除${item.model}吗？`,
        success: res => {
          if (res.confirm) {
            Taro.showLoading({
              title: "正在删除中..."
            });
            Taro.cloud.callFunction({
              name: "crystal_delete",
              data: {
                fileID: item.fileID,
                id: item._id
              },
              success: async resData => {
                await this.getCollectList();
                await this.handleViewAll();
                Taro.hideLoading();
                Taro.showToast({ title: resData.result.msg });
              }
            });
          }
        },
        fail: () => {
          Taro.hideLoading();
        }
      });
    }
  }

  render() {
    return <View>
      {/* 列表部分 */}
      <ListView
        crystalList={this.state.crystalList}
        collectList={this.state.collectList}
        total={this.state.total}
        longPress={true}
        handleLongPress={this.handleLongPress.bind(this)}
        handleViewImage={this.handleViewImage.bind(this)}
        handleCollect={this.handleCollect.bind(this)}
      />
    </View>
  }
}