import english from './english'
import adult from './adult'
import german from './german'
import spanish from './spanish'
import french from './french'
import italian from './italian'

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
