const fs = require('fs');
const crypto = require('crypto');
const csv = require('csv-parser');
require('dotenv').config();  
const path = require("path");
const config = require("../../input/config");
const log = require("./logger");

const secretKey = crypto.createHash('sha256').update(config.decryption.message).digest();
const inputFilePath = path.resolve(path.resolve(__dirname, '..'), '..') + '/input/w.csv';

function decrypt(text, secretKey) {
  const [iv, encrypted] = text.split(':');
  const decipher = crypto.createDecipheriv('aes-256-cbc', secretKey, Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

let get_AccountsData = function () {
  try {
      const data = fs.readFileSync(path.resolve(path.resolve(__dirname, '..'), '..') + "/input/w.json", 'utf8');
      const jsonData = JSON.parse(data);
      return jsonData;
      } catch (error) {
        log.error(error);
        throw error;
    };
};

let write_AccountsData = function (data) {
    try {
      fs.writeFileSync(path.resolve(path.resolve(__dirname, '..'), '..') + "/input/w.json", JSON.stringify(data, null, 2), 'utf8');
      return true;
    } catch (error) {
        log.error(error);
        throw error;
    };
};

async function readDecryptCSVToArray() {
  return new Promise((resolve, reject) => {
    const decryptedRows = [];

    fs.createReadStream(inputFilePath)
      .pipe(csv())
      .on('data', (row) => {
        const decryptedRow = {};

        for (let key in row) 
          decryptedRow[key] = decrypt(row[key], secretKey);
        
        decryptedRows.push(decryptedRow);
      })
      .on('end', () => {
        log.info('The w.csv file was successfully decrypted');
        const result = decryptedRows.map(row => {
          return Object.values(row).join(','); 
        });
        resolve(result);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

async function readCSVToArray() {
  return new Promise((resolve, reject) => {
    const rows = [];

    fs.createReadStream(inputFilePath)
      .pipe(csv())
      .on('data', (row) => {
        rows.push(row);
      })
      .on('end', () => {
        log.info('The w.csv file was read successfully');
        const result = rows.map(row => {
          return Object.values(row).join(','); 
        });
        resolve(result);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

const locals = [
  "de-DE", // German (Germany)
  "en-GB", // English (UK)
  "en-US", // English (US)
  "fr-FR", // French (France)
  "es-ES", // Spanish (Spain)
  "pt-BR", // Portuguese (Brazil)
  "zh-CN", // Chinese (Simplified, China)
  "ru-RU", // Russian (Russia)
  "it-IT", // Italian (Italy)
  "ko-KR", // Korean (South Korea)
  "ja-JP", // Japanese (Japan)
  "nl-NL", // Dutch (Netherlands)
  "sv-SE", // Swedish (Sweden)
  "pl-PL", // Polish (Poland)
  "fi-FI", // Finnish (Finland)
  "no-NO", // Norwegian (Norway)
  "da-DK", // Danish (Denmark)
  "ar-SA", // Arabic (Saudi Arabia)
  "he-IL", // Hebrew (Israel)
  "tr-TR", // Turkish (Turkey)
  "cs-CZ", // Czech (Czech Republic)
  "hu-HU", // Hungarian (Hungary)
  "el-GR", // Greek (Greece)
  "th-TH", // Thai (Thailand)
  "vi-VN", // Vietnamese (Vietnam)
  "id-ID", // Indonesian (Indonesia)
  "ms-MY", // Malay (Malaysia)
  "uk-UA", // Ukrainian (Ukraine)
  "ro-RO", // Romanian (Romania)
  "sk-SK"  // Slovak (Slovakia)
];

function get_UA() {
    const majorVersion = Math.floor(Math.random() * (129 - 115 + 1)) + 115; // 115-129
    const buildVersion = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
    const patchVersion = Math.floor(Math.random() * 90) + 10; // 10-99

    const userAgent = `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${majorVersion}.0.${buildVersion}.${patchVersion} Safari/537.36`;

    const randomBrandChar = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        return chars.charAt(Math.floor(Math.random() * chars.length));
    };

    const notABrand = `Not=${randomBrandChar()}${randomBrandChar()}${randomBrandChar()}?Brand`;

    const componentUserAgent = `"Google Chrome";v="${majorVersion}", "${notABrand}";v="8", "Chromium";v="${majorVersion}"`;

    return {
        userAgent: userAgent,
        componentUserAgent: componentUserAgent
    };
};

function getMobileUA() {
  const majorVersion = Math.floor(Math.random() * (129 - 115 + 1)) + 115; 
  const buildVersion = Math.floor(Math.random() * 9000) + 1000; 
  const patchVersion = Math.floor(Math.random() * 90) + 10; 

  const deviceModels = [
      "SM-G991B", "SM-G996B", "SM-G998B", "SM-A528B", "SM-M307F", // Samsung
      "Pixel 4", "Pixel 5", "Pixel 6", "Pixel 7", // Google Pixel
      "Redmi Note 10", "Redmi Note 11", "Redmi K40", "Mi 11", "Mi 10", // Xiaomi
      "OnePlus 8", "OnePlus 9", "OnePlus Nord", // OnePlus
      "Huawei P30", "Huawei P40", "Huawei Mate 30", "Huawei Mate 40", // Huawei
      "Honor 30", "Honor 50", "Oppo Reno5", "Oppo Reno6" // Oppo, Honor
  ];

  const deviceModel = deviceModels[Math.floor(Math.random() * deviceModels.length)];
  const userAgent = `Mozilla/5.0 (Linux; Android 10; ${deviceModel}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${majorVersion}.0.${buildVersion}.${patchVersion} Mobile Safari/537.36`;
  return userAgent;
};

let get_Local = function () {
    return locals[Math.floor(Math.random() * locals.length)];
};

const timeToNextDay = () => {
    const nowUTC = new Date(Date.UTC(
        new Date().getUTCFullYear(),
        new Date().getUTCMonth(),
        new Date().getUTCDate(),
        new Date().getUTCHours(),
        new Date().getUTCMinutes(),
        new Date().getUTCSeconds()
    ));
    
    const nextDayStartUTC = new Date(Date.UTC(
        nowUTC.getUTCFullYear(),
        nowUTC.getUTCMonth(),
        nowUTC.getUTCDate() + 1 
    ));
    
    const randomMinutes = Math.floor(Math.random() * 23 * 60); 
    const randomDateUTC = new Date(nextDayStartUTC.getTime() + randomMinutes * 60 * 1000);
    
    return randomDateUTC - nowUTC;
};

const parseDateToTimestamp = (dateString, timezoneOffset) => {
    const [datePart, timePart] = dateString.split('-');
    const [day, month, year] = datePart.split('.').map(Number);
    const [hours, minutes] = timePart.split(':').map(Number);
    const date = new Date(Date.UTC(2000 + year, month - 1, day, hours, minutes));
    const offsetInMs = timezoneOffset * 60 * 60 * 1000;
    return date.getTime() - offsetInMs;
};

module.exports = {
  get_Local,
  get_UA,
  timeToNextDay,
  readDecryptCSVToArray,
  readCSVToArray,
  parseDateToTimestamp,
  write_AccountsData,
  get_AccountsData,
  getMobileUA
};

