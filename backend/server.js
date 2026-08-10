import 'dotenv/config'
import app from './src/app.js'

const port = Number(process.env.PORT ?? 3333)

const start = async () => {
    try {
        await app.listen({
            port,
            host: '0.0.0.0'
        })
    } catch (error) {
        app.log.error(error)
        process.exit(1)
    }
}

start()
