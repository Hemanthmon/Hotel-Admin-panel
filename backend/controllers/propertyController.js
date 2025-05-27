import Property from "../models/property.js";
import Amenity from "../models/amenity.js";
import validator from "validator";


// Create a new property
export const createProperty = async (req, res) => {
    try{
       
        const{
            title,
            description,
            location,
            price_per_night,
            amenities,
            availability_calendar,
        } = req.body;

        let parsedAvailability = [];
    if (availability_calendar) {
      try {
        parsedAvailability = JSON.parse(availability_calendar.trim());
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: "Invalid JSON format for availability_calendar",
        });
      }
    }

        const validAmenities = await Amenity.find({ _id: { $in: amenities } });

        const photos = req.files.map(file => file.path);

        const property = new Property({
            title,
            description,
            location,
            price_per_night,
            amenities: validAmenities.map(a => a._id),
            photos,
            availability_calendar: parsedAvailability,
        })
        await property.save();

        res.status(201).json({
            success: true,
            message: "Property created successfully",
            property,
          });
    }catch(error){
        console.error("Error in creating property", error);
        res.status(400).json({ success: false, message: error.message });
      
    }
}