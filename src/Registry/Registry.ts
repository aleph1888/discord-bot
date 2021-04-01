import { Message } from 'discord.js';
import fs = require('fs');
import { v4 as uuidv4 } from 'uuid';
import { Logger } from '../Logger';

export class Item {
	token: string;
	owner: string;
	caption: string; 
	url: string;
	tags: string;
	date: Date;
	reviewed: Boolean;
}

export class Registry {

	// Configure here the path to the registry. IT MUST BE OUTSIDE THE APP PATH because reload will trigger every add action.
	REGISTRY_FILE: string = __dirname + '/../../../registry/registry.json';

	L = new Logger();
	
	data: Item[];

	constructor() {
		this.load();
	}

	getHelp() {
		return " \n - TO REGISTER AN ART:  **add '<caption>' '<url>' '<tags>'** \n Ex: *!discord-bot add 'my picture 1' 'https://some.url' 'category: dreams'* \n NOTICE: you can use tags to input whatever you like, i.e., hashtags, categories, keywords... it is free text. NOTICE: Don't forget the QUOTES ['] as indicated. And also, don't use any other quotes ['] in the texts.\n" +
			   " \n- TO READ: \n\t **from 'owner' '<owner>'** or \n\t **from 'caption' '<caption>'** or \n\t **from 'tags' '<tags>'** or \n\t **from 'token' '<token>'** \n Ex: *!discord-bot from 'owner' 'ADACIC1033'* \n NOTICE: **Use the @owner** not the caption of the owner; click on a user to get profile. \n" +
			   " \n- TO DELETE: \n\t **delete '<token>'**  Ex: *!discord-bot delete 'c371c4fd-a544-4352-96c2-22eb5f1bf49e'* \n" +
			   " \n- TO REVIEW: \n\t **review '<token>'**  Ex: *!discord-bot review 'c371c4fd-a544-4352-96c2-22eb5f1bf49e'* \N NOTICE: you can do: **!discord-bot from 'reviewed' 'false'** to get a list of pending arts. \n" +
			   " \n\n Disclaimer: this feature is on a very early stage and it should be used only for testing purpose. Backup any data you add as it probably will be lost. Errors will be silently discard. It is case sensitive.";

	}

	load() {
		const data = fs.readFileSync(this.REGISTRY_FILE, 'utf8');
		
		try {
			this.data = JSON.parse(data || JSON.stringify([]));		
		} catch(ex) {
			this.L.logger.error(ex)
		}
	}

	addArt (message: Message) {
		
		const keys = this.getKeys(message.content); 
	
		if (keys.length != 3) {
			message.reply("Ouch! Error here. Did you follow the pattern? Don't forget the QUOTES as expected. Don't use any other quotes anywhere in your texts!!!");
			return;
		}

		try {
			message.reply(
				this.add(
					message.member.user.tag.split("#")[0],
					keys[0],
					keys[1],
					keys[2],
				)
			);
		} catch(ex) {
			this.L.logger.error(ex);
			message.reply(`Ups! something failed! Ask admin to verbose for security I can't tell you more, sorry!` );
		}

	}

	readArts(message: Message) {
		const keys = this.getKeys(message.content);

		if (keys.length != 2) {
			message.reply("Ouch! Error here. Did you follow the pattern? Don't forget the QUOTES as expected!");
			return;
		}

		const owner = message.member.user.tag.split("#")[0];

		try {
			const data = this.getItemsFromKey(
				keys[0],
				keys[1],
				owner
			);
			const messages = Math.floor(data.length / 1900);
			this.L.logger.debug("Messages length: " + messages )
			for (let i = 0; i <= messages; i++) {
				this.L.logger.debug("Sending length: " + data.substr(1900 * i ,1900).length)
				message.reply(
					data.substr(1900 * i , 1900)
				);

			}
		} catch(ex) {
			this.L.logger.error(ex);
			message.reply(`Ups! something failed! Ask admin to verbose for security I can't tell you more, sorry!` );
		}
	}

