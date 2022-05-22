import { Player, Prisma } from '@prisma/client'
import { UserInputError } from 'apollo-server'
import { logError, VsCodeConsoleColors } from '../helpers/console-helpers'
import { prisma } from '../prisma-singleton'
import { ScorekeeprContext } from '../scorekeepr-context'
import { IAddPlayerToGameInput, IPlayerUpdateInput, IRemovePlayerFromGameInput } from './player.types'

export const PlayerQueryResolvers = {
  player: (_: any, args: any) => {
    return prisma.player.findFirst({ where: { id: args.id } })
  },
  playerByName: (_: any, args: any) => {
    return prisma.player.findFirst({ where: { name: args.name } })
  }
}

export const PlayerMutationResolvers = {
  createPlayerAndAddToGame: async (_: any, args: IAddPlayerToGameInput, context: ScorekeeprContext) => {
    const game = await prisma.game.findFirst({
      where: { id: args.gameId, creatorId: context.user.id }
    })

    if (game == null) {
      const message = `Game id ${args.gameId} can't be found or doesn't belong to user ${context.user.id}`;
      console.error(`${VsCodeConsoleColors.Red}error: ${message} ${VsCodeConsoleColors.Reset}`)
      throw new UserInputError(message)
    }

    const playerCount = await prisma.player.count({
      where: {
        gameId: game.id
      }
    })

    const newPlayer = await prisma.player.create({
      data: {
        name: args.name,
        gameId: args.gameId,
        score: 0,
        position: playerCount
      }
    })

    return newPlayer
  },
  updatePlayer: async (_: any, args: IPlayerUpdateInput, context: ScorekeeprContext) => {
    const game = await prisma.game.findFirst({
      where: { id: args.gameId, creatorId: context.user.id }
    })

    if (game == null) {
      const message = `Game id ${args.gameId} can't be found or doesn't belong to user ${context.user.id}`
      logError(message)
      throw new UserInputError(message)
    }

    const updatedPlayer = await prisma.player.update({
      data: {
        name: args.newName,
        score: args.newScore
      },
      where: {
        id: args.id,
      }
    })

    if (updatedPlayer == null) {
      const message = `Player id ${args.id} couldn't be found`;
      logError(message)
      throw new UserInputError(message)
    }

    return updatedPlayer
  },
  removePlayerFromGame: async (_: any, args: IRemovePlayerFromGameInput, context: ScorekeeprContext) => {
    const game = await prisma.game.findFirst({
      where: { id: args.gameId, creatorId: context.user.id }
    })

    if (game == null) {
      const message = `Game id ${args.gameId} can't be found or doesn't belong to user ${context.user.id}`;
      logError(message)
      throw new UserInputError(message)
    }

    const deletedPlayer = await prisma.player.delete({
      where: {
        id: args.id
      }
    })

    // update players position
    const players = await prisma.player.findMany({
      where: {
        gameId: args.gameId
      },
      orderBy: {
        position: Prisma.SortOrder.asc
      }
    })

    // n+1, how to do this differently?
    let i = 0
    const updatePromises: Promise<Player>[] = []

    for(let player of players) {
      updatePromises.push(prisma.player.update({
        data: {
          position: i
        },
        where: {
          id: player.id
        }
      }))

      i++
    }

    await Promise.all(updatePromises)

    return deletedPlayer
  }
}

export const PlayerPropertyResolvers = {
  id: (player: Player) => player.id,
  name: (player: Player) => player.name,
  score: (player: Player) => player.score
}

export default {
  Query: PlayerQueryResolvers,
  Player: PlayerPropertyResolvers,
  Mutation: PlayerMutationResolvers
}
