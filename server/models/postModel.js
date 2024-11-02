const { Schema, model } = require("mongoose");

const postSchema = new Schema({
    title: { type: String, required: true },
    category: {
        type: String,
        enum: [
            "Agriculture", 
            "Business", 
            "Education", 
            "Entertainment", 
            "Art", 
            "Investment", 
            "Uncategorized", 
            "Weather"
        ],
        required: true,
        message: "{VALUE} is not supported"
    },
    description: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    thumbnail: { type: String, required: true }, // Ensure this matches the data you're passing
}, { timestamps: true });

module.exports = model("Post", postSchema);
