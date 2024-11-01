const manager = require("./scr/telegram/accountManager");
const Vooi = require("./scr/vooi");
const db = require('./scr/db/db');
const log = require('./scr/utils/logger');
const utils = require("./scr/utils/utils");
const config = require("./input/config");
const { Api } = require("telegram/tl");

const app = new Vooi();

function randomDelay(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

let claim = async (Account) => {
    try {
        await app.login(Account);
        const status = await app.autotrade(Account);
        if (status === null) throw new Error("Autotrade returned null");
        if (status.timeLeftInSeconds == 0) {
            if (status.status == "finished") {
                const result = await app.claimAutotrade(Account, status.autoTradeId);
                if (result === null) throw new Error("ClaimAutotrade returned null");
                log.successDB(Account, 'claimAutotrade', `Claimed ${result.reward.virtPoints} VT!`);
            };
            const result = await app.startAutotrade(Account);
            if (result === null) throw new Error("StartAutotrade returned null") 
            else if (result.status == "in_progress") log.infoDB(Account, 'startAutotrade', `Autotrade started!`);
            let min = (result.timeLeftInSeconds + 5) * 1_000;
            let max = (result.timeLeftInSeconds + 1_800) * 1_000;
    
            setTimeout(claim, randomDelay(min, max), Account);
        } else {
            let min = (status.timeLeftInSeconds + 5) * 1_000;
            let max = (status.timeLeftInSeconds + 1_800) * 1_000;
    
            setTimeout(claim, randomDelay(min, max), Account);
        }
        const balance = await app.balance(Account);
        if (balance === null) throw new Error("Balance returned null");
        log.infoDB(Account, 'balance', `VT balance: ${balance.virt_points} USD: ${balance.virt_money}`);
        db.updateMetric(Account, "points", +balance.virt_points);
        db.updateMetric(Account, "usd", +balance.virt_money);
    } catch (error) {
        await log.errorDB(Account, "claim", error.message, error.stack);
        let min = 29_000 * 1_000;
        let max = (29_000 + 1_800) * 1_000;
        setTimeout(claim, randomDelay(min, max), Account);
        return null;
    } finally {
        await Account.disconnect();
    };
};

let completeTasks = async (Account) => {
    try {
        await app.login(Account);

        const frensPoints = await app.frensPoints(Account);
        if (frensPoints === null) throw new Error("FrensPoints returned null");
        const date = new Date(frensPoints.nextDateToClaim);
        const now = new Date();
        if (+frensPoints.totalProfit > 0 && date <= now) {
            const claimFrens = await app.claimFriends(Account);
            if (claimFrens === null) throw new Error("Autotrade returned null");
            log.infoDB(Account, 'claimFriends', `Friends reward claimed! ${app} VT`);
        };

        const tasks = await app.tasks(Account);
        if (tasks === null) throw new Error("Tasks returned null");

        let min = 3_000;
        let max = 6_000;

        for (let i = 0; i < tasks.nodes.length; i++){
            let task = tasks.nodes[i];
            let status = task.status;
            if (status == "new"){
                const taskResult = await app.taskStart(Account, tasks.nodes[i].id);
                if (taskResult === null) {
                    log.errorDB(Account, 'taskStart', `Task: ${tasks.nodes[i].description} returned null`);
                    continue;
                };
                log.infoDB(Account, 'taskStart', `Task: ${tasks.nodes[i].description} started`);
                setTimeout(completeTasks, randomDelay(min, max), Account);
                return;
            };

            if (status == "done") {
                const taskResult = await app.taskClaim(Account, tasks.nodes[i].id);
                if (taskResult === null) {
                    log.errorDB(Account, 'taskClaim', `Task: ${tasks.nodes[i].description} returned null`);
                    continue;
                };
                log.successDB(Account, 'taskClaim', `Task: ${tasks.nodes[i].description} completed. Claimed ${taskResult.claimed.virt_points} VT!`);
                setTimeout(completeTasks, randomDelay(min, max), Account);
                return;
            };
        };
        const delay = utils.timeToNextDay();
        setTimeout(completeTasks, delay, Account);

        const balance = await app.balance(Account);
        if (balance === null) throw new Error("Balance returned null");
        log.infoDB(Account, 'balance', `VT balance: ${balance.virt_points} USD: ${balance.virt_money}`);
        db.updateMetric(Account, "points", +balance.virt_points);
        db.updateMetric(Account, "usd", +balance.virt_money);
        log.infoDB(Account, 'tasks', `Tasks complete`);
        return;
    } catch (error) {
        await log.errorDB(Account, "completeTasks", error.message, error.stack);
        const delay = utils.timeToNextDay();
        setTimeout(completeTasks, delay, Account);
        return null;
    } finally {
        await Account.disconnect();
    };
};

let trade = async (Account) => {
    const startTime = Date.now();
    try {
        await app.login(Account);

        const balance = await app.balance(Account);
        if (balance === null) throw new Error("Balance returned null");
        if (+balance.virt_money < 100) return;

        const tasks = await app.tasks(Account);
        if (tasks === null) throw new Error("Tasks returned null");

        let tradeVolume = tasks.nodes.filter(task => task.id == 18);
        tradeVolume = tradeVolume[0].progress;
        db.updateMetric(Account, "volume", +tradeVolume.current_stage);
        log.infoDB(Account, "volume", `Current volume: ${tradeVolume.current_stage}`);
        if (tradeVolume.percentage == 100) return;
        

        const positions = await app.position(Account);
        if (positions === null) throw new Error("Position returned null");
        for (let position of positions.nodes){
            const result = await app.closePosition(Account, position.id);
            if (result === null) throw new Error("ClosePosition returned null");
            log.infoDB(Account, "closePosition", `Position ${result.type} closed`);
            await sleep(randomDelay(2_500, 5_000))
        };

        const values = [1, 2, 3];
        const pairID = values[Math.floor(Math.random() * values.length)];

        const sides = ['long', 'short'];
        const side = sides[Math.floor(Math.random() * sides.length)];

        let result = await app[side](Account, pairID);
        if (result === null) throw new Error(side + " returned null");
        log.infoDB(Account, side, `Position ${result.type} open`);

        let min = 300 * 1_000;
        let max = (300 + 3_600) * 1_000;
        await sleep(randomDelay(min, max))

        const closeResult = await app.closePosition(Account, result.id);
        if (closeResult === null) throw new Error("ClosePosition after delay returned null");
        log.infoDB(Account, "closePosition", `Position ${closeResult.type} closed after delay`);

        const elapsedTime = Date.now() - startTime;
        const remainingTime = 2 * 60 * 60 * 1_000 - elapsedTime;
        if (remainingTime > 0) await sleep(randomDelay(5 * 60 * 1_000, remainingTime)); 

        return trade(Account);
    } catch (error) {
        await log.errorDB(Account, "claim", error.message, error.stack);
        let min = 300 * 1_000;
        let max = 2 * 60 * 60 * 1_000;
        setTimeout(trade, randomDelay(min, max), Account);
        return null;
    } finally {
        await Account.disconnect();
    };
};

let subChannel = async (Account) => {
    try {
        await app.login(Account);
        await Account.client.invoke(
            new Api.channels.JoinChannel({
                channel: 'vooi_app',
            })
        );
    } catch (error) {
        await log.errorDB(Account, "subChannel", error.message, error.stack);
        return null;
    } finally {
        await Account.disconnect();
    };
};

const start = async (Account) => {
    await subChannel(Account);
    await claim(Account);
    trade(Account);
    completeTasks(Account);
};

(async () => {
    await db.startApp();
    let accounts = await manager.start_Accounts();
    for (let account in accounts){
        await db.ensureByAddress(accounts[account]);
        await db.addProjectToWallet(accounts[account], config.mongoDB.project_name);
        let min = 1_000;
        let max = config.scheduler.max_time_in_ms;
        setTimeout(start, randomDelay(min, max), accounts[account]);
    };
})();