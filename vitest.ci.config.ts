import { defineConfig } from 'vitest/config';

// @ts-expect-error just a simple configuration
import coverageExclusions from './coverageExclusions.mjs';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts', 'tests/**/*.integ.ts'],
    reporters: [
      [
        'vitest-sonar-reporter',
        {
          outputFile: 'coverage/test-report.xml',
        },
      ],
    ],
    coverage: {
      enabled: true,
      reporter: ['text', 'lcov'],
      exclude: coverageExclusions,
      include: ['src/**/*.ts'],
    },
  },
});
