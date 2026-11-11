import { Promise } from "mongoose";
import app from "./app"
import { connectDatabase } from "./config/database";


const PORT = Number(process.env.PORT);

async function start(): Promise<void> {
    await connectDatabase();
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
    
}

start().catch((erro)  => {
    console.error("Falha ao iniciar: ", erro);
    process.exit(1)
    
});
