import { ApoloClient } from "./ApoloClient";
import { State } from "./State";

export class ApoloServer {
	state = new State();	
	client = new ApoloClient(this.state);

	constructor() {
		this.client.connect();

		this.client.subscribe("CORE/TIMELINE/STATE", this.client.defaultState);

		this.client.defaultState$.subscribe(m => {
			console.log("Got state", m.core.timeline.default)
		})

		this.client.subscribe("CORE/TIMELINE/DOT/ADD", this.client.dotAdd);

		this.client.dotAdd$.subscribe(m => {
			console.log("Got new dot", m)
		})
	}

	sendDot(position: number) {
		this.client.send(
			"CORE/TIMELINE/APOLO/DOT/ADD/",
			JSON.stringify({
				dot: new Date(),
				position: position,
				add: true,
			})
		)
	}
}



