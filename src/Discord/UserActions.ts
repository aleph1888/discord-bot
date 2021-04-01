import { Message } from "discord.js";
import { ApoloServer } from "../Apolo/ApoloServer";
import { Registry } from "../Registry/Registry";
import { DiscordClient } from "./DiscordClient";

/**
 * This file holds any preconfigured user action. The field "content" should match
 * with the text that user writes in the chat. The "response" is the text that will be
 * returned as a bot response. The field "response" could be also a function.
 */
export interface BasicAction {
	content: string;
	response: string
}

/**
 * Actions to paint in the 3D canvas
 */
export interface UIAction {
	id: number;
	console: string;
	response: any
}

/**
 * Use nodejs app console to trigger those actions
 */
export const UI_ACTIONS = [
	{
		id: 1,
		content: "!discord-bot random",
		response: (message: Message, bot: DiscordClient, registry: Registry) => {
			bot.wikierRandom(message)
		} 		
	},
	{
		id: 2,
		content: "!discord-bot date",
		response: (message: Message, bot: DiscordClient, registry: Registry) => {
			bot.getDate(message)
		} 		
	},
	{
		id: 3,
		content: "!discord-bot reg_help",
		response: (message: Message, bot: DiscordClient, registry: Registry) => {
			message.reply(registry.getHelp())
		} 		
	},
	{
		id: 4,
		content: "!discord-bot add",
		response: (message: Message, bot: DiscordClient, registry: Registry) => {
			registry.addArt(message);
		} 		
	},
	{
		id: 5,
		content: "!discord-bot from",
		response: (message: Message, bot: DiscordClient, registry: Registry) => {
			registry.readArts(message)
		} 		
	},
	{
		id: 6,
		content: "!discord-bot delete",
		response: (message: Message, bot: DiscordClient, registry: Registry) => {
			registry.deleteArts(message)
		} 		
	},
	{
		id: 7,
		content: "!discord-bot review",
		response: (message: Message, bot: DiscordClient, registry: Registry) => {
			registry.reviewArts(message)
		} 		
	}
];
