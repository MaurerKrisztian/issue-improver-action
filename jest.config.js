module.exports = {
    roots: ['<rootDir>/src/test'],
    testMatch: ['**/__tests__/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
    coveragePathIgnorePatterns: ['node_modules', '<rootDir>/src/test'],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
};
