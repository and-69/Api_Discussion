import mongoose from "mongoose";

const expertoSchema = new mongoose.Schema({
    role: String,
    content: String,
},{versionKey:false});

export default mongoose.model("experto",expertoSchema);