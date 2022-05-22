import { Game, Prisma } from '@prisma/client'
import { UserInputError } from 'apollo-server'
import shortUUID from 'short-uuid'
import { Player } from '../players/player.types'
import { prisma } from '../prisma-singleton'
import { ScorekeeprContext } from '../scorekeepr-context'
import { CreatedGame, IGameCreateInput, IGameUpdateInput, IReorderedPlayersInput, IResetGameScoreInput } from './game.types'

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
      },
      orderBy: {
        position: Prisma.SortOrder.asc,
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
          gameId: newGame.id,
          position: i
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
  },
  resetGameScore: async (_: any, args: IResetGameScoreInput, context: ScorekeeprContext) => {
    const game = await prisma.game.findFirst({
      where: { id: args.id, creatorId: context.user.id }
    })

    if (game == null) {
      const message = `Game id ${args.id} can't be found or doesn't belong to user ${context.user.id}`;
      console.error(`\u001b[1;31merror: ${message} \u001b[0m`)
      throw new UserInputError(message)
    }

    const players = await prisma.player.findMany({
      where: {
        gameId: game.id
      }
    })

    await prisma.player.updateMany({
      data: {
        score: 0
      },
      where: {
        id: { in: players.map((player) => player.id) }
      }
    })

    return game;
  },
  reorderPlayers: async (_: any, args: IReorderedPlayersInput, context: ScorekeeprContext) => {
    const game = await prisma.game.findFirst({
      where: { id: args.id, creatorId: context.user.id }
    })

    if (game == null) {
      const message = `Game id ${args.id} can't be found or doesn't belong to user ${context.user.id}`;
      console.error(`\u001b[1;31merror: ${message} \u001b[0m`)
      throw new UserInputError(message)
    }

    let i = 0
    const updatePromises: Promise<Player>[] = []
    for(let id of args.playerIds) {
      updatePromises.push(prisma.player.update({
        data: {
          position: i,
        },
        where: {
          id
        }
      }))

      i++
    }

    await Promise.all(updatePromises)
  },
}

export default {
  Query: GameQueryResolvers,
  Mutation: GameMutationResolvers,
  Game: GamePropertyResolvers,
}
