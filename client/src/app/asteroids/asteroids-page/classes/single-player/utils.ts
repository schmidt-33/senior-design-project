import Asteroid from "./asteroid";
import Ship from "./ship";

export default class Utils {

	static dxFromAngleAndHypot(angle: number, hypot: number): number {
		return hypot * Math.cos(Utils.toRadians(angle));
	}

	static dYFromAngleAndHypot(angle: number, hypot: number): number {
		return hypot * Math.sin(Utils.toRadians(angle));
	}

	static toRadians(degrees: number): number {
		return degrees * (Math.PI / 180);
	}

	static toDegrees(radians): number {
		return radians * (180 / Math.PI);
	}

	static isCollided(square1: (Ship | Asteroid), square2: (Ship | Asteroid)): boolean {
		return (
			(square1.x + square1.size / 2) >= (square2.x - square2.size / 2) &&
			(square1.x - square1.size / 2) <= (square2.x + square2.size / 2) &&
			(square1.y + square1.size / 2) >= (square2.y - square2.size / 2) &&
			(square1.y - square1.size / 2) <= (square2.y + square2.size / 2)
		)
	}
}