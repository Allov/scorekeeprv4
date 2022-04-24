import { PlayerPropertyResolvers, PlayerQueryResolvers } from './players/player.resolvers'

export const resolvers = {
  Query: PlayerQueryResolvers,
  Player: PlayerPropertyResolvers
};
