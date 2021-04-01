import { Channel, Client, Message, Permissions, TextChannel } from 'discord.js';
import { Observable, Subject } from 'rxjs';
import { CHANNELS, SERVER } from './DiscordServer';
import { Logger } from '../Logger';
var auth = require('../../package.json');
var botActions = require('../../botOntology.json');
import fs = require('fs');
import { BasicAction } from './UserActions';
import { Wikier } from '../Wiki/Wikier';
var exec = require('child_process').exec;

export class DiscordClient {

	L = new Logger();
	
	private static discordClient: DiscordClient;
	public bot: Client;

	messageSubject: Subject<Message>;
	message$: Observable<Message>;

	// See botOntolgy.json
	BASIC_ACTIONS: BasicAction[] = [];

	/**
	 * Wikier
	 */
	wikier = new Wikier();

	/**
	 * Use this class as singleton
	 * 
	 * ex: 		this.bot = DiscordClient.Instance;
	 */
	public static get Instance() {
		if (!this.discordClient) {
			this.discordClient = new DiscordClient();
		}
		return this.discordClient;
	}

	private constructor() {

		/**
		 * Create the Discord client
		 */
		this.bot = new Client();

		this.bot.on('ready', () => {
			this.L.logger.debug("The bot " + this.bot.user.username + " is connected!");
		});

		this.bot.login(auth.token);

		/**
		 * Expose an observable to any incoming message
		 */
		this.messageSubject = new Subject();
		this.message$ = this.messageSubject.asObservable();

		this.bot.on('message', (message: Message) => this.messageSubject.next(message));

		this.loadDefaults();

	}

	private loadDefaults() {

		this.BASIC_ACTIONS = botActions;
		this.L.logger.debug("Loaded basic actions!");

	}

	/**
	 * Will remove all messages in channel							
		// WARNING: 2 weeks old messages cannot be deleted by Discord default.
		// WARNING: number_of_messages_to_delete should be between 2 and 100;
	 * @param channelId The string id (not name) of the channel
	 * @param number of messages to delete should be between 2 and 100
	 */
	public async deleteMessagesFromChannel(channelId: string, number_of_messages_to_delete: number = 2) {

		try {
			this.L.logger.debug(`Delete for channel id: ${channelId}, messages: ${number_of_messages_to_delete}`);
			if (!number_of_messages_to_delete) {
				this.L.logger.error("Delete for channel failed due bad number of messages!")
				return;
			}

			const channel = this.bot.channels.cache.get(channelId) as TextChannel;
			channel.bulkDelete(number_of_messages_to_delete);

			this.L.logger.info(`Deleted ${number_of_messages_to_delete} messages at channel ${channel.name}`);

		} catch(ex) {
			this.L.logger.error(ex);
		}

	}

	/**
	 * Send any text to a channel
	 * @param channel The name of the channel, should be on CHANNELS array.
	 * @param message Any markdown string
	 */
	public sendToChannel(channel: string, message: string) {
		const channelId = CHANNELS[channel];

		if (channelId) {
			const c = this.bot.channels.cache.get(channelId) as TextChannel;
			c.send(message);
		}
		
	}

	public wikierRandom(message: Message) {

		const url = "https://en.wikipedia.org/wiki/";
		const index = Math.floor(Math.random() * this.wikier.lines.length) + 1 ;
		const response = url + this.wikier.lines[index - 1];
		this.L.logger.debug("Got random! " + response);
		message.reply(response);

	}

	public getDate(message: Message) {

		this.execute("ddate", (date: string) => {
			message.reply(date);
		})

	}

	private execute(command: string, callback: Function){
		exec(command, function(error, stdout, stderr){ callback(stdout); });
	};
 
}