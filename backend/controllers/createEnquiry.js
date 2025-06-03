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
export const respondToEnquiry = async (req, res) => {
    try{
        const { enquiry_id } = req.params;
        const { action } = req.body; // 'approve' or 'reject'

        const enquiry = await Enquiry.findById(enquiry_id);
        if (!enquiry) {
            return res.status(404).json({ success: false, message: "Enquiry not found." });
        }

        enquiry.status = action === 'approve' ? 'confirmed' : 'cancelled';
        await enquiry.save();

        res.status(200).json({ success: true, message: `Enquiry ${action}d successfully`, enquiry });
    }catch(error) {
        console.error("Error responding to enquiry:", error);
        res.status(500).json({ success: false, message: "Error responding to enquiry", error: error.message });
    }
}