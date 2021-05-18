import chalk from "chalk";
import mongoose, { model, Schema } from "mongoose";
import { getSecret } from "./secretManager";

const PROD = process.env.NODE_ENV == "production";

export async function connect() {
    const uri: string = (
        PROD
            ? await getSecret(
                  "projects/1002758976981/secrets/MONGODB/versions/latest"
              )
            : process.env.MONGODB
    ) as string;

    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        });
        console.log(
            chalk`{bold Connected to mongodb: {yellow ${mongoose.connection.name}}}`
        );
    } catch (err) {
        console.error(chalk.bold.red`Failed to connect to mongodb`, err);
        process.exit(1);
    }
}

export type url = {
    _id: string;
    url: string;
    dest: string;
    clicks: number;
    timestamp: Date;
    userID: string;
} & mongoose.Document;
const urlSchema = new Schema({
    _id: String,
    url: String,
    dest: String,
    clicks: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now },
    userID: String,
});
export const Url = mongoose.models.url || model("url", urlSchema);
