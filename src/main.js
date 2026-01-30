import * as core from '@actions/core'
import { generateGreeting } from './greeting.js'

/**
 * The main function for the action.
 *
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run() {
  try {
    const name = core.getInput('name')
    const greetingType = core.getInput('greeting-type')

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    core.debug(`Generating greeting for: ${name}`)
    core.debug(`Greeting type: ${greetingType}`)

    // Generate the personalized greeting
    const greetingMessage = generateGreeting(name, greetingType)

    // Log the greeting message
    core.info(greetingMessage)

    // Set outputs for other workflow steps to use
    core.setOutput('greeting-message', greetingMessage)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
