const TelegramApi = require("node-telegram-bot-api");
const { gameOptions, againOptions } = require("./options");

const token = "6968526666:AAFSrpF4gVwaZXlCO8zaWDhy4Cjn50vpVSM";

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage(
        chatId,
        `Сейчас я загадаю цифру от 0 до 9, а ты должен угадать`
    );
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, "Отгадывай", gameOptions);
};

const start = () => {
    bot.setMyCommands([
        { command: "/start", description: "Начальное приветствие" },
        { command: "/info", description: "Получить информацию о пользаке" },
        { command: "/game", description: "Игра угадай цифру" },
    ]);

    bot.on("message", async (msg) => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === "/start") {
            await bot.sendSticker(
                chatId,
                "https://tlgrm.ru/_/stickers/392/525/39252584-d29b-35f5-8345-d5ea9330cf86/2.webp"
            );
            return bot.sendMessage(
                chatId,
                `Добро пожаловать в телеграм бот Книгоед Контент`
            );
        }
        if (text === "/info") {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}`);
        }
        if (text === "/game") {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, "Я тебя не понимаю, попробуй еще раз");
    });

    bot.on("callback_query", async (msg) => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if (data === "/again") {
            return startGame(chatId);
        }

        if (data === chats[chatId]) {
            return bot.sendMessage(
                chatId,
                `Поздравляю, ты отгадал цифру ${chats[chatId]}`,
                againOptions
            );
        }
        return bot.sendMessage(
            chatId,
            `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`,
            againOptions
        );
    });
};

start();
