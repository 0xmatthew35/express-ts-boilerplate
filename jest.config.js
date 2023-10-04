module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['./'],
    transform: {
        '^.+\\.ts?$': ['ts-jest', {
            babel: true,
            tsConfig: 'tsconfig.json',
        }]
    },
    testMatch: ['**/*.test.ts'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    collectCoverage: true,
    collectCoverageFrom: ['**/test/**/*.test.ts'],
};
