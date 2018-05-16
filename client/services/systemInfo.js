const get = function () {
    try {
        return wx.getSystemInfoSync()

    } catch (e) {

        return null;
    }
}

module.exports = { get }