module.exports = {
  preset: 'ts-jest', // ts-jest 사용
  testEnvironment: 'node', // 테스트 환경 'node' 환경을 사용
  verbose: true,
  collectCoverage: true,
  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'json'],
  transform: {
    '^.+\\.(js|jsx)?$': 'babel-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
};
