module.exports = {

    // Launch scheduler, settings for daily task execution 
    scheduler: {
        // max_time - the maximum duration (in minutes) during which the data collection will run
        max_time: 10, 

        // Convert max_time into millisecondsd
        get max_time_in_ms() {
            return this.max_time * 60 * 1000;  
        }
    },

    // Decryption of imported data
    decryption: {
        // decrypt - if true, the imported data is considered encrypted and needs decryption;
        // if false, the data is considered unencrypted.
        decrypt: false,
        
        // message - the passphrase used for decrypting the data
        message: "Sup, bro"
    },

    mongoDB: {
        use: true,
        URI: "mongodb+srv://USERMANE:PASSWORD@sybilling.XXXX.mongodb.net/?retryWrites=true&w=majority&appName=NAME",
        project_name: "VOOI"
    },

    TGbot: {
        token: "1241241412412412412412412412414",
        allowedUsers: [1231231313]
    },
};