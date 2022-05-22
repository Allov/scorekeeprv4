import { Player } from "../players/player.types";
import { User } from "../users/user.types";

export interface IGameCreateInput {
  name: string,
  playerCount: number,
}

export interface IGameUpdateInput {
  id: string,
  newName: string,
}

export interface IResetGameScoreInput {
  id: string,
}

export interface IReorderedPlayersInput {
  id: string,
  playerIds: string[],
}

export interface Game {
  id: string,
  name: string,
  shareId: string,
  creator: User,
  players?: Player[],
}

export interface CreatedGame {
  id: string,
  shareId: string,
}
