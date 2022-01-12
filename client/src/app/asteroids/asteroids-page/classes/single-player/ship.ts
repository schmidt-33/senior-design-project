import Rocket from "./rocket";
import Utils from "./utils";

interface TipPosition {
	x: number,
	y: number
}

export default class Ship {
	x: number;
	y: number;
	heading: number;
	velocity: number;
	size: number;
	rockets: Rocket[];
	maxRockets: number;
	maxRocketAge: number;
	maxVelocity: number;
	minVelocity: number

	constructor(
		x: number,
		y: number,
		heading: number = 0,
		velocity: number = 0,
		size: number = 20,
		maxRockets: number = 15,
		maxRocketAge: number = 2,
		maxVelocity: number = 300,
		minVelocity: number = -300
	) {
		this.x = x;
		this.y = y;
		this.heading = heading;
		this.velocity = velocity;
		this.size = size;
		this.rockets = [];
		this.maxRockets = maxRockets;
		this.maxRocketAge = maxRocketAge;
		this.maxVelocity = maxVelocity;
		this.minVelocity = minVelocity;
	}

	fireRocket(): void {
		const youngestRocketAge: number = this.rockets.length > 0
			? this.rockets[this.rockets.length - 1].age
			: Infinity

		if (this.rockets.length < this.maxRockets && youngestRocketAge > 0.1) {
			this.rockets.push(new Rocket(
				this.getTipPos().x,
				this.getTipPos().y,
				this.heading
			));
		}
	}

	accelerate(): void {
		if (this.velocity < this.maxVelocity) {
			this.velocity += 20
		}
	}

	brake(): void {
		if (this.velocity > this.minVelocity) {
			this.velocity -= 20
		}
	}

	turnLeft(): void {
		this.heading <= 0
			? this.heading = 359
			: this.heading -= 7
	}

	turnRight(): void {
		this.heading >= 360
			? this.heading = 1
			: this.heading += 7
	}

	render(game: HTMLCanvasElement): void {
		this.renderShip(game);
		this.renderRockets(game);
	}

	private renderShip(game: HTMLCanvasElement, color: string = "#77ffff"): void {
		const canvasContext: CanvasRenderingContext2D = game.getContext("2d");
		
		const x = this.getTipPos().x;
		const y = this.getTipPos().y;

		canvasContext.beginPath();
		const opposite = this.heading <= 180
			? this.heading + 180
			: this.heading - 180
		
		const startAngle = Utils.toRadians(opposite - 22.5);
		const endAngle = Utils.toRadians(opposite + 22.5);
		canvasContext.font = "20px Calibri red";
		canvasContext.fillStyle = "#ff0000"; 
		canvasContext.fillText("test", x, y + this.size * 2);
		canvasContext.arc(x, y, this.size, startAngle, endAngle);
		canvasContext.lineTo(x, y);
		canvasContext.closePath();
		canvasContext.lineWidth = 2;
		canvasContext.strokeStyle = color;
		canvasContext.stroke();
	}

	private getTipPos(): TipPosition {
		return {
			x: this.x + Utils.dxFromAngleAndHypot(this.heading, this.size / 2),
			y: this.y + Utils.dYFromAngleAndHypot(this.heading, this.size / 2)
		};
	}

	private renderRockets(game: HTMLCanvasElement): void {
		for (let rocket of this.rockets) {
			rocket.render(game);
		}
	}
}