	deleteArts(message: Message) {
		const keys = this.getKeys(message.content);

		if (keys.length != 1) {
			message.reply("Ouch! Error here. Did you follow the pattern? Don't forget the QUOTES as expected!");
			return;
		}

		try {
			const token = keys[0];
			const index = this.data.findIndex(i => i.token == token);

			if (index == -1) {
				message.reply(`Ups! Sorry, but the token was not found!`); 
				return;
			}
			const owner = message.member.user.tag.split("#")[0];
			const item = this.data[index];

			if (!this.isAdmin(owner) && item.owner != owner) {
				message.reply(`Ups! You can't do that!`); 
			} else {
				this.data.splice(index, 1);
				fs.writeFileSync(this.REGISTRY_FILE, JSON.stringify(this.data));
				message.reply("Deleted!");
			}
			
		} catch(ex) {
			this.L.logger.error(ex);
			message.reply(`Ups! something failed! Ask admin to verbose for security I can't tell you more, sorry!` );
		}
	}

	reviewArts(message: Message) {
		const keys = this.getKeys(message.content);

		if (keys.length != 1) {
			message.reply("Ouch! Error here. Did you follow the pattern? Don't forget the QUOTES as expected!");
			return;
		}

		try {
			const token = keys[0];
			const index = this.data.findIndex(i => i.token == token);

			if (index == -1) {
				message.reply(`Ups! Sorry, but the token was not found!`); 
				return;
			}
			const owner = message.member.user.tag.split("#")[0];

			if (!this.isAdmin(owner)) {
				message.reply(`Ups! You can't do that!`); 
			} else {
				const item = this.data[index];
				item.reviewed = true;
				this.data[index] = item;
				fs.writeFileSync(this.REGISTRY_FILE, JSON.stringify(this.data));
				message.reply("Reviewed!");
			}
			
		} catch(ex) {
			this.L.logger.error(ex);
			message.reply(`Ups! something failed! Ask admin to verbose for security I can't tell you more, sorry!` );
		}
	}

	private isAdmin(owner: string) : boolean {

		return owner == "ADACIC1033" || owner == "Daniella" || owner == "santomeox";
	}
	private add(owner: string, caption: string, url: string, tags: string) {
		
		try {
			const item = {
				token: uuidv4(), owner, caption, url, tags, date: new Date(), reviewed: false
			};
			this.data.push(item);
			fs.writeFileSync(this.REGISTRY_FILE, JSON.stringify(this.data));

			return `Congrats your art is registered by: ${item.token}`;  
		} catch(ex) {
			this.L.logger.error(ex)
			return `Ups! something failed! Ask admin to verbose for security I can't tell you more, sorry!`;  
		}

	}

	/**
	 * 
	 * @param key A valid field in Item object
	 */
	private getItemsFromKey(key: string, value: string, owner: string) {		
		try {
			
			if (key == 'reviewed' && !this.isAdmin(owner)) {
				return `Ups! You can't do that!`; 
			} else {
				return this.formatItems(this.data.filter(i => {
						const rule =
						(
							key == 'reviewed' && this.isAdmin(owner) && value == 'true' ? i[key] : !i[key]
						) || 
						(
							key != 'reviewed' && i[key].toLowerCase().indexOf(value.toLowerCase()) > -1 && i['reviewed']
						);
						this.L.logger.debug(`atch rule with reviewed as ${i.reviewed} with result: ${rule}`)
						return rule;
					})
				);
			}
			
		} catch(ex) {
			this.L.logger.error(ex)
		}
	}

	private formatItems(items: Item[]) {

		let result = ` \n Arts: \n`;

		if (items.length == 0) {
			result += " 0 items."
		} else {
			items.forEach(i => {
				result += `\t - By ${i.owner}, '**${i.caption}**' [*${i.tags.substr(0, 10)}...*]: \n \t ${i.url} ${i.token} ${i.date}\n`
			});
		}

		return result;
	}

	private getKeys(text: string) {
		try  {
			const re = /'(.*?)'/g;
			const result = [];
			let current;
			while (current = re.exec(text)) {
			  result.push(current.pop());
			}
			return result.length > 0
			  ? result
			  : [text];
		} catch(ex) {
			return []
		}		
	}

}