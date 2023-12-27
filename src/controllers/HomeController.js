require('dotenv').config();
import request from "request";
import chatbotService from "../services/chatbotService";
const { GoogleSpreadsheet } = require('google-spreadsheet');

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

const PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nMIIEugIBADANBgkqhkiG9w0BAQEFAASCBKQwggSgAgEAAoIBAQCgKmVSK9j/eECh\nPhDGBqX3s1Vg0edVlCYT4VLwO2ErGw7xV+3mxxUoa6q622jRuWEjTBAYIhK4Cm2s\nLZz+eNxRu3rplGf6TT2O8R8+ey1PNjBnuIXG4OrZbHVm8PmwI7h0xcjJy6vX2l22\nqvxqN/Kf82qV/9OxjQw7dfYezClPGcP648R5aAuRH9Y/RVyezAQYjysaVCrZVkQn\nvRBJgMV6ka4D/3xwOKHqLNznSngFGq+kGJ1LXyfBlfOGSfRtNuojCkYISPFqKdwA\nbKOOO1AhXvtF8rWUKSTJpFz+V60SyZG9/mYgTPnj4gOi0zCGjzF1ZmDaOpa8I3y8\ngGEZ/KFZAgMBAAECgf9B69vZD92vanFRhdw/YNJ3KXI2Tcgk3+6qDNfaXeuX2tf+\n0uUxlxRrDpAdFCBMD4DA7MlMnP3TF0SECEIVrf5VpYe1m85jLomFh4V/OnfJgFmO\nEuR0MnPuTYrzqPbXkO1BAI1F+Ljba6c3so7tSxm8IicJQI8tr3EdsrxNVyDcqMmz\n3+jdAVHgwyaoDB8tBuGpIBoK/fQNK5365k1eaUPSPStl3gbFevS9qwc5nXvTWBbv\nvyvEck174N4n2mU9pcyFnGN7NJqqoyitumD9WliacgaaIW95KkUFqcorRg7+GRqO\nt1icfjn9WPIiKUwRdlX2mONMG/G0OxGL+e/kDN8CgYEA4bMb9jqAJBPQn0UIb1M7\nP8jA6gwnH6AckNPcZvijfTya3SQM5rOpyNSCdLbhzALfQtddTmOl5oNd7SSOGhPs\nflq2p4d3olao53s3bxjaKtacjdLix/A79gMQ6d7U0Ct+e5tFpKFwux9pUaouoHCY\nWDo8bfTnuXxFsKcf2HgwufsCgYEAtar/5l5fuZxe79NJiGjtMhRYL3olmiQcdaeo\nlJQ2h2oC/ISqsLE0E2y/yBgrV+0bpCk2Jbq7wduKqwbQyQhHpuVgjTDl1YBpU3q2\nE9vU84KpQDlspfUS+vmZVT3O7HQ8MZ4EOhlzRmwYzSX6am+ic0mUkMC5iTvgx4WY\n2+KypbsCgYAy4EH8ViGOgFz1mgUVuyhO73z1BTpIeboWt3smRwPrdh7enIK/+l3a\nZHTnxFXPvBIBqjRhODssZA5nJ2dU34rezKoBx5qjIG/AhljvlSWQpIHzwkbWlQOf\nJ//HCDDmn/dJ+61OOAoGVEVUYE1UYy0kLjRzANK/UBERigq2rBknwwKBgDJZtpsu\nxPE4ucdWlCbOjg83PEnMXOef4pNpaHvlqEdXxoQecQCP3JMVrQHUUQ8JlIOnOG60\nlp1gL8q/FNbjCJjlMiFv0AOgl5Cfjh9q6lajfC1kvQwyJJSS4UCS5Or8PEK0PQ+t\nRhnak/Un9YPSdP/nANot0D6M7fvet0MaTdFJAoGAWey9UoBGxHEL971dQtOxjMQf\nV3WU5pGoim3YbjTny7OYMYHCxKOOUtBcTb4wkJNzCybGTUV/PcNhsR5OmjmaI14f\n+ulrAqOySOPbVhKyqGcGaBgeSfuIrumK9fwHkTlvFB9YdyKaCDNDSZoNBtD7jb4W\nWxOjGSOpa37PX6Z7FuQ=\n-----END PRIVATE KEY-----\n";
const CLIENT_EMAIL = process.env.CLIENT_EMAIL;
const SHEET_ID = process.env.SHEET_ID;

const common = require('../script/common');
const Product = require('../models/ProductModel');
const moment = require('moment');


let getHomePage = (req, res) => {
    return res.render('homepage.ejs');
};

let postWebhook = (req, res) => {
    let body = req.body;

    // Checks this is an event from a page subscription
    if (body.object === 'page') {

        // Iterates over each entry - there may be multiple if batched
        body.entry.forEach(async function (entry) {

            // Gets the body of the webhook event
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);


            // Get the sender PSID
            let sender_psid = webhook_event.sender.id;
            console.log('Sender PSID: ' + sender_psid);

            // Check if the event is a message or postback and
            // pass the event to the appropriate handler function
            if (webhook_event.message) {
                chatbotService.handleMessage(sender_psid, webhook_event.message);
            } else if (webhook_event.postback) {
                chatbotService.handlePostback(sender_psid, webhook_event.postback);
            }
        });

        // Returns a '200 OK' response to all requests
        res.status(200).send('EVENT_RECEIVED');
    } else {
        // Returns a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
}

