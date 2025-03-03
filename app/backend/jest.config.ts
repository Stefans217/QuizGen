export default {
    clearMocks: true,
    preset: 'ts-jest',
    transform: {
      "^.+\\.tsx?$": "babel-jest"
    },
    testEnvironment: "node",
    moduleFileExtensions: ["ts", "tsx", "js"],
    setupFilesAfterEnv: ['<rootDir>/src/singleton.ts'],
  };