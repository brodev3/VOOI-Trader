const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { Api } = require("telegram/tl");
const log = require("../utils/logger");


let get_Client = async (stringSession, apiId, apiHash, proxy) => {
    stringSession = new StringSession(stringSession);
    let options = {};
    if (proxy != false)
        options = {
            connectionRetries: 5,
            useWSS: false,
            proxy: proxy,
            autoReconnect: true
        };
    else
        options = {
            connectionRetries: 5,
            autoReconnect: true
        };
    const client = new TelegramClient(stringSession, Number(apiId), apiHash, options);
    let validSession = await client.connect();
    if (validSession)
        return client;
};

let get_TgWebData = async (Account) => {
    let authUrl;
    try {
        await Account.connect();
        const webview = await Account.client.invoke(new Api.messages.RequestWebView({
            peer: 'VooiAppBot',
            bot: 'VooiAppBot',
            platform: 'android',
            fromBotMenu: false,
            url: 'https://api-tg.vooi.io/'
        }));
        authUrl = webview.url;
    } catch (error) {
        await log.errorDB(Account, "get_TgWebData", error.messages, error.stack);
        return null;
    };
    return decodeURIComponent(authUrl.split('tgWebAppData=')[1].split('&tgWebAppVersion')[0]);
};

module.exports.get_Client = get_Client;
module.exports.get_TgWebData = get_TgWebData;

