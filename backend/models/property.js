import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
      },
      location: {
        type: String,
        required: true,
      },
      price_per_night: {
        type: Number,
        required: true,
      },
      amenities: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Amenity",
        }
      ],
      
      photos: {
        type: [String], // Array of URLs
        default: [],
      },
      availability_calendar: {
        type: [
          {
            date: { type: Date },
            isAvailable: { type: Boolean, default: true },
          },
        ],
        default: [],
      },
      requires_enquiry: {
        type: Boolean,
        default: false,
      },
      is_approved: {
        type: Boolean,
        default: false, // initially not approved
      },

},  { timestamps: true });

const Property = mongoose.model("Property", propertySchema);
export default Property;