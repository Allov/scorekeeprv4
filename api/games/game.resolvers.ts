import { Game } from '@prisma/client'
import { prisma } from '../prisma-singleton'
import { IGameCreateInput } from './game.types'

export const GameQueryResolvers = {
  game: (_: any, args: any) => {
    return prisma.game.findFirst({ where: { id: args.id } })
  },
  gameByShareId: (_: any, args: any) => {
    return prisma.game.findFirst({ where: { shareId: args.shareId } })
  },
  games: () => {
    return prisma.game.findMany()
  }
}

export const GamePropertyResolvers = {
  id: (game: any) => game.id,
  name: (game: any) => game.name,
  shareId: (game: any) => game.shareId,
  creatorId: (game: Game) => game.creatorId
}

export const GameMutationResolvers = {
  createGame: async (_: any, args: any, context: any) => {
    var game: IGameCreateInput = {
      name: args.name,
      creatorId: '62640b01651e810fcff52396',
      shareId: ''
    }

    console.log(context)

    return await prisma.game.create({ data: game })
  }
}

export default {
  Query: GameQueryResolvers,
  Mutation: GameMutationResolvers,
  Game: GamePropertyResolvers,
}
