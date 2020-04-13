import mongoose from 'mongoose'

async function connect({ db }: { db: string }) {
    try {
        await mongoose
            .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => console.log(`🗄️ Successfully connected to ${db} 🗄️`))
    } catch (error) {
        console.log(`🔥 An error ocurred when trying to connect with ${db} 🔥`)
        throw error
    }
}

export default connect
