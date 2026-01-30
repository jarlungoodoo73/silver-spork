import * as core from '@actions/core'
import { wait } from './wait.js'

/**
 * The main function for the action.
 *
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run() {
  try {
    const ms = core.getInput('milliseconds', { required: true })

    // Parse and validate the input
    const parsedMs = parseInt(ms, 10)

    if (isNaN(parsedMs)) {
      throw new Error(
        `Invalid milliseconds value: "${ms}". Must be a valid number.`
      )
    }

    if (parsedMs < 0) {
      throw new Error(`Milliseconds cannot be negative. Received: ${parsedMs}`)
    }

    if (parsedMs > 60000) {
      core.warning(
        `Long wait time: ${parsedMs}ms (${parsedMs / 1000}s). Consider reducing if possible.`
      )
    }

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    core.debug(`Waiting ${parsedMs} milliseconds ...`)

    // Log the current timestamp, wait, then log the new timestamp
    const startTime = new Date()
    core.debug(`Start time: ${startTime.toTimeString()}`)

    await wait(parsedMs)

    const endTime = new Date()
    core.debug(`End time: ${endTime.toTimeString()}`)

    // Set outputs for other workflow steps to use
    core.setOutput('time', endTime.toTimeString())

    // Log success
    core.info(`Successfully waited ${parsedMs}ms`)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
