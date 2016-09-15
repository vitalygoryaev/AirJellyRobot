var telegram = require('telegram-bot-api');

let subscriptions = {};
let _25MIN = 25 * 60 * 1000;
let _5MIN = 5 * 60 * 1000;

var api = new telegram({
        token: '250208713:AAFuZWmYhgYO83JdnKwK1mNQ4ehwoGtMFpI',
		updates: {
            enabled: true
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
		subscriptions[chatId] = {
			running: true
		};

		goHard(chatId);
		sendBasicText(chatId, 'in case of cheating type /finish');

		return;
	}

	if (message.text == '/finish') {
		subscriptions[chatId] = {
			running: false
		};

		clearTimeout(subscriptions[chatId].goHardSetTimeout);
		clearTimeout(subscriptions[chatId].relaxSetTimeout);

		sendBasicText(chatId, 'pomodorro stopped');

		return;
	}

	if (subscriptions[chatId] && subscriptions[chatId].running) {
		sendBasicText(chatId, 'type /finish to stop pomodorro');
	} else {
		sendBasicText(chatId, 'type /start to start pomodorro');
	}
});

function relax(chatId) {
	if (subscriptions[chatId].running) {
		sendBasicText(chatId, 'Relax, take it easy, tomorrow is another day');

		subscriptions[chatId].relaxSetTimeout = setTimeout(goHard.bind(null, chatId), _5MIN);
	}
}

function goHard(chatId) {
	if (subscriptions[chatId].running) {
		sendBasicText(chatId, 'Go hard or go home!');

		subscriptions[chatId].goHardSetTimeout = setTimeout(relax.bind(null, chatId), _25MIN);
	}
}

function sendBasicText(chatId, text) {
	api.sendMessage({
		chat_id: chatId,
		text: text
	});
}