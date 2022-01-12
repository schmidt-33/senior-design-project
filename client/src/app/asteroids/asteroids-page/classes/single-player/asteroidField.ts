import Asteroid from "./asteroid";
import Game from "./game";
import Rocket from "./rocket";

export default class AsteroidField {
	asteroidSizes: number[];
	nAsteroids: number;
	asteroids: Asteroid[];
	asteroidsPerSplit: number;
	minVelocity: number;
	maxVelocity: number;

	constructor(game: HTMLCanvasElement) {
		this.asteroidSizes = [20, 25, 40];
		this.nAsteroids = 15;
		this.asteroids = [];
		this.asteroidsPerSplit = 5;
		this.minVelocity = 10;
		this.maxVelocity = 50;

		for (let i = 0; i < this.nAsteroids; i++) {
			this.asteroids.push(this.createRandomAsteroid(game));
		}
	}

	rocketHitsAsteroid(rocket: Rocket, asteroid: Asteroid, game: Game): void {
		if (asteroid.size > this.asteroidSizes[0]) {
			for (let i = 0; i < this.asteroidsPerSplit; i++) {
				const asteroidHeading = Math.random() * 360;
				const asteroidSize = asteroid.size / 2;
				this.asteroids.push(
					new Asteroid(
						asteroid.x,
						asteroid.y,
						asteroidHeading,
						asteroid.velocity,
						asteroidSize
					)
				);
			}
		}
		asteroid.size = 0;
		rocket.age = game.ship.maxRocketAge;
		this.asteroids = this.asteroids.filter(asteroid => asteroid.size > 0);
	}

	render(game: HTMLCanvasElement, color: string = "#000000"): void {
		const canvasContext: CanvasRenderingContext2D = game.getContext("2d");
		canvasContext.fillStyle = color;
		const x = 0;
		const y = 0;
		canvasContext.fillRect(x, y, game.width, game.height);

		for (let asteroid of this.asteroids) {
			asteroid.render(game);
		}
	}

	private createRandomAsteroid(game: HTMLCanvasElement): Asteroid {
		const xPos = Math.random() * game.width;
		const yPos = Math.random() * game.height;
		const size = this.asteroidSizes[Math.floor(Math.random() * this.asteroidSizes.length)];
		const velocity = this.minVelocity + (Math.random() * (this.maxVelocity - this.minVelocity));
		const heading = Math.random() * 360;
		return new Asteroid(xPos, yPos, heading, velocity, size);
	}
}