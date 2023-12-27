require('dotenv').config();
const common = require('../script/common');
const CFGBTN = require('../configs/btn.json');
const CFGBTNJS = require('../configs/btnConfig');
const template = require('./templateService');
const Product = require('../models/ProductModel');

const IMAGES = [
    'https://res.cloudinary.com/dvweth7yl/image/upload/v1658238170/product/3.jpg',
    'https://res.cloudinary.com/dvweth7yl/image/upload/v1658238154/product/2.jpg',
    'https://res.cloudinary.com/dvweth7yl/image/upload/v1658238146/product/1.jpg',
    'https://res.cloudinary.com/dvweth7yl/image/upload/v1658238138/product/4.jpg'
]

let btnBuyProductDeliver = (sender_psid) => {
    return {
        "title": "Vận chuyển",
        "subtitle": "Sản phẩm được giao trong vòng từ 3-4 ngày tùy thuộc vào khu vực nhé.",
        "image_url": IMAGES[3],
        "buttons": [
            CFGBTNJS.btnBuyProduct(sender_psid),
        ],
    };
}

let getListProductTemplate = (sender_psid) => {
    let elements = [
        {
            "title": "Danh mục sản phẩm",
            "image_url": IMAGES[0],
            "buttons": [
                CFGBTN.PRODUCT_LIST.SET_LIST,
                CFGBTN.PRODUCT_LIST.DRESS_LIST
            ],
        },
        {
            "title": "Danh mục sản phẩm",
            "image_url": IMAGES[1],
            "buttons": [
                CFGBTN.PRODUCT_LIST.SKRIT_LIST,
                CFGBTN.PRODUCT_LIST.JUMP_LIST
            ],
        },
        btnBuyProductDeliver(sender_psid)
    ];

    return common.getTemplate(elements, "generic");
}


let getListTemplate = (products, sender_psid) => {
    let elements = [];

    elements = products.map(product => {
        return {
            "title": product.name,
            "subtitle": `Màu: ${product.color} - Size: ${product.size} - Giá: ${product.price}đ`,
            "image_url": product.image,
            "buttons": [
                {
                    "type": "web_url",
                    "title": "Chi Tiết",
                    "url": product.shopee,
                }
            ],
        }
    });

    elements.push(btnBuyProductDeliver(sender_psid));
    elements.push(CFGBTNJS.btnBackToList());

    return common.getTemplate(elements, "generic");
}


// let getProductDetailTemplate = () => {
//     let elements = [
//         {
//             "title": "Set Áo Trễ Vai Váy Dài Chữ A",
//             "subtitle": "296.000đ",
//             "image_url": IMAGES[0],
//             "buttons": [
//                 CFGBTN.PRODUCT.SHOW_IMAGE,
//             ],
//         },
//         CFGBTNJS.btnBackToList()
//     ];

//     return common.getTemplate(elements, "generic");
// }


let getButtonTemplate = (sender_psid) => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": "Size shop < 58kg nha bạn iu",
                "buttons": [
                    CFGBTN.STARTED.PRODUCT_LIST,
                    CFGBTNJS.btnBuyProduct(sender_psid),
                ]
            }
        }
    }

    return response;
}


let handleSendListProduct = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            resolve('done');
        } catch (error) {
            reject(error)
        }
    })
}


let handleGetStarted = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let username = await common.getUserName(sender_psid);

            // send text message
            let responseText = { 'text': `Xin chào ${username}. Mình là bot Mollie.` };
            await common.callSendAPI(sender_psid, responseText);

            let quickReplyTemplate = template.getStartedQuickReplyTemplate();
            await common.callSendAPI(sender_psid, quickReplyTemplate);


            resolve('done');
        } catch (error) {
            reject(error)
        }
    })
}

let handleSendBestSeller = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            const products = await Product.findAll({
                limit: 8,
                order: [
                    ['sold', 'DESC']
                ]
            });

            // send generic message
            let template = getListTemplate(products, sender_psid);
            await common.callSendAPI(sender_psid, template);
            resolve('done');
        } catch (error) {
            reject(error)
        }
    });
}

let handleSendProductNew = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            const products = await Product.findAll({
                limit: 8,
                order: [
                    ['createdAt', 'DESC']
                ]
            });

            // send generic message
            let template = getListTemplate(products, sender_psid);
            await common.callSendAPI(sender_psid, template);
            resolve('done');
        } catch (error) {
            reject(error)
        }
    });
}

// san pham noi bat
let handleSendFeaturedList = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            const products = await Product.findAll({
                limit: 8,
                order: [
                    ['outstanding', 'DESC']
                ]
            });

            // send generic message
            let template = getListTemplate(products, sender_psid);
            await common.callSendAPI(sender_psid, template);

            resolve('done');
        } catch (error) {
            reject(error)
        }
    });
}


// Handles messaging_postbacks events
async function handlePostback(sender_psid, received_postback) {
    let payload = received_postback.payload;

    let quickReplyTemplate = template.getQuickReplyTemplate('');

    switch (payload) {
        case 'RESTART_BOT':
        case 'GET_STARTED':
            await handleGetStarted(sender_psid);
            break;

        case 'PRODUCT_LIST':
            await handleSendListProduct(sender_psid);
            break;

        case 'SET_LIST':
            await handleSendSetList(sender_psid);
            await common.callSendAPI(sender_psid, quickReplyTemplate);
            break;

        case 'DRESS_LIST':
            await handleSendDressList(sender_psid);
            await common.callSendAPI(sender_psid, quickReplyTemplate);
            break;

        case 'SKIRT_LIST':
            await handleSendSkirtList(sender_psid);
            await common.callSendAPI(sender_psid, quickReplyTemplate);
            break;


        case 'JUMP_LIST':
            await handleSendJumpList(sender_psid);
            await common.callSendAPI(sender_psid, quickReplyTemplate);
            break;

        case 'PRODUCT_DETAIL':
            // await handleDetailProduct(sender_psid);
            break;

        case 'SHOW_IMAGE':
            await handleShowImage(sender_psid);
            break;

        case 'BACK_TO_LIST':
            let response = getListProductTemplate(sender_psid);
            await common.callSendAPI(sender_psid, response);

            await common.callSendAPI(sender_psid, quickReplyTemplate);
            break;

        default:
            break;
    }
}


