module.exports = {
    testEnvironment: "./custom-jest-environment.cjs",
    moduleNameMapper: {
      ".(css|less|scss)$": "identity-obj-proxy",
    },
    
  };