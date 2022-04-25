import { prisma } from '../prisma-singleton'

export const PlayerQueryResolvers = {
  player: (_: any, args: any) => {
    return prisma.player.findFirst({ where: { id: args.id } })
  },
  playerByName: (_: any, args: any) => {
    return prisma.player.findFirst({ where: { name: args.name } })
  }
}

export const PlayerPropertyResolvers = {
  id: (player: any) => player.id,
  name: (player: any) => player.name,
}

export default {
  Query: PlayerQueryResolvers,
  Player: PlayerPropertyResolvers,
}
