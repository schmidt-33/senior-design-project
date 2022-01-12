import AsteroidField from "../single-player/asteroidField";
import MultiPlayerAsteroid from "./asteroid";
import MultiPlayerGame from "./game";
import MultiPlayerRocket from "./rocket";

export default class MultiPlayerAsteroidField {
	asteroidSizes: number[];
	nAsteroids: number;
	asteroids: MultiPlayerAsteroid[];
	asteroidsPerSplit: number;
	minVelocity: number;
	maxVelocity: number;

	constructor(game: HTMLCanvasElement) {
		this.asteroidSizes = [20, 25, 40];
		this.nAsteroids = 10;
		this.asteroids = [];
		this.asteroidsPerSplit = 3;
		this.minVelocity = 5;
		this.maxVelocity = 30;

		for (let i = 0; i < this.nAsteroids; i++) {
			this.asteroids.push(this.createRandomAsteroid(game));
		}
	}

	rocketHitsAsteroid(rocket: MultiPlayerRocket, asteroid: MultiPlayerAsteroid, game: MultiPlayerGame): void {
		if (asteroid.size > this.asteroidSizes[0]) {
			for (let i = 0; i < this.asteroidsPerSplit; i++) {
				const asteroidHeading = Math.random() * 360;
				const asteroidSize = asteroid.size / 2;
				this.asteroids.push(
					new MultiPlayerAsteroid(
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

	private createRandomAsteroid(game: HTMLCanvasElement): MultiPlayerAsteroid {
		const xPos = Math.random() * game.width;
		const yPos = Math.random() * game.height;
		const size = this.asteroidSizes[Math.floor(Math.random() * this.asteroidSizes.length)];
		const velocity = this.minVelocity + (Math.random() * (this.maxVelocity - this.minVelocity));
		const heading = Math.random() * 360;
		return new MultiPlayerAsteroid(xPos, yPos, heading, velocity, size);
	}

	private toJson() {
		const asteroidsArr = [];
		for (let asteroid of this.asteroids) {
			asteroidsArr.push({
				x: asteroid.x,
				y: asteroid.y,
				heading: asteroid.heading,
				velocity: asteroid.velocity,
				size: asteroid.size
			});
		}

		return {
			asteroidSizes: this.asteroidSizes,
			nAsteroids: this.nAsteroids,
			asteroids: asteroidsArr,
			minVelocity: this.minVelocity,
			maxVelocity: this.maxVelocity
		}
	}
}