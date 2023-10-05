// index.js
// 获取应用实例
const app = getApp()

// 接口基准地址
const baseUrl = "https://maan-46168-8-1317785375.sh.run.tcloudbase.com/";

Page({
    data: {},
    // 事件处理函数
    bindViewTap() {},
    onLoad() {},
    getUserProfile(e) {},
    getUserInfo(e) {}
})

Component({
    data: {
        resultList: [],
        mvss: '未知分数',
        scanResult: '未知结果',
        ipAddr: '未知地址',
        risk: '未知风险',
        isdfa: '未知',
        urltitle: '无',
    },

    // 组件所在页面的生命周期声明对象
    pageLifetimes: {
        // 页面被展示
        show: function () {
            // 获取路由参数
            let pages = getCurrentPages();
            let {
                options
            } = pages.pop();

            // 进行mvss判断
            let mvssNum = parseInt(options.mvss);
            if (mvssNum >= 80) {
                this.setData({
                    resultList: [{
                        title: '二维码安全',
                        theme: 'success',
                        description: '本次扫描的二维码无风险或风险水平极低',
                    }, ]
                });
            }
            if (mvssNum >= 60 && mvssNum < 80) {
                this.setData({
                    resultList: [{
                        title: '二维码警告',
                        theme: 'warning',
                        description: '本次扫描的二维码可能存在风险，予以警告',
                    }, ]
                });
            }

            if (mvssNum < 60) {
                if (options.isdfa == '1') {
                    this.setData({
                        resultList: [{
                            title: '二维码不安全（违法违规）',
                            theme: 'error',
                            description: '本次扫描的二维码存在很大的风险且违法违规，请勿使用其他软件扫描',
                        }, ]
                    });
                } else {
                    this.setData({
                        resultList: [{
                            title: '二维码不安全',
                            theme: 'error',
                            description: '本次扫描的二维码存在很大的风险，请勿使用其他软件扫描',
                        }, ]
                    });
                }
                // 短震动
                wx.vibrateShort({
                    success: function () {
                        console.log("短震动成功")
                    }
                })
            }

            if (options.isdfa == '1') {
                this.setData({
                    isdfa: "涉黄涉黑涉政"
                });
            }

            // 将路由参数发送
            this.setData({
                scanResult: options.scanResult,
                ipAddr: options.ipAddr,
                mvss: options.mvss,
                risk: options.risk,
                urltitle: options.urltitle
            });

            // 对诈骗类型进行判断
            if (options.risk == "闲鱼自动收货诈骗") {
                wx.showModal({
                    title: '警告',
                    content: '该二维码疑似最近比较火的闲鱼自动收货诈骗码，请勿扫描！',
                })
            }

            if (options.risk == "支付类（免密支付）诈骗") {
                wx.showModal({
                    title: '警告',
                    content: '该二维码涉及支付行为，且有较大风险，请勿扫描！',
                })
            }
        },
        // 页面被隐藏
        hide: function () {},
        // 页面尺寸变化
        resize: function () {},
    },

    methods: {
        // 误报上报
        errorScanPost() {
            // 获取路由参数
            let pages = getCurrentPages();
            let {
                options
            } = pages.pop();

            let isdfa = parseInt(options.isdfa);
            let mvss = parseInt(options.mvss);
            // 获取轮播图数据
            wx.cloud.callContainer({
                "config": {
                    "env": "prod-1g9947tcafae183c"
                },
                "path": "/errorscan",
                "header": {
                    "X-WX-SERVICE": "maan",
                    "content-type": "application/json"
                },
                "method": "POST",
                "data": {
                    "ip_addr": options.ipAddr,
                    "risk_type": options.risk,
                    "content_title": options.urltitle,
                    "is_dfa": isdfa,
                    "mvss": mvss,
                    "content": options.scanResult
                },
                success: (res) => {
                    if (res.data.code == 200) {
                        wx.showModal({
                            title: '成功',
                            content: '我们已经收到误报信息，感谢您的反馈~',
                        })
                    } else {
                        wx.showModal({
                            title: '失败',
                            content: '已经有人提交过了哦~',
                        })
                    }
                },
            })
        }
    },
});