let getWebhook = (req, res) => {
    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = process.env.VERIFY_TOKEN;

    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {

        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {

            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);

        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
}


let setupProfile = async (req, res) => {
    // call profile facebook api

    // Construct the message body
    let request_body = {
        "get_started": {
            "payload": "GET_STARTED"
        },
        "whitelisted_domains": ["https://bot-mollie.herokuapp.com/"]
    }

    // Send the HTTP request to the Messenger Platform
    await request({
        "uri": `https://graph.facebook.com/v14.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`,
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        console.log(body);
    });

    return res.send("Set up user profile success");
}



let setupPersistentMenu = async (req, res) => {
    // call profile facebook api

    // Construct the message body
    let request_body = {
        "persistent_menu": [
            {
                "locale": "default",
                "composer_input_disabled": false,
                "call_to_actions": [
                    {
                        "type": "web_url",
                        "title": "Shopee Mollie",
                        "url": "https://shopee.vn/mollie_shop2502",
                        "webview_height_ratio": "full"
                    },
                    {
                        "type": "web_url",
                        "title": "Fanpage Mollie",
                        "url": "https://www.facebook.com/mollietrend/",
                        "webview_height_ratio": "full"
                    },
                    {
                        "type": "postback",
                        "title": "Khởi động lại bot",
                        "payload": "RESTART_BOT"
                    }
                ]
            }
        ]
    };

    // Send the HTTP request to the Messenger Platform
    await request({
        "uri": `https://graph.facebook.com/v14.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`,
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        console.log(body);

        if (!err) {
            console.log('Setup perssistent menu success');
        } else {
            console.erorr("Unable to setup user profile: " + err);
        }
    });

    return res.send("Set up persistent menu success");
}


let handleOrder = async (req, res) => {
    let senderId = req.query.senderId;

    let products = await Product.findAll({
        order: [
            ['createdAt', 'DESC']
        ]
    });

    return res.status(200).render('order.ejs', {
        senderId: senderId,
        products: products
    });
}



let handlePostOrder = async (req, res) => {
    try {
        let customerName = "";
        if (req.body.customerName === '') {
            customerName = await common.getUserName(req.body.psid);
        } else {
            customerName = req.body.customerName;
        }

        const address = req.body.address;
        const phoneNumber = req.body.phoneNumber;
        const product = req.body.product;
        const color = req.body.color;
        const size = req.body.size;
        const amount = req.body.amount;

        let response = {
            "text": `- ĐẶT HÀNG -
        \n Họ và tên: ${customerName}
        \n Địa chỉ: ${address}
        \n Số điện thoại: ${phoneNumber}
        \n Sản phẩm: ${product}
        \n Màu sắc: ${color}
        \n Kích thước: ${size}
        \n Số lượng: ${amount}
        \n Xin cảm ơn quý khác đã đặt sản phẩm
        `};

        // ghi file excel
        await writeDataToGoogleSheet(customerName, address, phoneNumber, product, color, size, amount);

        await common.callSendAPI(req.body.psid, response);

        return res.status(200).json({
            message: 'ok',
            data: response
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Server error'
        })
    }
}



let writeDataToGoogleSheet = async (name, address, phone, product, color, size, amount) => {
    try {
        // Initialize the sheet - doc ID is the long id in the sheets URL
        const doc = new GoogleSpreadsheet(SHEET_ID);

        // Initialize Auth - see more available options at https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication
        await doc.useServiceAccountAuth({
            client_email: CLIENT_EMAIL,
            private_key: PRIVATE_KEY,
        });

        await doc.loadInfo(); // loads document properties and worksheets

        const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]

        let objWrite = {
            "Tên": name,
            "Địa chỉ": address,
            "Số điện thoại": `'${phone}`,
            "Sản phẩm": `'${product}`,
            "Màu sắc": `'${color}`,
            "Kích thước": `'${size}`,
            "Số lượng": `'${amount}`,
            "Thời gian": moment().tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY h:mm:ss a')
        }

        // append rows
        await sheet.addRow(objWrite);
    }
    catch (e) {
        console.log(e)
    }
}


// test
const getListProduct = async (req, res, next) => {
    try {
        const products = await Product.findAll({
            where: {
                category_id: 1
            }
        });

        return res.status(200).send(products);
    } catch (error) {
        console.log(error.message);
    }
}


const getJSONProduct = async (req, res, next) => {
    const products = await Product.findAll();

    return res.status(200).send(products);
}


module.exports = {
    getHomePage: getHomePage,
    postWebhook: postWebhook,
    getWebhook: getWebhook,
    setupProfile: setupProfile,
    setupPersistentMenu: setupPersistentMenu,
    handleOrder: handleOrder,
    handlePostOrder: handlePostOrder,
    getListProduct: getListProduct,
    getJSONProduct: getJSONProduct
}