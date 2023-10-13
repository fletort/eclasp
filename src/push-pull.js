import { execSync } from 'child_process'
import { getSyncFiles, isAppScriptProjectPath } from './tools.js'
import { comment, unComment } from './comments.js'
import { program } from 'commander'

function getLocalPath() {
  return process
    .cwd()
    .replace(/^[a-zA-Z]:/, '')
    .replaceAll('\\', '/')
}

export function push(options = {}) {
  if (isAppScriptProjectPath() === false) {
    program.error(
      `No valid ${getLocalPath()}/.clasp.json project file. You may need to ${'`'}create${'`'} or ${'`'}clone${'`'} a project first.`
    )
  }

  const filePaths = getSyncFiles()
  comment(filePaths)

  let args = ''
  if (options.force) {
    args = ' -f'
  }

  const output = execSync(`clasp push${args}`)
  console.log(`${output}`)

  unComment(filePaths)
}

export function pull(options = {}) {
  if (isAppScriptProjectPath() === false) {
    program.error(
      `No valid ${getLocalPath()}/.clasp.json project file. You may need to ${'`'}create${'`'} or ${'`'}clone${'`'} a project first.`
    )
  }

  const filePaths = getSyncFiles()

  let args = ''
  if (options.versionNumber) {
    args = ` --versionNumber ${options.versionNumber}`
  }

  const output = execSync(`clasp pull${args}`)
  console.log(`${output}`)
  unComment(filePaths)
}
