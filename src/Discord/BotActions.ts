/**
 * This file holds that bot admins can trigger from console towards the server.
 */
import { DiscordClient } from "./DiscordClient";
import { CHANNELS } from "./DiscordServer";

export interface BotAction {
	id: number;
	console: string;
	response: Function
}

/**
 * Use nodejs app console to trigger those actions
 */
export const BOT_ACTIONS = [
	{
		id: 1,
		content: "clean", 		// clean <channel_name> <number_of_messages_to_delete>, sample: clean aula-de-bots 10,  
								//
								// NOTICE: then channel must be created at DiscordServer.ts/CHANNELS collection.
								// WARNING: 2 weeks old messages cannot be deleted by Discord default.
								// WARNING: number_of_messages_to_delete should be between 2 and 100;
		response: (params: string, bot: DiscordClient) => {
			bot.deleteMessagesFromChannel(
				CHANNELS[params.split(" ")[1]], 
				parseInt(params.split(" ")[2])
			)
		} 		
	}
];
