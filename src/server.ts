import App from "./app";
import 'dotenv/config'

const port = Number(process.env.API_GATEWAY_PORT) || 5050

const app = new App()

app.startServer(port)