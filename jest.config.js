module.exports = {
    roots: ['<rootDir>/src'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
        '.+\\.(css)$': 'jest-transform-css'
    },
    collectCoverageFrom: ['src/**/*.{ts,tsx}']
};
