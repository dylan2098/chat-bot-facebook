// let handleGuideToUseBot = (sender_psid) => {
//     return new Promise(async (resolve, reject) => {
//         try {

//             let username = await common.getUserName(sender_psid);
//             let responseText = {
//                 text: `Xin chào bạn ${username}, mình là chat bot Mollie. \n Để biết cách sử dụng, bạn vui lòng xem hết video bên dưới nhé 😉`
//             };

//             let responseMediaTemplate = getBotMediaTemplate();

//             await common.callSendAPI(sender_psid, responseText);
//             await common.callSendAPI(sender_psid, responseMediaTemplate);

//             resolve('done');
//         } catch (error) {
//             reject(error)
//         }
//     })
// }

// let getBotMediaTemplate = () => {
//     let elements = [
//         {
//             "media_type": "<image|video>",
//             // "attachment_id": "765420714370507",
//             // Need upload video to https://business.facebook.com/creatorstudio/content_posts after that copy link video
//             "url": "https://business.facebook.com/hoidanITEricRestaurant/videos/765420714370507",
//             "buttons": [
//                 {
//                     "type": "postback",
//                     "title": "Danh sách sản phẩm nổi bật",
//                     "payload": "PRODUCT_LIST",
//                 },
//                 {
//                     "type": "weburl",
//                     "url": `https://shopee.vn/mollieshop2501`,
//                     "title": "Shopee",
//                     "webview_height_ratio": "full",
//                 },
//             ]
//         }
//     ];

//     return common.getTemplate(elements, 'media');
// }
