import { PrismaClient } from '@prisma/client'
import { VsCodeConsoleColors } from './helpers/console-helpers'

export const prisma = new PrismaClient({
  log: [{
    emit: 'event',
    level: 'query'
  }]
})

if (process.env.ENABLE_PRISMA_QUERY_LOGS == "true") {
  prisma.$on('query', async (e) => {
    console.log(`${VsCodeConsoleColors.Yellow}QUERY${VsCodeConsoleColors.Reset}:\n${e.query}\n${VsCodeConsoleColors.Yellow}PARAMS${VsCodeConsoleColors.Reset}:\n${e.params}\n`)
  })

}

// https://stackoverflow.com/questions/43528123/visual-studio-code-debug-console-colors
