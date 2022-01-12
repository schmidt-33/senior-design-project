import MultiPlayerAsteroid from "./asteroid";
import MultiPlayerAsteroidField from "./asteroidField";
import MultiPlayerRocket from "./rocket";
import MultiPlayerShip from "./ship";
import MultiPlayerUtils from "./utils";

export default class MultiPlayerGame {
	fps: number;
	pressedKeys: object;
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	width: number;
	height: number;
	asteroidField: MultiPlayerAsteroidField;
	ship: MultiPlayerShip
	intervalId: number

	constructor(div: HTMLElement, fps: number = 30) {
		this.fps = fps;
		this.pressedKeys = {};
		this.canvas = document.createElement('canvas');
		this.ctx = this.canvas.getContext("2d");

		div.appendChild(this.canvas);
		this.setSizes();
		window.onresize = this.onResize.bind(this);
	}

	start(): void {
		//TODO send websocket event here to do these things
		this.asteroidField = new MultiPlayerAsteroidField(this.canvas);
		this.ship = new MultiPlayerShip(
			this.width / 2,
			this.height / 2
		)

		this.intervalId = window.setInterval(this.loop.bind(this), 1000 / this.fps);
	}

	stop() {
		clearInterval(this.intervalId);
	}

	keyDown(keyCode: number): void {
		this.pressedKeys[keyCode] = true;
	}

	keyUp(keyCode: number): void {
		delete this.pressedKeys[keyCode];
	}

	private setSizes(): void {
		this.width = window.innerWidth * .70;
		this.height = window.innerHeight *.95;
		this.canvas.width = this.width;
		this.canvas.height = this.height;
	}

	private onResize(): void {
		this.setSizes();
		this.draw();
	}

	private draw(): void {
		this.asteroidField.render(this.canvas);
		this.ship.render(this.canvas);
	}

	private loop(): void {
		this.update();
		this.draw();
	}

	private update(): void {
		this.respondToPressedKeys();
		this.updatePositions();
		this.checkForImpacts();
	}

	private respondToPressedKeys(): void {
		if (this.pressedKeys[38]) {
			this.ship.accelerate();
		}
		if (this.pressedKeys[40]) {
			this.ship.brake();
		}
		if (this.pressedKeys[37]) {
			this.ship.turnLeft();
		}
		if (this.pressedKeys[39]) {
			this.ship.turnRight();
		}
		if (this.pressedKeys[32]) {
			this.ship.fireRocket();
		}
	}

	private updatePositions(): void {
		const dt = 1 / this.fps;

		for (let asteroid of this.asteroidField.asteroids) {
			this.updateObjectPos(asteroid, dt);
		}

		for (let rocket of this.ship.rockets) {
			rocket.age += dt;
			this.updateObjectPos(rocket, dt);
		}
		this.ship.rockets = this.ship.rockets.filter(rocket => rocket.age < this.ship.maxRocketAge);

		this.updateObjectPos(this.ship, dt);
	}

	private updateObjectPos(object: (MultiPlayerShip | MultiPlayerAsteroid | MultiPlayerRocket), dt: number): void {
		object.x += MultiPlayerUtils.dxFromAngleAndHypot(object.heading, dt * object.velocity);
		object.y += MultiPlayerUtils.dYFromAngleAndHypot(object.heading, dt * object.velocity);

		if (object.y > this.height) {
			object.y = 0;
		} else if (object.y < 0) {
			object.y = this.height;
		} else if (object.x > this.width) {
			object.x = 0;
		} else if (object.x < 0) {
			object.x = this.width;
		}
	}

	private checkForImpacts(): void {
		for (let rocket of this.ship.rockets) {
			for (let asteroid of this.asteroidField.asteroids) {
				if (MultiPlayerUtils.isCollided(rocket, asteroid)) {
					this.asteroidField.rocketHitsAsteroid(rocket, asteroid, this);
					if (this.asteroidField.asteroids.length === 0) {
						this.gameWon("Win");
					}
				}
			}
		}

		for (let asteroid of this.asteroidField.asteroids) {
            if (MultiPlayerUtils.isCollided(asteroid, this.ship)) {
                this.gameOver("Your ship was destroyed by an asteroid!");
            }
        }
	}

	private gameWon(message: string): void {
		this.stop();
		setTimeout(
			this.printEndOfGameMessage.bind(this, message, false),
			this.intervalId + 1
		)
	}

	private gameOver(message: string): void {
		this.stop();
		setTimeout(
			this.printEndOfGameMessage.bind(this, message, true), 
			this.intervalId + 1
		);
	}

	private printEndOfGameMessage(message: string, gameLost: boolean): void {
		const ctx = this.canvas.getContext("2d");
		ctx.fillStyle = 'red';
		if (gameLost) {
			ctx.font = '48px serif';
			ctx.textAlign = 'center';
			ctx.fillText("Game Over", this.width / 2, 50);
		}
		ctx.font = '24px serif';
		ctx.textAlign = 'center';
		ctx.fillText(message, this.width / 2, 100);
	}
}