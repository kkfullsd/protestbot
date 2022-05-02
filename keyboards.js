let START_KEYBOARD = {
    reply_markup: {
        inline_keyboard: [
            [{
                    text: 'Вместе мы сила',
                    callback_data: 'chooselvl_multi'
                },
                {
                    text: 'Мой протест',
                    callback_data: 'chooselvl_single'
                }
            ],
            [{
                    text: ' Случайное задание',
                    callback_data: 'randomtask'
                },
                {
                    text: "Помощь",
                    callback_data: 'help'
                }
            ],
            // [{
            //     text: "Связаться с нами",
            //     callback_data: 'feedback'
            // }]
        ]
    }
}

let FEEDBACK_KEYBOARD = {
    reply_markup: {
        inline_keyboard: [
            [{
                text: "Отмена",
                callback_data: 'cancel'
            }]
        ]
    }
}

let getTaskKeyboard_single = (lvl) => ({
    reply_markup: {
        inline_keyboard: [
            [{
                text: `Я сделаю это!`,
                //TODO
                callback_data: `illdo_single`
            }],
            [{
                    text: "Выбрать сложность",
                    callback_data: 'chooselvl_single'
                },
                {
                    text: `Следующее`,
                    callback_data: `lvl${lvl}_single`
                }
            ]
        ]
    }
});

let getTaskKeyboard_multi = (lvl) => ({
    reply_markup: {
        inline_keyboard: [
            [{
                text: `Мы сделаем это!`,
                callback_data: `illdo_multi`
            }],
            [{
                    text: "Выбрать сложность",
                    callback_data: 'chooselvl_multi'
                },
                {
                    text: `Следующее`,
                    callback_data: `lvl${lvl}_multi`
                }
            ]
        ]
    }
});

let getIlldoKeyboard_multi = (lvl) => ({
    reply_markup: {
        inline_keyboard: [
            [{
                text: `Назад`,
                callback_data: `back`
            }],
            [{
                text: `Следующее`,
                callback_data: `lvl${lvl}_multi`
            }]
        ]
    }
});

let getIlldoKeyboard_single = (lvl) => ({
    reply_markup: {
        inline_keyboard: [
            [{
                text: `Назад`,
                callback_data: `back`
            }],
            [{
                text: `Следующее`,
                callback_data: `lvl${lvl}_single`
            }]
        ]
    }
});

let getRandomTaskKeyboard = (textIllDo, cq) => ({
    reply_markup: {
        inline_keyboard: [
            [{
                text: textIllDo,
                callback_data: cq
            }],
            [{
                text: `Назад`,
                callback_data: `back`
            }, {
                text: `Следующее`,
                callback_data: `randomtask`
            }]
        ]
    }
})


let LVL_KEYBOARD_SINGLE = {
    reply_markup: {
        inline_keyboard: [
            [{
                text: `Тайный шпион`,
                callback_data: 'lvl1_single'
            }],
            [{
                text: "Смелый партизан",
                callback_data: 'lvl2_single'
            }],
            [{
                text: "Герой",
                callback_data: 'lvl3_single'
            }],
            [{
                text: "Назад",
                callback_data: 'back'
            }]
        ]
    }
}

let LVL_KEYBOARD_MULTI = {
    reply_markup: {
        inline_keyboard: [
            // [{
            //     text: `Тайные шпионы`,
            //     callback_data: 'lvl1_multi'
            // }],
            [{
                text: "Смелые партизаны",
                callback_data: 'lvl2_multi'
            }],
            [{
                text: "Герои",
                callback_data: 'lvl3_multi'
            }],
            [{
                text: "Назад",
                callback_data: 'back'
            }]
        ]
    }
}

let HELP_KEYBOARD = {
    reply_markup: {
        inline_keyboard: [
            [{
                text: "Назад",
                callback_data: 'back'
            }]
        ]
    }
}

module.exports = {
    getTaskKeyboard_single,
    getTaskKeyboard_multi,
    getIlldoKeyboard_multi,
    getIlldoKeyboard_single,
    getRandomTaskKeyboard,
    START_KEYBOARD,
    LVL_KEYBOARD_SINGLE,
    LVL_KEYBOARD_MULTI,
    HELP_KEYBOARD,
    FEEDBACK_KEYBOARD
};