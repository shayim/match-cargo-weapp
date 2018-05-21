const axios = require('axios')

const get = async (ctx, next) => {
    if (ctx.state.$wxInfo.loginState) {
        ctx.state.data = ctx.state.$wxInfo.userinfo
    }
}

module.exports = {
    get
}
