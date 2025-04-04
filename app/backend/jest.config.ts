export default {
    clearMocks: true,
    preset: 'ts-jest',
    transform: {
      "^.+\\.tsx?$": "babel-jest"
    },
    testEnvironment: "node",
    moduleFileExtensions: ["ts", "tsx", "js"],
    setupFilesAfterEnv: ['./src/singleton.ts'],
    testPathIgnorePatterns: ['/node_modules/', '/dist/']
  };