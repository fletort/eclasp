/**
 * Unit tests for src/push-pull.js
 */

import { expect } from '@jest/globals'
import { push, pull } from '../src/push-pull'
import { getSyncFiles, isAppScriptProjectPath } from '../src/tools'
import { comment, unComment } from '../src/comments'
import { execSync } from 'child_process'
import { program } from 'commander'

const mockSyncFiles = ['file1', 'src/files2']
jest.mock('../src/tools', () => ({
  getSyncFiles: jest.fn(() => mockSyncFiles),
  isAppScriptProjectPath: jest.fn(() => true)
}))

jest.mock('../src/comments', () => ({
  comment: jest.fn(() => {}),
  unComment: jest.fn(() => {})
}))

const mockOutputTest = 'MY TEST OUTPUT'
jest.mock('child_process', () => ({
  execSync: jest.fn(() => mockOutputTest)
}))

const programErrorMock = jest
  .spyOn(program, 'error')
  .mockImplementation(msg => {
    throw new Error(`process.exit: ${msg}`)
  })

const logMock = jest.spyOn(console, 'log').mockImplementation()

describe('push', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('push behavior is correct (get files/comment/push/uncomment)', () => {
    push()

    expect(isAppScriptProjectPath).toHaveBeenCalled()
    expect(getSyncFiles).toHaveBeenCalled()
    expect(comment).toHaveBeenCalledWith(mockSyncFiles)
    expect(execSync).toHaveBeenCalledWith('clasp push')
    expect(unComment).toHaveBeenCalledWith(mockSyncFiles)
    expect(logMock).toHaveBeenCalledWith(mockOutputTest)

    const commentCall = comment.mock.invocationCallOrder[0]
    const execSyncCall = execSync.mock.invocationCallOrder[0]
    const unCommentCall = unComment.mock.invocationCallOrder[0]
    expect(commentCall).toBeLessThan(execSyncCall)
    expect(execSyncCall).toBeLessThan(unCommentCall)
  })
  it('give force option to clasp if requested', () => {
    push({ force: true })
    expect(execSync).toHaveBeenCalledWith('clasp push -f')
  })
  it('exit with error outside a project', () => {
    isAppScriptProjectPath.mockReturnValueOnce(false)

    expect(() => {
      push()
    }).toThrow()
    expect(programErrorMock).toHaveBeenCalled()
  })
})

describe('pull', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('pull behavior is correct (get files/pull/uncomment)', () => {
    pull()

    expect(isAppScriptProjectPath).toHaveBeenCalled()
    expect(getSyncFiles).toHaveBeenCalled()
    expect(execSync).toHaveBeenCalledWith('clasp pull')
    expect(unComment).toHaveBeenCalledWith(mockSyncFiles)
    expect(logMock).toHaveBeenCalledWith(mockOutputTest)

    const execSyncCall = execSync.mock.invocationCallOrder[0]
    const unCommentCall = unComment.mock.invocationCallOrder[0]
    expect(execSyncCall).toBeLessThan(unCommentCall)
  })
  it('give versionNumber option to clasp if requested', () => {
    pull({ versionNumber: 'MyNumber' })
    expect(execSync).toHaveBeenCalledWith('clasp pull --versionNumber MyNumber')
  })
  it('exit with error outside a project', () => {
    isAppScriptProjectPath.mockReturnValueOnce(false)

    expect(() => {
      pull()
    }).toThrow()
    expect(programErrorMock).toHaveBeenCalled()
  })
})

// TODO: test If not project (implementation to add)
