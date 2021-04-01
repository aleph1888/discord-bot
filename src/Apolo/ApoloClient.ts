import { Observable, Subject, Subscriber } from 'rxjs';
import { MqttClient } from "mqtt";
import * as mqtt from 'mqtt';
import { State } from './State';
import { Dot } from './Dot';
var config = require('../../package.json');

export class ApoloClient {

	client: MqttClient;

	subscriptions: {
		topic: string;
		subject: Subject<any>;
	}[] = [];

	defaultState: Subject<State> = new Subject<State>();
	defaultState$ = this.defaultState.asObservable();

	dotAdd: Subject<Dot> = new Subject<Dot>();
	dotAdd$ = this.dotAdd.asObservable();

	constructor(public state: State) {}

	connect() {

		console.log("Connection mqtt, start");

		this.client  = mqtt.connect(config.broker)
		
		this.client.on('connect', () => {
			
			console.log("Connection mqtt, connected")
			
		})
		
		this.client.on('message', (topic: string, message: any) => {
			// message is Buffer
			

			const s = this.subscriptions.find(s => s.topic == topic);

			if (s) {
				// console.log(s.topic,  topic)
				s.subject.next(JSON.parse(message.toString()));
			} else {
				console.log(topic, message.toString(), "Message without subscriber")
			}
		})
		
	}

	subscribe(topic: string, subject: Subject<any>) {
		
		this.subscriptions.push({
			topic,
			subject
		})
		this.client.subscribe(topic, (err: any) => {
			if (!err) {
				//this.client.publish('presence', 'Hello mqtt')
			}
		})
	}

	unsubscribe(topic: string, subject: Subject<any>) {
		
		const s = this.subscriptions.find(s => s.topic == s.topic);
		if (s) s.subject.complete();

		this.client.unsubscribe(topic, (err: any) => {
			if (!err) {
				//this.client.publish('presence', 'Hello mqtt')
			}
		})

	}

	close() {
		this.client.end();
		this.defaultState.complete();
	}

	send(topic: string, message: string) {
		this.client.publish(topic, message);
	}
}