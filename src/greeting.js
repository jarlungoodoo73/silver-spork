/**
 * Generates a personalized greeting message.
 *
 * @param {string} name The name of the person to greet.
 * @param {string} type The type of greeting (formal or casual).
 * @returns {string} A personalized greeting message.
 */
export function generateGreeting(name, type = 'casual') {
  if (!name || typeof name !== 'string') {
    throw new Error('Name must be a non-empty string')
  }

  const normalizedType = type.toLowerCase().trim()

  if (normalizedType === 'formal') {
    return `Good day, ${name}. It is a pleasure to meet you.`
  } else if (normalizedType === 'casual') {
    return `Hey ${name}! Great to see you! 👋`
  } else {
    throw new Error(
      `Invalid greeting type: ${type}. Must be 'formal' or 'casual'`
    )
  }
}
