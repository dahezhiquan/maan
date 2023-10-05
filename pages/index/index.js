// index.js
// 获取应用实例
const app = getApp()

// 接口基准地址
const baseUrl = "https://maan-46168-8-1317785375.sh.run.tcloudbase.com/";

Page({
    data: {

    },
    // 事件处理函数
    bindViewTap() {},
    onLoad() {},
    getUserProfile(e) {},
    getUserInfo(e) {}
})

Component({
    data: {
        // 是否展示无法识别外网IP的违法提示
        isCantScanTip: true,
        // 底部导航栏
        value: 'label_1',
        list: [{
                value: 'label_1',
                label: '识别',
                icon: 'photo'
            },
            {
                value: 'label_2',
                label: '情报',
                icon: 'tips'
            },
            {
                value: 'label_3',
                label: '举报',
                icon: 'chart-bubble'
            },
        ],

        // 轮播图数据
        current: 1,
        autoplay: true,
        duration: 500,
        interval: 5000,
        // 轮播图图片
        swiperList: [],
        navigation: {
            type: 'dots-bar'
        },
        paginationPosition: 'right',

        // 文本输入框
        style: 'height: 248rpx',
        qrtextbox: '',

        // 宫格图片
        img1: '/pages/index/static/img/safescan.png',
        img2: '/pages/index/static/img/safeinfo.png',
        img3: '/pages/index/static/img/safereport.png',

        // 顶部notice
        visible: true,
        marquee1: {
            speed: 80,
            loop: -1,
            delay: 0,
        },
        marquee2: {
            speed: 60,
            loop: -1,
            delay: 0,
        },
        content: [],

        // 底部页脚footer
        text: 'Copyright ©2022-2023 MAAN. All Rights Reserved by klza',
        links: [
            [{
                    name: '合作伙伴： 微步情报社区',
                    url: 'https://x.threatbook.com/',
                    openType: 'navigate',
                },
                {
                    name: '奇安信鹰图',
                    url: 'https://hunter.qianxin.com/',
                    openType: 'navigateBack',
                },
            ],
        ],


    },

    // 组件所在页面的生命周期声明对象
    pageLifetimes: {
        // 页面被展示
        show: function () {
            // 获取公告数据
            wx.cloud.callContainer({
                "config": {
                    "env": "prod-1g9947tcafae183c"
                },
                "path": "/index/notice",
                "header": {
                    "X-WX-SERVICE": "maan",
                    "content-type": "application/json"
                },
                "method": "GET",
                "data": "",
                success: (res) => {
                    this.setData({
                        content: res.data.data.notice_list,
                    });
                },
            })
            // 获取轮播图数据
            wx.cloud.callContainer({
                "config": {
                    "env": "prod-1g9947tcafae183c"
                },
                "path": "/index/picture",
                "header": {
                    "X-WX-SERVICE": "maan",
                    "content-type": "application/json"
                },
                "method": "GET",
                "data": {
                    "type": "indexswiper"
                },
                success: (res) => {
                    this.setData({
                        swiperList: res.data.data.picture_list,
                    });
                },
            })
        },
        // 页面被隐藏
        hide: function () {},
        // 页面尺寸变化
        resize: function () {},
    },

    methods: {
        onChange(e) {
            this.setData({
                value: e.detail.value,
            });

            const {
                detail: {
                    current,
                    source
                },
            } = e;
            console.log(current, source);

        },

        // 轮播图
        onAutoplayChange(e) {
            this.setData({
                autoplay: e.detail.value,
            });
        },
        onIntervalChange(e) {
            this.setData({
                interval: e.detail.value,
            });
        },
        onDurationChange(e) {
            this.setData({
                duration: e.detail.value,
            });
        },

        toIntelligencePage() {
            // 跳转到扫描结果页
            wx.redirectTo({
                url: '/pages/intelligence/index'
            })
        },

        // 点击安全扫描组件
        securityscan(e) {
            // 调起客户端扫码
            wx.scanCode({
                success(res) {
                    wx.showLoading({
                        title: '风控引擎识别中...',
                    });
                    console.log(res);
                    // 将res发送给后端，并进行风险解析
                    wx.cloud.callContainer({
                        "config": {
                            "env": "prod-1g9947tcafae183c"
                        },
                        "path": "/scan/info",
                        "header": {
                            "X-WX-SERVICE": "maan",
                            "content-type": "application/json"
                        },
                        "method": "GET",
                        "data": {
                            "content": res.result
                        },
                        success: (res2) => {
                            console.log(res2)
                            // 跳转到扫描结果页
                            wx.redirectTo({
                                url: '/pages/scan_result/index?ipAddr=' + res2.data.data.ip_addr + '&mvss=' + res2.data.data.mvss + '&risk=' + res2.data.data.risk_type + '&isdfa=' + res2.data.data.is_pass_dfa + '&urltitle=' + res2.data.data.url_title + '&scanResult=' + res.result
                            })
                        },
                    })
                },
            })
        },

        // 用户手动输入解析数据的识别
        identify() {
            this.showLoading()
            console.log(this.data.qrtextbox);
            if (this.data.qrtextbox == "") {
                this.noContentTip()
            } else {
                // 将res发送给后端，并进行风险解析
                wx.cloud.callContainer({
                    "config": {
                        "env": "prod-1g9947tcafae183c"
                    },
                    "path": "/scan/info",
                    "header": {
                        "X-WX-SERVICE": "maan",
                        "content-type": "application/json"
                    },
                    "method": "GET",
                    "data": {
                        "content": this.data.qrtextbox
                    },
                    success: (res2) => {
                        this.setData({
                            isCantScanTip: false,
                        });
                        // 跳转到扫描结果页
                        wx.redirectTo({
                            url: '/pages/scan_result/index?ipAddr=' + res2.data.data.ip_addr + '&mvss=' + res2.data.data.mvss + '&risk=' + res2.data.data.risk_type + '&isdfa=' + res2.data.data.is_pass_dfa + '&urltitle=' + res2.data.data.url_title + '&scanResult=' + this.data.qrtextbox
                        })
                    },
                })
            }
        },

        // 识别loading
        showLoading() {
            wx.showLoading({
                title: '风控引擎识别中...',
            });
            // 模拟数据加载过程
            setTimeout(() => {
                // 隐藏加载动画
                wx.hideLoading();
                if (this.data.isCantScanTip == true) {
                    wx.showModal({
                        title: '声明',
                        content: '该二维码解析结果为外网IP，根据《中华人民共和国网络安全法》，我们无权对此IP地址进行解析，如想查看此二维码的IP归属地，请到情报中心查看，此二维码具有很大风险，请勿扫描！',
                    })
                }
            }, 6000);
        },

        // 没有输入任何内容的提示
        noContentTip() {
            wx.showToast({
                title: '没有输入任何内容哦~',
                icon: 'none', // 可选值：success, loading, none
                duration: 2000 // 提示的持续时间，单位毫秒
            })
        }

    },
});