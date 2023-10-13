/**
 * Unit tests for src/tools.js
 */

import { expect } from '@jest/globals'
import fs from 'fs-extra'
import { vol } from 'memfs'
import { getSyncFiles, isAppScriptProjectPath } from '../src/tools'

// file system mocking
jest.mock('fs')

function getLocalPath() {
  return process
    .cwd()
    .replace(/^[a-zA-Z]:/, '')
    .replaceAll('\\', '/')
}

describe('getSyncFiles', () => {
  beforeAll(() => {
    vol.reset()
    vol.fromJSON(
      {
        'src/to_add.js': 'added',
        'src/file.js': 'added',
        'src/index.js': 'not_added',
        'toto.file': 'not_added',
        'appsscript.json': 'added',
        'ut/test.js': 'added'
      },
      getLocalPath()
    )
  })

  it('return all files when ignore file is not define', () => {
    const ret = getSyncFiles()
    expect(ret.sort()).toEqual(
      [
        'src/to_add.js',
        'src/file.js',
        'src/index.js',
        'toto.file',
        'appsscript.json',
        'ut/test.js'
      ].sort()
    )
  })

  it('return selected files when ignore file is define', () => {
    const claspignore =
      '**/**\n' +
      '!src/**\n' +
      'src/index.js\n' +
      '!ut/**\n' +
      '!appsscript.json'

    vol.fromJSON(
      {
        '.claspignore': claspignore
      },
      getLocalPath()
    )

    const ret = getSyncFiles()
    expect(ret.sort()).toEqual(
      ['src/to_add.js', 'src/file.js', 'appsscript.json', 'ut/test.js'].sort()
    )
  })
})

describe('isAppScriptProjectPath', () => {
  beforeEach(() => {
    vol.reset()
  })

  it('return false when path does not contains an appscript project', () => {
    expect(isAppScriptProjectPath('/')).toBeFalsy()
  })
  it('return false when path contains a malformatted appscript project', () => {
    vol.fromJSON({ './.clasp.json': '' }, '/')
    expect(isAppScriptProjectPath('/')).toBe(false)
  })
  it('return true when path contains an appscript project', () => {
    vol.fromJSON({ './.clasp.json': '{"scriptId": "xxxx"}' }, '/')
    expect(isAppScriptProjectPath('/')).toBe(true)
  })
})
