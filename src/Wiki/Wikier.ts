import { Logger } from "../Logger";

var fs = require('fs');

export class Wikier {

	L = new Logger();

	lines: string[] = [];

	constructor() {

		var input = fs.createReadStream(__dirname + '/../../wikier/data.txt');
		this.readLines(input);
		this.L.logger.debug(new Date() + ": Loading wikier!");

	}

	readLines(input: any) {
		var remaining = '';
	  
		input.on('data', (data: any) => {
		  remaining += data;
		  var index = remaining.indexOf('\n');
		  var last  = 0;
		  while (index > -1) {
			var line = remaining.substring(last, index);
			last = index + 1;
			this.lines.push(encodeURI(line.replace(" ", "_")));
			index = remaining.indexOf('\n', last);
		  }	  
		  remaining = remaining.substring(last);
		});
	  
		input.on('end', () =>  {
		  if (remaining.length > 0) {
			this.lines.push(remaining);
		  }
		  this.L.logger.debug(new Date() + ": Loaded wikier!");
		});
	}
}