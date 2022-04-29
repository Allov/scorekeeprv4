import { Game } from '@prisma/client'
import { UserInputError } from 'apollo-server'
import shortUUID from 'short-uuid'
import { prisma } from '../prisma-singleton'
import { ScorekeeprContext } from '../scorekeepr-context'
import { CreatedGame, IGameCreateInput, IGameUpdateInput } from './game.types'

export const GameQueryResolvers = {
  game: (_: Game, args: any) => {
    return prisma.game.findFirst({ where: { id: args.id } })
  },
  gameByShareId: (_: Game, args: any) => {
    return prisma.game.findFirst({ where: { shareId: args.shareId } })
  },
  games: () => {
    return prisma.game.findMany()
  },
  myGames: (_: any, __: any, context: ScorekeeprContext) => {
    return prisma.game.findMany({
      where: { creatorId: context.user.id }
    })
  }
}

export const GamePropertyResolvers = {
  id: (game: Game) => game.id,
  name: (game: Game) => game.name,
  shareId: (game: Game) => game.shareId,
  creatorId: (game: Game) => game.creatorId,
  players: (game: Game) => {
    return prisma.player.findMany({
      where: {
        gameId: game.id,
      }
    })
  }
}

export const GameMutationResolvers = {
  createGame: async (_: any, args: IGameCreateInput, context: ScorekeeprContext): Promise<CreatedGame> => {
    const newGame = await prisma.game.create({
      data: {
        name: args.name,
        shareId: shortUUID.generate(),
        creatorId: context.user.id,
      }
    })

    if (args.playerCount > 0) {
      const players = new Array(args.playerCount);
      for (let i = 0; i < args.playerCount; i++) {
        players[i] = {
          name: `Player ${i + 1}`,
          gameId: newGame.id
        }
      }

      const newPlayers = await prisma.player.createMany({
        data: players
      })
    }

    return {
      id: newGame.id,
      shareId: newGame.shareId
    }
  },
  updateGame: async (_: any, args: IGameUpdateInput, context: ScorekeeprContext) => {
    const game = await prisma.game.findFirst({
      where: { id: args.id, creatorId: context.user.id }
    })

    if (game == null) {
      const message = `Game id ${args.id} can't be found or doesn't belong to user ${context.user.id}`;
      console.error(`\u001b[1;31merror: ${message} \u001b[0m`)
      throw new UserInputError(message)
    }

    return await prisma.game.update({
      data: {
        name: args.newName
      },
      where: {
        id: args.id
      }
    })
  }
}

export default {
  Query: GameQueryResolvers,
  Mutation: GameMutationResolvers,
  Game: GamePropertyResolvers,
}
