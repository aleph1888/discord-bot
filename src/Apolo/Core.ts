import { Timeline } from "./Timeline";


export interface Core {
	topic: "CORE";
	name: string;
	position: number;
	timeline: Timeline;
}
