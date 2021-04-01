import { Dot } from "./Dot";


export interface Timeline {
	topic: "TIMELINE";
	default: Dot[];
	primary: Dot[];
}
