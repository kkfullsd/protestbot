let TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');
const DBUtils = require('./DBUtils');


const {
    getTaskKeyboard_multi,
    getTaskKeyboard_single,
    START_KEYBOARD,
    LVL_KEYBOARD_SINGLE,
    LVL_KEYBOARD_MULTI,
    getIlldoKeyboard_multi,
    getIlldoKeyboard_single,
    getRandomTaskKeyboard,
    HELP_KEYBOARD,
    FEEDBACK_KEYBOARD
} = require('./keyboards')
const texts = require('./database/texts.json');
const FeedBackUtil = require('./FeedBackUtil');

const token = '5161448153:AAGDZkDdqVAog-XCrQ-ZE8d4xN-qb0ZzxXY';

const bot = new TelegramBot(token, {
    polling: true,
});

bot.sendPhotoOld = bot.sendPhoto;

bot.sendPhoto = async function (chatId, photo, options, fileOptions) {
    return await bot.sendPhotoOld(chatId, photo, {
        ...options,
        parse_mode: 'Markdown'
    }, fileOptions)
}

bot.sendMessageOld = bot.sendMessage;

bot.sendMessage = async function (chatId, text, options) {
    return await bot.sendMessageOld(chatId, text, {
        ...options,
        parse_mode: 'Markdown'
    })
}


async function start() {

    let task;

    let singleTaskDB = new DBUtils("./database/single-protest.json", "./images");
    let multiTaskDB = new DBUtils("./database/multi-protest.json", "./images");


    let sendTask = async (chatId, image, text, options) => {
        if (image && fs.existsSync(image)) {
            let imageBuffer = fs.readFileSync(image);

            if (text.length >= 1024) {
                await bot.sendPhoto(chatId, imageBuffer);
                await bot.sendMessage(chatId, text, options);
            } else {
                await bot.sendPhoto(chatId, imageBuffer, {
                    ...options,
                    caption: text
                });
            }
        } else {
            bot.sendMessage(chatId, text, options);
        }
    }

    let sendStartMessage = async (id) => {
        let startImage = [
            "./images/start1.jpg",
            "./images/start2.jpg",
            "./images/start3.jpg",
            "./images/start4.jpg",
            "./images/start5.jpg"
        ].random()
        let imageBuffer = fs.readFileSync(startImage);
        bot.sendPhoto(id, imageBuffer, {
            ...START_KEYBOARD,
            parse_mode: "Markdown",
            caption: texts.startText
        });
    }

    bot.on('message', async (msg) => {
        if (msg.text === '/start') {
            
            await sendStartMessage(msg.from.id);
        }
    })


    bot.on('callback_query', function onCallbackQuery(cq) {
        switch (cq.data) {
            case 'randomtask':
                if (Math.random() > 0.5) {
                    task = [singleTaskDB.getRandomTaskByLvl(1), singleTaskDB.getRandomTaskByLvl(2)].random();
                    sendTask(cq.message.chat.id, task.image, task.text, getRandomTaskKeyboard("Я сделаю это", 'illdo_single'));
                } else {
                    task = multiTaskDB.getRandomTask()
                    sendTask(cq.message.chat.id, task.image, task.text, getRandomTaskKeyboard("Мы сделаем это", 'illdo_single'));
                }
                break;
            case 'chooselvl_single':
                bot.sendPhoto(cq.message.chat.id, fs.readFileSync('./images/chooselvl-single.jpg'), {
                    ...LVL_KEYBOARD_SINGLE,
                    caption: texts.chooselvl_single
                });
                break;
            case 'lvl1_single':
                task = singleTaskDB.getRandomTaskByLvl(1);
                sendTask(cq.message.chat.id, task.image, task.text, getTaskKeyboard_single(1));
                break;
            case 'lvl2_single':
                task = singleTaskDB.getRandomTaskByLvl(2);
                sendTask(cq.message.chat.id, task.image, task.text, getTaskKeyboard_single(2));
                break;
            case 'lvl3_single':
                task = singleTaskDB.getRandomTaskByLvl(3);
                sendTask(cq.message.chat.id, task.image, task.text, getTaskKeyboard_single(3));
                break;
            case 'chooselvl_multi':
                bot.sendPhoto(cq.message.chat.id, fs.readFileSync('./images/chooselvl-multi.jpg'), {
                    ...LVL_KEYBOARD_MULTI,
                    caption: texts.chooselvl_multi
                });
                break;
            case 'lvl1_multi':
                task = multiTaskDB.getRandomTaskByLvl(1);
                sendTask(cq.message.chat.id, task.image, task.text, getTaskKeyboard_multi(1));
                break;
            case 'lvl2_multi':
                task = multiTaskDB.getRandomTaskByLvl(2);
                sendTask(cq.message.chat.id, task.image, task.text, getTaskKeyboard_multi(2));
                break;
            case 'lvl3_multi':
                task = multiTaskDB.getRandomTaskByLvl(3);
                sendTask(cq.message.chat.id, task.image, task.text, getTaskKeyboard_multi(3));
                break;
            case 'illdo_multi':
                //TODO
                sendTask(cq.message.chat.id, task.image, texts.illdo_multi, getIlldoKeyboard_multi(task.lvl));
                break;
            case 'illdo_single':
                //TODO
                sendTask(cq.message.chat.id, task.image, texts.illdo_single, getIlldoKeyboard_single(task.lvl));
                break;
            case 'help':
                sendTask(cq.message.chat.id, "", texts.help, HELP_KEYBOARD);
                break;
            // case 'feedback':
            //     sendTask(cq.message.chat.id, "", texts.feedback, FEEDBACK_KEYBOARD);
            //     handleFeedBack(cq);
            //     break;
            case 'back':
                sendStartMessage(cq.message.chat.id)
                break;
            default:
                break;
        }

    });

    //TODO
    function handleFeedBack(cq) {
        async function msgHandler(msg) {
            let fbUtil = new FeedBackUtil();

            let attachments = {}

            let text = msg.text | "";
            let photo = msg.photo;
            let document = msg.document;
            let video = msg.video;

            if (photo) {
                let photoId = photo[photo.length-1].file_id
                attachments.photo = photoId
            }

            if (document) {
                console.log(document)
                const docId = document.file_id;
                attachments.document = docId;
            }

            if (video) {
                const videoId = msg.video.file_id;
                attachments.video = videoId;
            }
            try {
                fbUtil.addFeedBack(text, msg.chat.username, attachments);
            } catch (e) {
                console.log(e);
            }
            bot.sendMessage(msg.chat.id, "Данные отправлены", {reply_markup: {inline_keyboard: [[{text: "В главное меню", callback_data: 'cancel'}]]}})
            
        }

        bot.on('message', msgHandler);

        bot.on('callback_query', async (cq) => {
            if (cq.data === 'cancel') {
                await sendStartMessage(cq.message.chat.id);
                bot.removeListener('message', msgHandler)
            }
        })

    }


}

start();