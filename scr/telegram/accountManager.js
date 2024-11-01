const utils = require("../utils/utils");
const telegram = require("./telegram");

const log = require("../utils/logger");

class Account {
    constructor(username, session, api_id, api_hash, proxy) {
        this.address = username;
        this.api_id = api_id;
        this.api_hash = api_hash;
        this.session = session;
        this.proxy = proxy;

        let ua = utils.getMobileUA();

        this.cookie = {};
        this.options = {
            headers: { 
                // 'user-agent': ua,
                // 'User-Agent': null,
                "accept": "application/json, text/plain, */*",
                "accept-encoding": "gzip, deflate, br, zstd",
                "accept-language": utils.get_Local(),
                "content-type": "application/json",
                "cache-control": "no-cache",
                "pragma": "no-cache",
                // "priority": "u=1, i",
                // "sec-ch-ua": ua.componentUserAgent,
                // "sec-ch-ua-mobile": "?0",
                // "sec-ch-ua-platform": "\"Windows\"",
                // "sec-fetch-dest": "empty",
                // "sec-fetch-mode": "cors",
                // "sec-fetch-site": "same-site",
                "Referer": "https://app.tg.vooi.io/",
                "Referrer-Policy": "strict-origin-when-cross-origin",
                "origin": "https://app.tg.vooi.io",
                "cookie": this.cookie,
            },
            mode: "cors",
            credentials: "include",
            cache: "no-cache",
            redirect: "follow",
            referrer: "https://app.tg.vooi.io/",
            referrerPolicy: "strict-origin-when-cross-origin",
        };

        // if (index) this.index = index;
    };

    async connect(){
        this.client = await telegram.get_Client(this.session, this.api_id, this.api_hash, this.proxy);
    };

    async dispatcher(){
        if (this.proxy)
            return socksDispatcher({
                type: 5,
                host: this.proxy.ip,
                port: +this.proxy.port,
                userId: this.proxy.username,
                password: this.proxy.password,
            });
    };

    async disconnect () {
        await this.client.disconnect();
        await this.client.destroy();
    };

};

let add_NewAccount = function (accountData){
    let accountsData = utils.get_AccountsData();
    let listAccounts = Object.keys(accountsData);
    if (accountData.username in listAccounts == false)
        accountsData[accountData.username] = {
            api_id: accountData.api_id,
            api_hash: accountData.api_hash,
            session: accountData.session,
            proxy: accountData.proxy
        }
        utils.write_AccountsData(accountsData);
        log.info(`${accountData.username} added`);
};

let start_Accounts = async function (){
    let accountsData = utils.get_AccountsData();
    let listAccounts = Object.keys(accountsData);
    let result = {};
    for (let account of listAccounts){
        let accountData = accountsData[account];
        result[account] = new Account(account, accountData.session, accountData.api_id, accountData.api_hash, accountData.proxy);
    };
    return result;
};

module.exports.add_NewAccount = add_NewAccount;
module.exports.start_Accounts = start_Accounts;