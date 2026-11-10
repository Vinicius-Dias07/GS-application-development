import mongoose from "mongoose";


export async function connectDatabase(): Promise<void> {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        throw new Error("MONGO_URI nao definida no .env");
    }
    await mongoose.connect(uri);
    console.log("MongoDB conectado");
}