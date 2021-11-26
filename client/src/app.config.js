export default {
  pages: [
    "pages/index/index",

    // "pages/paintingAdd/index",

    "pages/mine/index",
    // "pages/aboutUs/index",
    // 'pages/crystalList/index',

    // "pages/collectList/index"
    // 'pages/seriesList/index',
  ],
  subPackages: [
    {
      root: "pages/Types/",
      pages: ["crystalList/index", "seriesList/index"]
    },
    {
      root: "pages/MineList/",
      pages: ["paintingAdd/index", "aboutUs/index", "collectList/index"]
    }
  ],
  tabBar: {
    color: "#666",
    selectedColor: "#1fc7b0",
    backgroundColor: "#fff",
    list: [
      {
        pagePath: "pages/index/index",
        text: "首页",
        iconPath: "images/home.png",
        selectedIconPath: "images/home_selected.png"
      },
      {
        pagePath: "pages/mine/index",
        text: "我的",
        iconPath: "images/mine.png",
        selectedIconPath: "images/mine_selected.png"
      }
    ]
  },
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black",
    onReachBottomDistance: 100,
    enablePullDownRefresh: true
  },
  cloud: true,
  enableShareTimeline: true
};
