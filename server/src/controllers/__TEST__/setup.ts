import mongoose from 'mongoose'
import insert from '../../migration/insert'

export default async () => {
    await mongoose.connect(
        // @ts-ignore
        global.__MONGO_URI__,
        {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
        },
        err => {
            if (err) {
                console.error(err)
                process.exit(1)
            }
        }
    )

    await insert({ drop: true })

    return true
}
