import { DiscordClient } from './Discord/DiscordClient';
import { Logger } from './Logger';
import readline = require('readline');
import { UI_ACTIONS } from './Discord/UserActions';
import { BOT_ACTIONS } from './Discord/BotActions';
import { ApoloServer } from './Apolo/ApoloServer';
import { Wikier } from './Wiki/Wikier';
import { Registry } from './Registry/Registry';

export class MainKernel {

	/**
	 * ///////////////
	 */
	L = new Logger();

	bot: DiscordClient;

	apolo: ApoloServer;

	lastConsole: string = "";

	registry: Registry;

	constructor() {

		/**
		 * Get an instance of the main Discord client
		 */
		this.L.logger.info("Starting main bot...");
		this.bot = DiscordClient.Instance;

		/**
		 * Dispatch the console entrypoint for this nodejs app
		 */
		this.L.logger.info("Starting server console...");
		this.console();

		/**
		 * Create apolo connection
		 */
		// this.apolo = new ApoloServer();

		/**
		 * Attach some basic listeners/triggers to any user message from 
		 * Discord.
		 */
		this.L.logger.info("Adding bot functionality...");
		this.basicLogic();

		/**
		 * Open the registry
		 */
		this.registry = new Registry();

	}

	/**
	 * Make this nodejs app to act as a console reader.
	 */
	console() {
		/**
		 * Hold the app as client by reading console
		 */
		this.L.logger.debug("Run the index at: " + new Date());

		readline.emitKeypressEvents(process.stdin);

		process.stdin.on('keypress', (str, key) => {
			if (key.ctrl && key.name === 'c') {
				process.exit();		
			} else if (key && key.name == 'enter') {
				this.L.logger.info(`You have entered "${this.lastConsole}" text`);

				/**
				 * Try to discover if the input text matches any available bot action and trigger it.
				 */
				const commandWithoutParameters = this.lastConsole.split(" ")[0];
				const findBotAction = BOT_ACTIONS.find(f => f.content == commandWithoutParameters);
				if (findBotAction) findBotAction.response(this.lastConsole, this.bot);

				/**
				 * Clean
				 */
				this.lastConsole = "";
		
			} else {
				this.lastConsole += str;
			}
		});
	}

	/**
	 * Connect a listener to incoming messages from bot server. 
	 * Trigger responses to those messages.
	 */
	basicLogic() {

		/**
		 * Text related
		 */
		this.bot.message$.subscribe(async m => {

			this.L.logger.info(new Date() + " discord-botBot: new Message: " + m.content);

			const action = this.bot.BASIC_ACTIONS.find(f => f.content == m.content);
			if (action) m.reply(action.response);

		})

		/**
		 * UI related
		 */
		this.bot.message$.subscribe(async m => {

			const action = UI_ACTIONS.find(f => f.content == m.content.substr(0, f.content.length));
			if (action) action.response(m, this.bot, this.registry);

		})

		/**
		 * Subscribe to main Apolo state
		 */
		/*this.apolo.client.defaultState$.subscribe(m => {
			const message = '```json\n' + JSON.stringify(m) + '\n```';
			this.bot.sendToChannel('aula-de-bots', message);
			this.L.logger.info("Send state to channel: aula-de-bots");
		})*/
	}

}
