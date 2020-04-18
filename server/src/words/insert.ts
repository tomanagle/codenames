const english = require('./english.json')
const adult = require('./adult.json')
const german = require('./german.json')

const spanish = require('./spanish.json')

const french = require('./french.json')

const italian = require('./italian.json')

import Word, { Language } from '../models/word.model'

async function run({ drop = false }: { drop?: boolean }) {
    if (drop) {
        await Word.remove({}).exec()
    }

    const englishP = english.map(word => {
        return Word.create({ label: word, language: Language.English })
            .then()
            .catch(() => {
                return null
            })
    })

    const adultP = adult.map(word => {
        return Word.create({ label: word, language: Language.Adult }).catch(
            () => {
                return null
            }
        )
    })

    const germanP = german.map(word => {
        return Word.create({ label: word, language: Language.German }).catch(
            () => {
                return null
            }
        )
    })

    const spanishP = spanish.map(word => {
        return Word.create({ label: word, language: Language.Spanish }).catch(
            () => {
                return null
            }
        )
    })
    const frenchP = french.map(word => {
        return Word.create({ label: word, language: Language.French }).catch(
            () => {
                return null
            }
        )
    })

    const italianP = italian.map(word => {
        return Word.create({ label: word, language: Language.Italian }).catch(
            () => {
                return null
            }
        )
    })

    return Promise.all([
        ...englishP,
        ...adultP,
        ...germanP,
        ...spanishP,
        ...frenchP,
        ...italianP,
    ])
}
export default run
