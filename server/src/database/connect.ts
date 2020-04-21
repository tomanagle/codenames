import mongoose from 'mongoose'
import { MONO_DB_CONNECTION_STRING } from '../constants'

async function connect() {
    try {
        await mongoose
            .connect(MONO_DB_CONNECTION_STRING, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
            .then(() => console.log(`🗄️ Successfully connected to database 🗄️`))
    } catch (error) {
        console.log(`🔥 An error ocurred when trying to connect to database 🔥`)
        console.error(error)
        process.exit(1)
    }
}

export default connect
