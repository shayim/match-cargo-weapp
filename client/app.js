var qcloud = require('./vendor/wafer2-client-sdk/index');
var config = require('./config');
var {systemInfo} = require('./pages/helpers/index');

App({
   
    onLaunch() {
        qcloud.setLoginUrl(config.service.loginUrl);
        this.systemInfo = systemInfo.get();
    },

    userInfo: null,
    systemInfo: null
});