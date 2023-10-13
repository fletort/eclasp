import { expect } from '@jest/globals'
import fs from 'fs'
import { vol } from 'memfs'
import { comment, unComment } from '../src/comments'

jest.mock('fs')

const actualFs = jest.requireActual('fs')
const originalDefaultIgnore = actualFs
  .readFileSync('node_modules/replace/defaultignore')
  .toString()

describe('comment', () => {
  it('comment files in the path', () => {
    const content =
      'I will not be commented\n' +
      '// COMMENT THIS BLOCK IN GASP - START\n' +
      'I will be commented\n' +
      'Me too i will be commented\n' +
      '// COMMENT THIS BLOCK IN GASP - END\n' +
      'I will not be commented\n'
    const commentedContent =
      'I will not be commented\n' +
      '/* COMMENT THIS BLOCK IN GASP - START\n' +
      'I will be commented\n' +
      'Me too i will be commented\n' +
      'COMMENT THIS BLOCK IN GASP - END */\n' +
      'I will not be commented\n'

    vol.fromJSON({
      'myFile1.js': content,
      'myFile2.js': content,
      'myFile3.js': content,
      'node_modules/replace/defaultignore': originalDefaultIgnore
    })

    comment(['myFile1.js', 'myFile2.js'])

    expect(vol.readFileSync('myFile1.js').toString()).toEqual(commentedContent)
    expect(vol.readFileSync('myFile2.js').toString()).toEqual(commentedContent)
    expect(vol.readFileSync('myFile3.js').toString()).toEqual(content)
  })
})

describe('unComment', () => {
  it('unComment files in the path', () => {
    const commentedContent =
      'I am not commented\n' +
      '/* COMMENT THIS BLOCK IN GASP - START\n' +
      'I am commented\n' +
      'I am commented too\n' +
      'COMMENT THIS BLOCK IN GASP - END */\n' +
      'I am not commented\n'
    const unCommentedContent =
      'I am not commented\n' +
      '// COMMENT THIS BLOCK IN GASP - START\n' +
      'I am commented\n' +
      'I am commented too\n' +
      '// COMMENT THIS BLOCK IN GASP - END\n' +
      'I am not commented\n'

    vol.fromJSON({
      'myFile1.js': commentedContent,
      'myFile2.js': commentedContent,
      'myFile3.js': commentedContent,
      'node_modules/replace/defaultignore': originalDefaultIgnore
    })

    unComment(['myFile1.js', 'myFile2.js'])

    expect(vol.readFileSync('myFile1.js').toString()).toEqual(
      unCommentedContent
    )
    expect(vol.readFileSync('myFile2.js').toString()).toEqual(
      unCommentedContent
    )
    expect(vol.readFileSync('myFile3.js').toString()).toEqual(commentedContent)
  })
})
