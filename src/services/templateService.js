const CFGBTN = require('../configs/btn.json');

const templateInfoShop = () => {
    return {
        text: ` -- SHOP --
        \n - Giờ mở cửa: Từ 8:00 - 20:00. Tất cả các ngày trong tuần
        \n - Hotline: 0869.881.504
        \n - Địa chỉ: Phạm Thế Hiển, P4. Q8. TP.HCM
        \n - Shopee: https://shopee.vn/mollieshop2501
        `
    };
}

const templateInfoProduct = () => {
    return {
        text: ` -- SẢN PHẨM --
        \n - Chuyên sỉ, lẻ các mặt hàng thiết kế, hàng Quảng Châu, hàng VNXK
        \n - Cam kết chất lượng đúng như mô tả
        \n - Size chung < 55kg
        `
    };
}

const templatePaymentMethod = () => {
    return {
        text: ` -- PHƯƠNG THỨC THANH TOÁN --
        \n Chuyển khoản ngân hàng:
        \n    *Ngân hàng: Sacombank
        \n    *STK: 060266421225
        \n    *Tên: NGUYEN THI NHAT TRINH
        \n
        \n    *Ngân hàng: Techcombank
        \n    *STK: 19036205125014
        \n    *Tên: NGUYEN MINH TRI
        \n -Nội dung chuyển khoản-
        \n Họ tên - Số điện thoại
        \n (Vui lòng chụp màn hình lại và gửi shop để xác nhận thanh toán nhé.)
        \n
        \n COD: Ship toàn quốc
        \n   *Miễn ship nội thành (TP.HCM)
        \n   *Ngoại thành phí ship là 30.000đ
        `
    }
}

const templateBuyProductPolicy = () => {
    return {
        text: ` -- CHÍNH SÁCH MUA HÀNG --
        \n - Miễn ship từ 2 sản phẩm trở lên
        \n - Giảm 5-10% khi mua từ 3 sản phẩm trở lên
        \n - Giảm 15-20% khi mua từ 5 sản phẩm trở lên và trở thành khách hàng thân thiết của Mollie 
        `
    };
}

const templateReturnPolicy = () => {
    return {
        text: ` -- CHÍNH SÁCH ĐỔI TRẢ --
        \n - Hoàn tiền 100% nếu không vừa size hoặc shop giao không đúng mẫu (shop trả phí)
        \n - Đổi trả sản phẩm khi sản phẩm khi bị lỗi (shop trả phí)
        \n - Điểu kiện: Sản phẩm còn mới, còn nguyên túi zip/hộp tem mác (nếu có)
        \n (Chỉ xử lý 2 trường hợp trên khi có quay video khui hàng để tránh trường hợp không phải lỗi của shop - trả hàng từ 2-3 ngày sau khi nhận hàng)
        `
    }
};

const getStartedQuickReplyTemplate = () => {
    let response = {
        "text": "Để xem nhiều sản phẩm hơn tại Shopee, khách yêu nhấn vào dấu 3 gạch ở góc phải màn hình nhé.",
        "quick_replies": [
            CFGBTN.QUICK_REPLY.PRODUCTS,
            CFGBTN.QUICK_REPLY.FEARTURED_LIST,
            CFGBTN.QUICK_REPLY.BEST_SELLER,
            CFGBTN.QUICK_REPLY.PRODUCT_NEW,
            CFGBTN.QUICK_REPLY.INFOMATION,
            CFGBTN.QUICK_REPLY.PAYMENT_METHOD,
            CFGBTN.QUICK_REPLY.POLICY,
        ]
    };

    return response;
}

const getQuickReplyTemplate = (exlTag) => {

    let tags = [
        CFGBTN.QUICK_REPLY.PRODUCTS,
        CFGBTN.QUICK_REPLY.FEARTURED_LIST,
        CFGBTN.QUICK_REPLY.BEST_SELLER,
        CFGBTN.QUICK_REPLY.PRODUCT_NEW,
        CFGBTN.QUICK_REPLY.INFOMATION,
        CFGBTN.QUICK_REPLY.PAYMENT_METHOD,
        CFGBTN.QUICK_REPLY.POLICY,
    ];

    tags = tags.filter((tag) => {
        return tag.payload !== exlTag;
    })

    let response = {
        "text": "Chọn đề mục để biết thêm thông tin nhé",
        "quick_replies": tags
    };

    return response;
}

let getImageTemplate = (image) => {
    let response = {
        "attachment": {
            "type": "image",
            "payload": {
                "url": image,
                "is_reusable": true
            }
        }
    };

    return response;
}



module.exports = {
    templateInfoShop: templateInfoShop,
    templateInfoProduct: templateInfoProduct,
    templatePaymentMethod: templatePaymentMethod,
    templateBuyProductPolicy: templateBuyProductPolicy,
    templateReturnPolicy: templateReturnPolicy,
    getStartedQuickReplyTemplate: getStartedQuickReplyTemplate,
    getQuickReplyTemplate: getQuickReplyTemplate,
    getImageTemplate: getImageTemplate
}