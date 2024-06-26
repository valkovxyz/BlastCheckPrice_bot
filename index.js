const { Telegraf } = require('telegraf');
const fetch = require('node-fetch');

// Вставьте ваш токен
const bot = new Telegraf('6885029786:AAGaA5Vtf1vqd_2izTs_-KPEU7H5PqJ-k-M');

// Глобальные переменные для хранения настроек
const alertPrices = [0.03, 0.035, 0.04, 0.045, 0.05, 0.055, 0.06, 0.065, 0.07];
let triggeredPrices = [];

// Функция для получения текущей цены пары BLAST/USDT с CoinGecko
async function getPrice() {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=blast&vs_currencies=usd');
    const data = await response.json();
    return data.blast.usd;
}

// Обработка команды /start
bot.start((ctx) => ctx.reply('Привет! Я бот для отслеживания цен пары BLAST/USDT.'));

// Функция для проверки цены и отправки уведомлений
async function checkPrice() {
    const price = await getPrice();
    alertPrices.forEach(alertPrice => {
        if (price >= alertPrice && !triggeredPrices.includes(alertPrice)) {
            bot.telegram.sendMessage('YOUR_CHAT_ID', `Цена достигла ${alertPrice}: текущая цена ${price}`);
            triggeredPrices.push(alertPrice);
        }
    });
}

// Запуск проверки цены каждые 10 секунд
setInterval(checkPrice, 10000);

bot.launch();
