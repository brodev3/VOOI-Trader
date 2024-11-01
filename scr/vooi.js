const log = require("./utils/logger");
const telegram = require("./telegram/telegram");
const fetcher = require("./utils/fetcher");

class TradingBot {
  constructor() {
    this.URL = "https://api-tg.vooi.io/api/";
  }

  async delay(delayTime) {
    return new Promise(resolve => setTimeout(resolve, delayTime));
  }

  async login(Account) {
    try {
      let TgWebData = await telegram.get_TgWebData(Account);
      TgWebData = TgWebData.split("&")[1];

      const result = await fetcher.post(this.URL + "v2/auth/login", { initData: TgWebData }, Account);
      Account.options.headers.authorization = `Bearer ${result.tokens.access_token}`;
    } catch (err) {
      log.errorDB(Account, "login", err.message, err.stack);
      return null;
    }
  }

  async autotrade(Account) {
    try {
      const result = await fetcher.get(this.URL + "autotrade", Account);
      return result;
    } catch (err) {
      log.errorDB(Account, "autotrade", err.message, err.stack);
      return null;
    }
  }

  async startAutotrade(Account) {
    try {
      const result = await fetcher.post(this.URL + "autotrade/start", {}, Account);
      return result;
    } catch (err) {
      log.errorDB(Account, "startAutotrade", err.message, err.stack);
      return null;
    }
  }

  async claimAutotrade(Account, autoTradeId) {
    try {
      const result = await fetcher.post(this.URL + "autotrade/claim", { autoTradeId }, Account);
      return result;
    } catch (err) {
      log.errorDB(Account, "claimAutotrade", err.message, err.stack);
      return null;
    }
  }

  async tasks(Account) {
    try {
      const result = await fetcher.get(this.URL + "tasks?limit=200&skip=0", Account);
      return result;
    } catch (err) {
      log.errorDB(Account, "tasks", err.message, err.stack);
      return null;
    }
  }

  async taskClaim(Account, id) {
    try {
      const result = await fetcher.post(this.URL + "tasks/claim/" + id, {}, Account);
      return result;
    } catch (err) {
      log.errorDB(Account, "taskClaim", err.message, err.stack);
      return null;
    }
  }

  async taskStart(Account, id) {
    try {
      const result = await fetcher.post(this.URL + "tasks/start/" + id, {}, Account);
      return result;
    } catch (err) {
      log.errorDB(Account, "taskStart", err.message, err.stack);
      return null;
    }
  }

  async position(Account) {
    try {
      const result = await fetcher.get(this.URL + "trades/positions?limit=10&skip=0&statuses=open", Account);
      return result;
    } catch (err) {
      log.errorDB(Account, "position", err.message, err.stack);
      return null;
    }
  }

  async long(Account, pairID) {
    try {
      const result = await fetcher.post(this.URL + "trades/create", {
        amount: "100",
        leverage: 50,
        pairId: pairID,
        type: "long"
      }, Account);
      return result;
    } catch (err) {
      log.errorDB(Account, "long", err.message, err.stack);
      return null;
    }
  }

  async short(Account, pairID) {
    try {
      const result = await fetcher.post(this.URL + "trades/create", {
        amount: "100",
        leverage: 50,
        pairId: pairID,
        type: "short"
      }, Account);
      return result;
    } catch (err) {
      log.errorDB(Account, "short", err.message, err.stack);
      return null;
    };
  };

  async closePosition(Account, positionID) {
    try {
      const result = await fetcher.patch(this.URL + "trades/close/" + positionID, {}, Account);
      return result;
    } catch (err) {
      log.errorDB(Account, "closePosition", err.message, err.stack);
      return null;
    };
  };

  async claimFriends(Account) {
    try {
      const result = await fetcher.post(this.URL + "frens/claim", {}, Account);
      return result;
    } catch (err) {
      log.errorDB(Account, "claimFriends", err.message, err.stack);
      return null;
    };
  };

  async balance(Account) {
    try {
      const result = await fetcher.get(this.URL + "balance", Account);
      return result;
    } catch (err) {
      log.errorDB(Account, "balance", err.message, err.stack);
      return null;
    };
  };
  
  async frensPoints(Account) {
    try {
      const result = await fetcher.get(this.URL + "frens?limit=10&skip=0", Account);
      return result;
    } catch (err) {
      log.errorDB(Account, "frensPoints", err.message, err.stack);
      return null;
    };
  };
};

module.exports = TradingBot;
