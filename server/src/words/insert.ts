const english = require('./english.json')
import Word from '../models/word.model'

async function run() {
    await english.forEach(async (word: string) => {
        await Word.findOneAndUpdate(
            { label: word, language: 'English' },
            { upsert: true }
        ).catch(error => {
            throw error
        })
    })
}
export default run
