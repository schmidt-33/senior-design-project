import IPlayer from "./player";
import IQuestion from "./question";

export default interface IGameState {
	numPlayers: number,
	players: IPlayer[],
	questions: IQuestion[]
}