# VOOI-Trader
 
<p>
      <img src="https://i.ibb.co/3sHQCSp/av.jpg" >
</p>

<p >
   <img src="https://img.shields.io/badge/build-v_1.0-brightgreen?label=Version" alt="Version">
</p>


## About
Software designed to automate Telegram account activities within the **VOOI Trader App**. The tool automates reward collection, performs trades, and completes tasks with specified delays and logic, providing full automation for various actions.

## Features

- **User Masking and Simulation:** Supports user masking and simulation to ensure secure use.

- **SOCKS5 Proxy Support:** Enables the use of SOCKS5 proxies for anonymity and multi-account management.

- **Automated Trading:** The software executes trades, increasing trading volume. Each trade remains open for a random duration of up to 2 hours. After closing, a new trade is randomly opened within the next 2 hours. Trade direction (long/short) and token selection are randomized.

- **Task Execution:** Completes tasks daily.

- **Reward Claiming for Friends:** Automatically collects rewards for referred users.

- **Timed Reward Collection:** Automatically collects rewards at random intervals (from 8 to 8.5 hours).

- **MongoLog Integration:** Integrated with [MongoLog](https://github.com/brodev3/MongoLog) for convenient logging, action tracking, and account statistics.

 ## Configuration
 Before starting, you need to configure the ```сonfigEXAMPLE.js``` file. Rename to ```сonfig.js```, open and set the following parameters:
 
    {
        scheduler: {
            max_time: 2, 
        },

        decryption: {
            decrypt: false,
            message: "Sup, bro"
        },

        mongoDB: {
            use: true,
            URI: "mongodb+srv://USERMANE:PASSWORD@sybilling.XXXX.mongodb.net/?retryWrites=true&w=majority&appName=NAME",
            project_name: "NFPromt"
        },

        TGbot: {
            token: "1241241412412412412412412412414",
            allowedUsers: [1231231313]
        },
    };

    
### Explanation of Parameters
- **scheduler.max_time**: The maximum time (in minutes) that will be randomly assigned to delay the start of each account. All accounts will begin within this random delay. For example, if `max_time` is set to 5, the start time for each account can occur anytime between 1 and 5 minutes.

- **decryption.decrypt**: Used for encrypted text. If not needed, leave it as `false`. If decryption is required, set it to `true`.

- **decryption.message**: A phrase used for decryption.

- **mongoDB.use**: Set to `true` if you want to use MongoLog; set to `false` if not needed.

- **mongoDB.URI**: Authentication URI for MongoDB.

- **TGbot.token**: Telegram bot token used to send MongoLog notifications.

- **TGbot.allowedUsers**: List of Telegram user IDs to whom notifications will be sent.

## Account Configuration
To use the software, you need to create a Telegram session and configure the `w.json` file with account details.

### Importing Accounts
Use `import.js` to import accounts:
   ```bash
   node scr/telegram/import
```

### Setting Up API Credentials

You will need to create an application and obtain the api_id and api_hash for each of your accounts. Visit https://my.telegram.org/ to generate these credentials.

### Proxy Configuration

The proxy format should be in the form of `ip:port:login:pass`. Alternatively, leave the field false for a direct connection.

### Example `w.json` Configuration

Below is an example of how to set up accounts in `w.json`:

   ```json
   {
  "account1": { 
    "api_id": 1111111, 
    "api_hash": "12sd24gt2fd32vs3c4", 
    "session": "...", 
    "proxy": {
      "ip": "11.222.33.444", 
      "port": 11111, 
      "username": "username",
      "password": "password",
      "socksType": 5,
      "timeout": 2
    }
  },
  "account2": { 
    "api_id": 1111111, 
    "api_hash": "12sd24gt2fd32vs3c4", 
    "session": "...", 
    "proxy": false
  }
}
```
Each account entry should contain:

 - **api_id**: API ID for the Telegram application.
 - **api_hash**: API hash for the Telegram application.
 - **session**: Telegram session string for the account.
 - **proxy (optional)**: Proxy settings for the account, including:
     - **ip**: Proxy server IP address.
     - **port**: Proxy server port.
     - **username**: Username for proxy authentication.
     - **password**: Password for proxy authentication.
     - **socksType**: SOCKS type (e.g., 5 for SOCKS5).
     - **timeout**: Timeout in seconds for the proxy connection.

## Setup

1. Node JS
2. Clone the repository to your disk
3. In the **input** folder, change the name of the ```configEXMAPLE.js``` on ```config.js```
4. Launch the console (for example, Windows PowerShell)
5. Specify the working directory where you have uploaded the repository in the console using the CD command
    ```
    cd C:\Program Files\VOOI-Trader
    ```
6. Install packages
   
    ```
    npm install
    ```
7. To start: 
    ```
    node index
    ```


## License

Project **brodev3**/VOOI-Trader distributed under the MIT license.
