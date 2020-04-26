import mongoose from 'mongoose'
import { MONO_DB_CONNECTION_STRING } from '../constants'
import Logger from '../logger'

async function connect() {
    try {
        await mongoose
            .connect(MONO_DB_CONNECTION_STRING, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
            .then(() =>
                Logger.info(
                    `🗄️ Successfully connected to database 🗄️ ${MONO_DB_CONNECTION_STRING} 🗄️`
                )
            )
    } catch (error) {
        Logger.error(
            `🔥 An error ocurred when trying to connect to database 🔥. ${
                error.message
            }`
        )
        process.exit(1)
    }
}

export default connect
