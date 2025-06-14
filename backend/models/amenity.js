import mongoose from "mongoose";

const amenitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    icon_url: {
        type: String,
        required: true,
    },
}, { timestamps: true });
const Amenity = mongoose.model("Amenity", amenitySchema);
export default Amenity;