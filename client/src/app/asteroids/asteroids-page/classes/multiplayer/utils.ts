import MultiPlayerAsteroid from "./asteroid";
import MultiPlayerShip from "./ship";

export default class MultiPlayerUtils {

	static dxFromAngleAndHypot(angle: number, hypot: number): number {
		return hypot * Math.cos(MultiPlayerUtils.toRadians(angle));
	}

	static dYFromAngleAndHypot(angle: number, hypot: number): number {
		return hypot * Math.sin(MultiPlayerUtils.toRadians(angle));
	}

	static toRadians(degrees: number): number {
		return degrees * (Math.PI / 180);
	}

	static toDegrees(radians): number {
		return radians * (180 / Math.PI);
	}

	static isCollided(square1: (MultiPlayerShip | MultiPlayerAsteroid), square2: (MultiPlayerShip | MultiPlayerAsteroid)): boolean {
		return (
			(square1.x + square1.size / 2) >= (square2.x - square2.size / 2) &&
			(square1.x - square1.size / 2) <= (square2.x + square2.size / 2) &&
			(square1.y + square1.size / 2) >= (square2.y - square2.size / 2) &&
			(square1.y - square1.size / 2) <= (square2.y + square2.size / 2)
		)
	}
}