/** @type {import('jest').Config} */
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@shared/(.*)$': '<rootDir>/shared/$1',
    '^@tasks/domain/(.*)$': '<rootDir>/modules/tasks/domain/$1',
    '^@tasks/application/(.*)$': '<rootDir>/modules/tasks/application/$1',
    '^@tasks/infrastructure/(.*)$': '<rootDir>/modules/tasks/infrastructure/$1',
    '^@tasks/presentation/(.*)$': '<rootDir>/modules/tasks/presentation/$1',
    '^@tasks/test/(.*)$': '<rootDir>/modules/tasks/test/$1',
  },
};
