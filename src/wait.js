/**
 * Waits for a number of milliseconds.
 *
 * @param {number} milliseconds The number of milliseconds to wait. Must be a non-negative number.
 * @returns {Promise<string>} Resolves with 'done!' after the wait is over.
 * @throws {Error} If milliseconds is not a number or is negative.
 */
export async function wait(milliseconds) {
  return new Promise((resolve, reject) => {
    if (isNaN(milliseconds)) {
      reject(new Error('milliseconds is not a number'))
      return
    }

    if (milliseconds < 0) {
      reject(new Error('milliseconds cannot be negative'))
      return
    }

    setTimeout(() => resolve('done!'), milliseconds)
  })
}
