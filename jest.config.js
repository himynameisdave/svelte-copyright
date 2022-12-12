// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  transform: {
    "^.+\\.js$": "babel-jest",
    "^.+\\.svelte$": "svelte-jester"
  },
  testEnvironment: "jsdom",
  moduleFileExtensions: [
    'js',
    'svelte'
  ],
  setupFilesAfterEnv: [
    '@testing-library/jest-dom/extend-expect'
  ]
};
