# VOOI-Trader
 
<p>
      <img src="https://i.ibb.co/3sHQCSp/av.jpg" >
</p>

<p >
   <img src="https://img.shields.io/badge/build-v_1.0-brightgreen?label=Version" alt="Version">
</p>


## About
VOOI Trader is software designed to automate Telegram account activities within the VOOI Trader App project. The tool automates reward collection, performs trades, and completes tasks with specified delays and logic, providing full automation for various actions.

## Features

- **User Masking and Simulation:** Supports user masking and simulation to ensure secure use.
- **SOCKS5 Proxy Support:** Enables the use of SOCKS5 proxies for anonymity and multi-account management.
- **Automated Trading:** The software executes trades, increasing trading volume. Each trade remains open for a random duration of up to 2 hours. After closing, a new trade is randomly opened within the next 2 hours. Trade direction (long/short) and token selection are randomized.
- **Daily Task Execution:** Executes daily tasks required for project participation.
- **Reward Claiming for Friends:** Automatically collects rewards for referred users.
- **Timed Reward Collection:** Automatically collects rewards at random intervals (from 8 to 8.5 hours).
- **MongoLog Integration:** Integrated with MongoLog for convenient logging, action tracking, and account statistics.

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

    
Explanation of parameters:
- **MAXTIME**: The maximum time (in milliseconds) that will be randomly assigned to delay the execution of start each account. All accounts will be triggered within this random delay. For example, if MAXTIME is set to 5000, the start can occur anytime between 1 second and 5 seconds (1000-5000 milliseconds).
- **decrypt**: Used for encrypted text. If not needed, leave it false. If needed, set to true.
- **message**: A phrase for decryption.
- **use**: true or false, use mongolog
- **URI**: MongoDB auth URI
- **token**: tg bot token, work with mongolog
- **allowedUsers**: tg id for fatal tg alert






## License

Project **brodev3**/VOOI-Trader distributed under the MIT license.
