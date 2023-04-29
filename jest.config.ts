module.exports = {
    roots: ['<rootDir>/test'],
    testMatch: ['**/__tests__/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
    coveragePathIgnorePatterns: ['node_modules', '<rootDir>/test'],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
};
