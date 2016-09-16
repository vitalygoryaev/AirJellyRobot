var telegram = require('telegram-bot-api');

let subscriptions = {};
let _25MIN = 25 * 60 * 1000;
let _5MIN = 5 * 60 * 1000;

let keyboard = {
	keyboard: [[
		{
			text: '/start'
		},
		{
			text: '/finish'
		}
	]],
	resize_keyboard: true
};

var api = new telegram({
        token: '250208713:AAFuZWmYhgYO83JdnKwK1mNQ4ehwoGtMFpI',
		updates: {
            enabled: true,
			get_interval: 100
    	}
});

api.getMe()
	.then(function(data)
	{
		console.log(data);
	})
	.catch(function(err)
	{
		console.log(err);
	});

api.on('message', function(message)
{
	let chatId = message.chat.id;

    if (message.text == '/start') {
		if (subscriptions[chatId] && subscriptions[chatId].running) {
			sendBasicText(chatId, 'Timer is already running! Work while you can!');
			return;
		}

		subscriptions[chatId] = {
			running: true
		};

		goHard(chatId)
			.then(() => sendBasicText(chatId, 'in case of cheating type /finish'))
		
		return;
	}

	if (message.text == '/finish') {
		if (subscriptions[chatId] && subscriptions[chatId].running) {
			clearTimeout(subscriptions[chatId].goHardSetTimeout);
			clearTimeout(subscriptions[chatId].relaxSetTimeout);

			subscriptions[chatId] = {
				running: false
			};

			sendBasicText(chatId, 'pomodorro stopped');
		} else {
			sendBasicText(chatId, 'pomodorro is not running!');
		}

		return;
	}

	if (subscriptions[chatId] && subscriptions[chatId].running) {
		sendBasicText(chatId, 'type /finish to stop pomodorro');
	} else {
		sendBasicText(chatId, 'type /start to start pomodorro');
	}
});

function relax(chatId) {
	return new Promise( /* executor */ function(resolve, reject) { 
		sendBasicText(chatId, 'Relax, take it easy, tomorrow is another day');
		subscriptions[chatId].relaxSetTimeout = setTimeout(goHard.bind(null, chatId), _5MIN);

		resolve();
	})
}

function goHard(chatId) {
	return new Promise( /* executor */ function(resolve, reject) { 
		sendBasicText(chatId, 'Go hard or go home!');
		subscriptions[chatId].goHardSetTimeout = setTimeout(relax.bind(null, chatId), _25MIN);

		resolve();
	})
}

function sendBasicText(chatId, text) {
	api.sendMessage({
		chat_id: chatId,
		text: text,
		reply_markup: JSON.stringify(keyboard)
	});
}