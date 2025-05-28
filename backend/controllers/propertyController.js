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

        if (!title || !description || !location || !price_per_night || !amenities) {
          return res.status(400).json({
            success: false,
            message: "Title, description, location, price, and amenities are required.",
          });
        } 
        
        let parsedAvailability = [];
    if (availability_calendar) {
      try {
        const availabilityData = JSON.parse(availability_calendar.trim());
        if (!Array.isArray(availabilityData)) {
          throw new Error("Availability calendar must be an array");
        }
        parsedAvailability = availabilityData.map((entry) => {
          if (
            !entry.date ||
            typeof entry.is_available !== "boolean" ||
            isNaN(new Date(entry.date).getTime())
          ) {
            throw new Error("Each entry must have a valid date and is_available boolean");
          }

          return {
            date: new Date(entry.date),
            is_available: entry.is_available,
          };
        });

      } catch (err) {
        return res.status(400).json({
          success: false,
          message:  "Invalid availability_calendar format: " + err.message,
        });
      }
    }
        //validate animities
        const validAmenities = await Amenity.find({ _id: { $in: amenities } });
        if (validAmenities.length !== amenities.length) {
          return res.status(400).json({
            success: false,
            message: "One or more amenities are invalid.",
          });
        }

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