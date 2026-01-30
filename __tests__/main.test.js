/**
 * Unit tests for the action's main functionality, src/main.js
 *
 * To mock dependencies in ESM, you can create fixtures that export mock
 * functions and objects. For example, the core module is mocked in this test,
 * so that the actual '@actions/core' module is not imported.
 */
import { jest } from '@jest/globals'
import * as core from '../__fixtures__/core.js'
import { generateGreeting } from '../__fixtures__/greeting.js'

// Mocks should be declared before the module being tested is imported.
jest.unstable_mockModule('@actions/core', () => core)
jest.unstable_mockModule('../src/greeting.js', () => ({ generateGreeting }))

// The module being tested should be imported dynamically. This ensures that the
// mocks are used in place of any actual dependencies.
const { run } = await import('../src/main.js')

describe('main.js', () => {
  beforeEach(() => {
    // Set the action's inputs as return values from core.getInput().
    core.getInput.mockImplementation((name) => {
      switch (name) {
        case 'name':
          return 'GitHub'
        case 'greeting-type':
          return 'casual'
        default:
          return ''
      }
    })

    // Mock the generateGreeting function
    generateGreeting.mockImplementation(
      () => 'Hey GitHub! Great to see you! 👋'
    )
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Sets the greeting-message output', async () => {
    await run()

    // Verify the greeting-message output was set.
    expect(core.setOutput).toHaveBeenNthCalledWith(
      1,
      'greeting-message',
      'Hey GitHub! Great to see you! 👋'
    )
  })

  it('Logs the greeting message', async () => {
    await run()

    // Verify that the greeting was logged
    expect(core.info).toHaveBeenCalledWith('Hey GitHub! Great to see you! 👋')
  })

  it('Sets a failed status on error', async () => {
    // Clear the generateGreeting mock and throw an error
    generateGreeting.mockClear().mockImplementationOnce(() => {
      throw new Error('Name must be a non-empty string')
    })

    await run()

    // Verify that the action was marked as failed.
    expect(core.setFailed).toHaveBeenNthCalledWith(
      1,
      'Name must be a non-empty string'
    )
  })
})
