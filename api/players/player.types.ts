export interface Player {
  id: string,
  name: string
}

export interface IAddPlayerToGameInput {
  name: string,
  gameId: string
}

export interface IPlayerUpdateInput {
  id: string,
  newName: string,
  newScore: number,
  gameId: string
}

export interface IRemovePlayerFromGameInput {
  id: string,
  gameId: string
}
