/**
 * Unit tests for the action's main functionality, src/main.js
 *
 * To mock dependencies in ESM, you can create fixtures that export mock
 * functions and objects. For example, the core module is mocked in this test,
 * so that the actual '@actions/core' module is not imported.
 */
import { jest } from '@jest/globals'
import * as core from '../__fixtures__/core.js'
import { wait } from '../__fixtures__/wait.js'

// Mocks should be declared before the module being tested is imported.
jest.unstable_mockModule('@actions/core', () => core)
jest.unstable_mockModule('../src/wait.js', () => ({ wait }))

// The module being tested should be imported dynamically. This ensures that the
// mocks are used in place of any actual dependencies.
const { run } = await import('../src/main.js')

describe('main.js', () => {
  beforeEach(() => {
    // Set the action's inputs as return values from core.getInput().
    core.getInput.mockImplementation(() => '500')

    // Mock the wait function so that it does not actually wait.
    wait.mockImplementation(() => Promise.resolve('done!'))
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Sets the time output', async () => {
    await run()

    // Verify the time output was set.
    expect(core.setOutput).toHaveBeenNthCalledWith(
      1,
      'time',
      // Simple regex to match a time string in the format HH:MM:SS.
      expect.stringMatching(/^\d{2}:\d{2}:\d{2}/)
    )

    // Verify info message was logged
    expect(core.info).toHaveBeenCalledWith('Successfully waited 500ms')
  })

  it('Sets a failed status for invalid input', async () => {
    // Clear the getInput mock and return an invalid value.
    core.getInput.mockClear().mockReturnValueOnce('this is not a number')

    await run()

    // Verify that the action was marked as failed.
    expect(core.setFailed).toHaveBeenCalledWith(
      'Invalid milliseconds value: "this is not a number". Must be a valid number.'
    )
  })

  it('Sets a failed status for negative input', async () => {
    // Set a negative number input
    core.getInput.mockClear().mockReturnValueOnce('-100')

    await run()

    // Verify that the action was marked as failed.
    expect(core.setFailed).toHaveBeenCalledWith(
      'Milliseconds cannot be negative. Received: -100'
    )
  })

  it('Shows warning for large wait times', async () => {
    // Set a large wait time
    core.getInput.mockClear().mockReturnValueOnce('65000')

    await run()

    // Verify warning was shown
    expect(core.warning).toHaveBeenCalledWith(
      'Long wait time: 65000ms (65s). Consider reducing if possible.'
    )

    // Verify it still succeeded
    expect(core.setOutput).toHaveBeenCalled()
  })

  it('Handles wait function errors', async () => {
    // Mock wait to reject
    wait
      .mockClear()
      .mockRejectedValueOnce(new Error('milliseconds is not a number'))

    await run()

    // Verify that the action was marked as failed.
    expect(core.setFailed).toHaveBeenCalledWith('milliseconds is not a number')
  })

  it('Handles zero milliseconds', async () => {
    core.getInput.mockClear().mockReturnValueOnce('0')

    await run()

    // Verify it succeeded
    expect(core.setOutput).toHaveBeenCalled()
    expect(core.info).toHaveBeenCalledWith('Successfully waited 0ms')
  })
})
