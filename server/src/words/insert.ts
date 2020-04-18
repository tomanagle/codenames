const english = require('./english.json')
const adult = require('./adult.json')

import Word, { Language } from '../models/word.model'

async function run({ drop = false }: { drop?: boolean }) {
    if (drop) {
        await Word.remove({}).exec()
    }

    const englishP = english.map(word => {
        return Word.create({ label: word, language: Language.English }).catch(
            () => {
                return null
            }
        )
    })

    const adultP = adult.map(word => {
        return Word.create({ label: word, language: Language.Adult }).catch(
            () => {
                return null
            }
        )
    })

    return Promise.all([...englishP, adultP])
}
export default run
