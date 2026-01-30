/**
 * Unit tests for src/greeting.js
 */
import { generateGreeting } from '../src/greeting.js'

describe('greeting.js', () => {
  it('Generates a casual greeting', () => {
    const greeting = generateGreeting('Alice', 'casual')
    expect(greeting).toBe('Hey Alice! Great to see you! 👋')
  })

  it('Generates a formal greeting', () => {
    const greeting = generateGreeting('Bob', 'formal')
    expect(greeting).toBe('Good day, Bob. It is a pleasure to meet you.')
  })

  it('Uses casual as default greeting type', () => {
    const greeting = generateGreeting('Charlie')
    expect(greeting).toBe('Hey Charlie! Great to see you! 👋')
  })

  it('Handles greeting type with different casing', () => {
    const greeting = generateGreeting('David', 'FORMAL')
    expect(greeting).toBe('Good day, David. It is a pleasure to meet you.')
  })

  it('Throws an error for empty name', () => {
    expect(() => generateGreeting('')).toThrow(
      'Name must be a non-empty string'
    )
  })

  it('Throws an error for non-string name', () => {
    expect(() => generateGreeting(123)).toThrow(
      'Name must be a non-empty string'
    )
  })

  it('Throws an error for invalid greeting type', () => {
    expect(() => generateGreeting('Eve', 'invalid')).toThrow(
      "Invalid greeting type: invalid. Must be 'formal' or 'casual'"
    )
  })
})
