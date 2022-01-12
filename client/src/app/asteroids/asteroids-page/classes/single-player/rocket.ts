export default class Rocket {
	x: number;
	y: number;
	heading: number;
	velocity: number;
	size: number;
	age: number;

	constructor(x: number, y: number, heading: number, velocity: number = 600, size: number = 6, age: number = 0) {
		this.x = x;
		this.y = y;
		this.heading = heading;
		this.velocity = velocity;
		this.size = size
		this.age = age;
	}

	render(game: HTMLCanvasElement, color: string = '#ff0000'): void {
		const canvasContext: CanvasRenderingContext2D = game.getContext("2d");
		canvasContext.fillStyle = color;
		canvasContext.fillRect(this.x, this.y, this.size, this.size);
	}
}