// Inspiration from https://medium.com/@bargord11/write-your-first-node-js-terminal-progress-bar-5bd5edb8a563

export class ProgressBar {
	total: number;
	current: number;
	barLength: number;

	constructor(total: number) {
		this.total = total;
		this.current = 0;
		this.barLength = Math.min(process.stdout.columns - 50, 50);
		this.update(this.current);
	}

	update(current: number) {
		this.current = current;
		const currentProgress = this.current / this.total;
		this.draw(currentProgress);
	}

	private draw(currentProgress: number) {
		const filledBarLength: number = Math.round(currentProgress * this.barLength);
		const emptyBarLength = this.barLength - filledBarLength;
		const filledBar = this.getBar(filledBarLength, '\u2588');
		const emptyBar = this.getBar(emptyBarLength, '\u2591');

		process.stdout.clearLine(0);
		process.stdout.cursorTo(0);
		process.stdout.write(`Progress: ${filledBar}${emptyBar} | ${this.current}/${this.total}`);
		if (this.total === this.current) {
			process.stdout.write('\n');
		}
	}

	private getBar(length: number, char: string) {
		return char.repeat(length);
	}
}