// Handles messages events
async function handleMessage(sender_psid, received_message) {
    let response;

    // check message for with replies
    if (received_message.quick_reply && received_message.quick_reply.payload) {

        let tag = null;
        switch (received_message.quick_reply.payload) {
            case 'PRODUCTS':
                // send generic message
                let response = getListProductTemplate(sender_psid);
                await common.callSendAPI(sender_psid, response);


                tag = 'PRODUCTS';
                break;

            case 'FEARTURED_LIST':
                await handleSendFeaturedList(sender_psid);
                tag = 'FEARTURED_LIST';
                break;

            case 'BEST_SELLER':
                await handleSendBestSeller(sender_psid);
                tag = 'BEST_SELLER';
                break;

            case 'PRODUCT_NEW':
                await handleSendProductNew(sender_psid);
                tag = 'PRODUCT_NEW';
                break;

            case 'PAYMENT_METHOD':
                await handleSendPaymentMethod(sender_psid);
                tag = 'PAYMENT_METHOD';
                break;

            case 'POLICY':
                await handleSendPolicy(sender_psid);
                tag = 'POLICY';
                break;

            case 'INFOMATION':
                await handleSendInformation(sender_psid);
                tag = 'INFOMATION';
                break;

            default:
                break;
        }

        let quickReplyTemplate = template.getQuickReplyTemplate(tag);
        await common.callSendAPI(sender_psid, quickReplyTemplate);

        return;
    }

    // Check if the message contains text
    // if (received_message.text) {

    //     let username = await common.getUserName(sender_psid);
    //     // Create the payload for a basic text message
    //     response = {
    //         "text": `Chào mừng ${username} đến với Mollie Shop. ${username} đợi một chút sẽ có cô bé dễ thương trả lời cho nhé. <3`
    //     }
    // }

    // Sends the response message
    
    common.callSendAPI(sender_psid, response);
}

let handleSendSetList = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {

            const products = await Product.findAll({
                limit: 8,
                where: {
                    category_id: 1
                }
            });

            // send generic message
            let template = getListTemplate(products, sender_psid);
            await common.callSendAPI(sender_psid, template);


            resolve('done');
        } catch (error) {
            reject(error)
        }
    })
}

let handleSendDressList = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {

            const products = await Product.findAll({
                limit: 8,
                where: {
                    category_id: 2
                }
            });

            // send generic message
            let template = getListTemplate(products, sender_psid);
            await common.callSendAPI(sender_psid, template);


            resolve('done');
        } catch (error) {
            reject(error)
        }
    })
}

let handleSendSkirtList = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {

            const products = await Product.findAll({
                limit: 8,
                where: {
                    category_id: 3
                }
            });

            // send generic message
            let template = getListTemplate(products, sender_psid);
            await common.callSendAPI(sender_psid, template);


            resolve('done');
        } catch (error) {
            reject(error)
        }
    })
}


let handleSendJumpList = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {

            const products = await Product.findAll({
                limit: 8,
                where: {
                    category_id: 4
                }
            });

            // send generic message
            let template = getListTemplate(products, sender_psid);
            await common.callSendAPI(sender_psid, template);


            resolve('done');
        } catch (error) {
            reject(error)
        }
    })
}

let handleBackToList = async (sender_psid) => {
    await handleSendListProduct(sender_psid);
}


// let handleDetailProduct = (sender_psid) => {
//     return new Promise(async (resolve, reject) => {
//         try {

//             // send generic message
//             let template = getProductDetailTemplate();
//             await common.callSendAPI(sender_psid, template);


//             resolve('done');
//         } catch (error) {
//             reject(error)
//         }
//     })
// }

let handleShowImage = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {

            let templateImage = template.getImageTemplate(IMAGES[0]);
            let templateBtn = getButtonTemplate(sender_psid);

            await common.callSendAPI(sender_psid, templateImage);
            await common.callSendAPI(sender_psid, templateBtn);


            resolve('done');
        } catch (error) {
            reject(error)
        }
    })
}


let handleSendPolicy = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {

            // chinh sach mua hang
            await common.callSendAPI(sender_psid, template.templateBuyProductPolicy());

            // chinh sach doi tra
            await common.callSendAPI(sender_psid, template.templateReturnPolicy());

            resolve('done');
        } catch (error) {
            reject(error)
        }
    })
}

let handleSendPaymentMethod = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {

            await common.callSendAPI(sender_psid, template.templatePaymentMethod());

            resolve('done');
        } catch (error) {
            reject(error)
        }
    })
}

let handleSendInformation = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {

            // send information shop
            await common.callSendAPI(sender_psid, template.templateInfoShop());

            // send information product
            await common.callSendAPI(sender_psid, template.templateInfoProduct());

            resolve('done');
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    handleGetStarted: handleGetStarted,
    handlePostback: handlePostback,
    handleMessage: handleMessage,
    handleSendSetList: handleSendSetList,
    handleSendDressList: handleSendDressList,
    handleSendSkirtList: handleSendSkirtList,
    handleSendJumpList: handleSendJumpList
}