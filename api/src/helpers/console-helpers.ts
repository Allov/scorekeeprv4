export const VsCodeConsoleColors = {
  Yellow: '\u001b[1;33m',
  Red: '\u001b[1;31m',
  Reset: '\u001b[0m'
}


export function logError(message: string) {
  console.error(`${VsCodeConsoleColors.Red}error: ${message} ${VsCodeConsoleColors.Reset}`)
}
