var qcloud = require('../../vendor/wafer2-client-sdk/index');
var config = require('../../config');
var {
    toast,
    modal
} = require('../helpers/index')

Page({
    data: {
        userInfo: null,
        loginUrl: config.service.loginUrl,
        requestUrl: config.service.requestUrl,
        tunnelUrl: config.service.tunnelUrl,
        uploadUrl: config.service.uploadUrl,
        tunnelStatus: 'closed',
        tunnelStatusText: {
            closed: '已关闭',
            connecting: '正在连接...',
            connected: '已连接'
        },
        imgUrl: ''
    },

    /**
     * 点击「登录」按钮，测试登录功能
     * param e { type:"getuserinfo", 
     *           detail: { encryptoData, iv, signature, 
     *                     userInfo: { nickName, gender, language, city, province, country, avatarUrl }}
     */
   
    /**
     * 点击「清除会话」按钮
     */
    clearSession() {
        // 清除保存在 storage 的会话信息
        this.setData({userInfo: null});
        qcloud.clearSession();
        toast.showSuccess('会话已清除');
    },

    /**
     * 点击「请求」按钮，测试带会话请求的功能
     */
  

    doUpload() {
        var that = this

        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                var filePath = res.tempFilePaths[0]

                wx.uploadFile({
                    url: that.data.uploadUrl,
                    filePath: filePath,
                    name: 'file',

                    success: function (res) {
                        toast.showSuccess('上传图片成功')
                        res = JSON.parse(res.data)
                        console.log(res)
                        that.setData({
                            imgUrl: res.data.imgUrl
                        })
                    },

                    fail: function (e) {
                        console.error(e)
                    }
                })

            },
            fail: function (e) {
                console.error(e)
            }
        })
    },

    previewImage() {
        wx.previewImage({
            current: this.data.imgUrl,
            urls: [this.data.imgUrl]
        })
    },

    switchTunnel(e) {
        const turnedOn = e.detail.value;

        if (turnedOn && this.data.tunnelStatus == 'closed') {
            this.openTunnel();

        } else if (!turnedOn && this.data.tunnelStatus == 'connected') {
            this.closeTunnel();
        }
    },

    /**
     * 点击「打开信道」，测试 WebSocket 信道服务
     */
    openTunnel() {
        // 创建信道，需要给定后台服务地址
        var tunnel = this.tunnel = new qcloud.Tunnel(this.data.tunnelUrl);

        // 监听信道内置消息，包括 connect/close/reconnecting/reconnect/error
        tunnel.on('connect', () => {
            console.log('WebSocket 信道已连接');
            this.setData({
                tunnelStatus: 'connected'
            });
        });

        tunnel.on('close', () => {
            console.log('WebSocket 信道已断开');
            this.setData({
                tunnelStatus: 'closed'
            });
        });

        tunnel.on('reconnecting', () => {
            console.log('WebSocket 信道正在重连...')
            toast.showBusy('正在重连');
        });

        tunnel.on('reconnect', () => {
            console.log('WebSocket 信道重连成功')
            toast.showSuccess('重连成功');
        });

        tunnel.on('error', error => {
            modal.showModal('信道发生错误', error);
            console.error('信道发生错误：', error);
        });

        // 监听自定义消息（服务器进行推送）
        tunnel.on('speak', speak => {
            modal.showModal('信道消息', speak);
            console.log('收到说话消息：', speak);
        });

        // 打开信道
        tunnel.open();

        this.setData({
            tunnelStatus: 'connecting'
        });
    },

    /**
     * 点击「发送消息」按钮，测试使用信道发送消息
     */
    sendMessage() {
        // 使用 tunnel.isActive() 来检测当前信道是否处于可用状态
        if (this.tunnel && this.tunnel.isActive()) {
            // 使用信道给服务器推送「speak」消息
            this.tunnel.emit('speak', {
                'word': 'I say something at ' + new Date(),
            });
        }
    },

    /**
     * 点击「测试重连」按钮，测试重连
     * 也可以断开网络一段时间之后再连接，测试重连能力
     */
    testReconnect() {
        // 不通过 SDK 关闭连接，而是直接用微信断开来模拟连接断开的情况下，考察 SDK 自动重连的能力
        wx.closeSocket();
    },

    /**
     * 点击「关闭信道」按钮，关闭已经打开的信道
     */
    closeTunnel() {
        if (this.tunnel) {
            this.tunnel.close();
        }

        this.setData({
            tunnelStatus: 'closed'
        });
    },

    /**
     * 点击「聊天室」按钮，跳转到聊天室综合 Demo 的页面
     */
    openChat() {
        // 微信只允许一个信道再运行，聊天室使用信道前，我们先把当前的关闭
        this.closeTunnel();
        wx.navigateTo({
            url: '../chat/chat'
        });
    },
});