import mongoose from 'mongoose'
import { getGameWords } from '../game.controller'
import setup from './setup'
import { Language } from '../../models/word.model'
import { Team } from '../../models/user.model'

describe('game words', () => {
    beforeAll(async () => {
        await setup()
    })

    it('should return 25 words', async () => {
        expect.assertions(4)
        const words = await getGameWords({ language: Language.Adult })

        if (words.starts === Team.red) {
            expect(words.redWords).toHaveLength(9)
            expect(words.blueWords).toHaveLength(8)
        }

        if (words.starts === Team.blue) {
            expect(words.blueWords).toHaveLength(9)
            expect(words.redWords).toHaveLength(8)
        }

        expect(words.deathWord).toHaveLength(1)

        expect([
            ...words.deathWord,
            ...words.redWords,
            ...words.blueWords,
            ...words.restWords,
        ]).toHaveLength(25)
    })
})
