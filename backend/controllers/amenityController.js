import Amenity from "../models/amenity.js";

export const createAmenity = async (req, res) => {
    const {name , icon_url } = req.body;

    try {
        if (!name || !icon_url) {
            return res.status(400).json({ success: false, message: 'Please fill all the fields' });
        }

        //check if amenity already exists
        const existingAmenity = await Amenity.findOne({ name });
        if (existingAmenity) {
            return res.status(400).json({ success: false, message: 'Amenity already exists' });
        }

        //create and save amenity
        const amenity = new Amenity({
            name,
            icon_url,
        });

        await amenity.save();

        res.status(201).json({
            success: true,
            message: 'Amenity created successfully',
            amenity: {
                _id: amenity._id,
                name: amenity.name,
                icon_url: amenity.icon_url,
                created_at: amenity.createdAt,
            }
        });

    } catch (error) {
        console.error("Error in creating amenity", error);
        res.status(400).json({ success: false, message: error.message });
    }
}

//Get all amenities
export const getAllAmenities = async (req, res) => {
    try {
        const amenities = await Amenity.find();
        res.status(200).json({
            success: true,
            message: 'Amenities fetched successfully',
            amenities,
        });
    } catch (error) {
        console.error("Error in fetching amenities", error);
        res.status(400).json({ success: false, message: error.message });
    }
}