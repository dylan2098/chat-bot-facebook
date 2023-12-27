require('dotenv').config();
const CFGBTN = require('./btn.json');

module.exports = {
    btnBuyProduct: (sender_psid) => {
        return {
            "type": "web_url",
            "url": `${process.env.URL_WEB_VIEW_ORDER}?senderId=${sender_psid}`,
            "title": "Mua sản phẩm",
            "webview_height_ratio": "tall",
            "messenger_extensions": true
        };
    },
    btnBackToList: () => {
        return {
            "title": "Quay trở lại",
            "subtitle": "Quay trở lại danh sách sản phẩm",
            "image_url": "https://res.cloudinary.com/dvweth7yl/image/upload/v1656778684/product/z3533592465888_34e9848417e25ad68aea56a81c56d115.jpg",
            "buttons": [
                CFGBTN.COMMON.BACK_TO_LIST
            ],
        };
    }
}