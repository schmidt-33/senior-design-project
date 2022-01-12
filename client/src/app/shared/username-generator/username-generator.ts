import { adjectives } from "../verbage/adjectives";
import { names } from "../verbage/names";

export default class UsernameGenerator {
	public static generateRandomUsername(): string {
		//? Get words
		let randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
		let randomName = names[Math.floor(Math.random() * names.length)];

		//? Capitalize the character of each word
		randomAdjective = randomAdjective.charAt(0).toUpperCase() + randomAdjective.slice(1);
		randomName = randomName.charAt(0).toUpperCase() + randomName.slice(1);

		return `${randomAdjective}${randomName}`;
	}
}