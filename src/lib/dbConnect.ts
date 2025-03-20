import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
    if(connection.isConnected) {
        console.log("Already Connected to database");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.NEXT_PUBLIC_MONGODB_URI || "", {});

        connection.isConnected = db.connections[0].readyState
        console.log("DB Connected Successfully");

    } catch (error) {
        console.log("DB connection Failed", error);
        process.exit(1);
    }
}

export default dbConnect;