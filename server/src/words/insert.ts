const english = require('./english.json')
import Word, { Language } from '../models/word.model'

async function run() {
    console.log('Inserting words')
    await english.forEach(async (word: string) => {
        console.log('inserting word', word)
        await Word.create({ label: word, language: Language.English })
            .then(data => {
                console.log({ data })
            })
            .catch(error => {
                console.error('error', error)
                throw error
            })
    })
}
export default run
