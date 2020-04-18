module.exports = {
    preset: '@shelf/jest-mongodb',
    roots: ['<rootDir>/src'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
}
