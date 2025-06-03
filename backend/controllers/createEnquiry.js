import Enquiry from "../models/enquiry.js";
import Property from "../models/property.js";

const createEnquiry = async (req, res) => {
    try {
        const { property_id, check_in_date, check_out_date, message } = req.body;
        const user_id = req.user._id; // assuming user is authenticated via middleware
        
        const property = await Property.findById(property_id);
        if (!property) {
            return res.status(404).json({ success: false, message: "Property not found." });
        }

        const enquiry = new Enquiry({
            user_id,
            property_id,
            check_in_date: new Date(check_in_date),
            check_out_date: new Date(check_out_date),
            message,
            status: "pending"
        });
        await enquiry.save();
        res.status(201).json({ success: true, message: "Enquiry created successfully", enquiry });
    } catch (error) {
        console.error("Error creating enquiry:", error);
        res.status(500).json({ success: false, message: "Error creating enquiry", error: error.message });
        
    }
}


//respond to the enquiry