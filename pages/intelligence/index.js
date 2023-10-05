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
        searchvalue: '',
        product: {
            value: 'all',
            options: [{
                    value: 'all',
                    label: '全部',
                },
                {
                    value: 'high',
                    label: '高危',
                },
                {
                    value: 'middle',
                    label: '中危',
                },
            ],
        },
        sorter: {
            value: 'time',
            options: [{
                    value: 'time',
                    label: '最近',
                },
                {
                    value: 'cvss',
                    label: 'cvss评分排序',
                },
            ],
        },
        intelligenceList: []
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
                "path": "/scan/intelligence",
                "header": {
                    "X-WX-SERVICE": "maan",
                    "content-type": "application/json"
                },
                "method": "GET",
                "data": "",
                success: (res) => {
                    console.log(res);
                    this.setData({
                        intelligenceList: res.data.data.intelligence_list,
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
        onChangeSearch({
            detail
        }) {
            console.log(`modelValue: ${detail.value}`);
        },
        onChange(e) {
            console.log(e.detail.value)
            this.setData({
                'product.value': e.detail.value,
            });
        },
    },
});