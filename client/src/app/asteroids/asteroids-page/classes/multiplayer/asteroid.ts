export default class MultiPlayerAsteroid {
	x: number;
	y: number;
	heading: number;
	velocity: number;
	size: number;
	
	constructor(x: number, y: number, heading: number, velocity: number, size: number) {
		this.x = x;
		this.y = y;
		this.heading = heading;
		this.velocity = velocity
		this.size = size;
	}

	render(game: HTMLCanvasElement, color: string = "#ffffff"): void {
		const canvasContext: CanvasRenderingContext2D = game.getContext("2d");
		canvasContext.fillStyle = color;
		const leftX = this.x - this.size / 2;
		const topY = this.y - this.size / 2;
		canvasContext.fillRect(leftX, topY, this.size, this.size);
	}
}