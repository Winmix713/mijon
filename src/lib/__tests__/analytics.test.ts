import { describe, it, expect } from 'vitest';

// Example test for analytics utilities
describe('Analytics Utilities', () => {
  it('should calculate average correctly', () => {
    const values = [1, 2, 3, 4, 5];
    const average = values.reduce((a, b) => a + b, 0) / values.length;
    expect(average).toBe(3);
  });

  it('should identify streaks', () => {
    const sequence = ['H', 'H', 'H', 'D', 'V'];
    const streaks = [];
    let currentStreak = [sequence[0]];

    for (let i = 1; i < sequence.length; i++) {
      if (sequence[i] === currentStreak[0]) {
        currentStreak.push(sequence[i]);
      } else {
        if (currentStreak.length >= 3) {
          streaks.push({
            pattern: currentStreak[0],
            length: currentStreak.length,
          });
        }
        currentStreak = [sequence[i]];
      }
    }

    expect(streaks).toEqual([
      { pattern: 'H', length: 3 },
    ]);
  });

  it('should validate prediction confidence', () => {
    const confidence = 0.85;
    const threshold = 0.60;
    expect(confidence >= threshold).toBe(true);
  });
});
