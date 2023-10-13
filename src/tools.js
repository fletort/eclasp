import fs from 'fs-extra'
import { globbySync } from 'globby'
import path from 'path'

export function getSyncFiles() {
  let patterns = '**/**'

  if (fs.existsSync('./.claspignore')) {
    const ignores = fs
      .readFileSync('./.claspignore')
      .toString()
      .replace(/\r/g, '')
      .split('\n')
      .filter(value => value !== '')
    patterns = ignores.map(value => {
      if (value[0] === '!') {
        return value.slice(1)
      } else {
        return `!${value}`
      }
    })
  }
  const filePaths = globbySync(patterns)
  return filePaths
}

export function isAppScriptProjectPath(projectPath = './') {
  try {
    const claspFile = fs.readFileSync(path.join(projectPath, '.clasp.json'))
    const claspJson = JSON.parse(claspFile)
    return 'scriptId' in claspJson
  } catch (error) {
    return false
  }
}
