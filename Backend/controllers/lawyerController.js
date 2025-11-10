import lawyerModel from "../models/lawyerModel.js";
import appointmentModel from "../models/appointmentModel.js";
import { loginPostRequestBodySchema, updatePatchRequestBodySchemaForLawyer } from "../validations/reqValidation.js";
import { verifyPassword } from "../utils/hash.js";
import { createToken } from "../utils/token.js";


export const changeAvailability = async (req, res) => {
    try{
        const {lawyerId} = req.body;

        if(!lawyerId){
            return res.status(400).json({ success: false, message: "Lawyer ID is required" })
        }

        const lawyer = await lawyerModel.findById(lawyerId);

        if(!lawyer){
            return res.status(404).json({ success: false, message: "Lawyer not found" })
        }

        lawyer.available = !lawyer.available;

        await lawyer.save();

        res.status(200).json({ success: true, message: `Lawyer is now ${lawyer.available ? 'available' : 'unavailable'}` })
    }catch(error){
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}


// api to get lawyer list for frontend

export const getLawyerList = async (req, res) => {
    try{
        const lawyers = await lawyerModel.find({}).select("-password");
        res.status(200).json({ success: true, lawyers })
    }catch(error){
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}


// api to login lawyer
export const lawyerLogin = async (req, res) => {
    try {
        const validationResult = loginPostRequestBodySchema.safeParse(req.body);
    
        if (validationResult.error) {
          return res.status(400).json({
            error: validationResult.error.format(),
            success: false,
          });
        }
    
        const { email, password } = validationResult.data;
    
        // check if lawyer exists
        const lawyer = await lawyerModel.findOne({ email });
            
        if (!lawyer) {
          return res
            .status(404)
            .json({ success: false, message: "Lawyer not found" });
        }

        // check if password matches
        const isPasswordValid = await verifyPassword(password, lawyer.password);
            
        if (!isPasswordValid) {
          return res
            .status(401)
            .json({ success: false, message: "Invalid password" });
        }

        // create token
        const ltoken = await createToken({ id: (lawyer._id).toString() });
        res.status(200).json({ success: true, token: ltoken, message: "Lawyer logged in successfully" });

      } catch (error) {
        console.error("Error during lawyer login:", error);
        res.status(500).json({
          success: false,
          message: "Internal server error",
        });
      }

}


// api to get lawyer appointments
export const getLawyerAppointments = async (req, res) => {
    try{
        const {lawyerId} = req.body;

        if(!lawyerId){
            return res.status(400).json({ success: false, message: "Lawyer ID is required" })
        }

        const appointments = await appointmentModel.find({lawyerId});

        res.status(200).json({ success: true, appointments });
        
    }catch(error){
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// api to cancel appointment by lawyer
export const cancelAppointmentByLawyer = async (req, res) => {
    try {
        const { appointmentId } = req.body;
    
        if (!appointmentId) {
          return res
            .status(400)
            .json({ success: false, message: "Appointment ID is required" });
        }
    
        const appointment = await appointmentModel.findById(appointmentId);
    
        // check if appointment exists
        if (!appointment) {
          return res
            .status(404)
            .json({ success: false, message: "Appointment not found" });
        }
    
        // check if appointment is already cancelled
        if (appointment.cancelled === "Cancelled by User") {
          return res
            .status(400)
            .json({
              success: false,
              message: "Appointment is already cancelled by User",
            });
        }
    
        const updatedAppointment = await appointmentModel.findByIdAndUpdate(
          appointmentId,
          {
            cancelled: "Cancelled by Lawyer",
          },
          { new: true }
        );
    
        res
          .status(200)
          .json({
            success: true,
            message: "Appointment cancelled successfully by Lawyer",
            appointment: updatedAppointment,
          });
      } catch (error) {
        console.error("Error cancelling appointment:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
      }
}


// apit to mark appointment as completed by lawyer
export const appointmentCompletedByLawyer = async (req, res) => {
    try{
        const {lawyerId, appointmentId} = req.body;

        if(!lawyerId || !appointmentId){
            return res.status(400).json({ success: false, message: "Lawyer ID and Appointment ID are required" })
        }

        const appointmentData = await appointmentModel.findOne(appointmentId);

        if (appointmentData && appointmentData.lawyerId === lawyerId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
            return res.status(200).json({ success: true, message: 'Appointment Completed' })
        }

        res.status(400).json({ success: false, message: 'Appointment Cancelled' })
        
    }catch(error){
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}


// api to get lawyer profile
export const getLawyerProfile = async (req, res) => {
    try{
        const {lawyerId} = req.body;

        if(!lawyerId){
            return res.status(400).json({ success: false, message: "Lawyer ID is required" })
        }

        const lawyer = await lawyerModel.findById(lawyerId).select("-password");

        if(!lawyer){
            return res.status(404).json({ success: false, message: "Lawyer not found" })
        }

        res.status(200).json({ success: true, lawyer });
        
    }catch(error){
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}



// api to update lawyer profile
export const updateLawyerProfile = async (req, res) => {
    try {
        // Parse address if it's a string
        if (req.body.address && typeof req.body.address === 'string') {
            try {
                req.body.address = JSON.parse(req.body.address);
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid address format. Address must be a valid JSON object"
                });
            }
        }

        // Parse available if it's a string
        if (req.body.available && typeof req.body.available === 'string') {
            req.body.available = req.body.available === 'true';
        }

        // Parse fees if it's a string
        if (req.body.fees && typeof req.body.fees === 'string') {
            const feesNumber = Number(req.body.fees);
            if (isNaN(feesNumber)) {
                return res.status(400).json({
                    success: false,
                    message: "Fees must be a valid number"
                });
            }
            req.body.fees = feesNumber;
        }

        const validationResult = await updatePatchRequestBodySchemaForLawyer.safeParseAsync(req.body);
    
        if (!validationResult.success) {
            return res.status(400).json({
                error: validationResult.error.format(),
                success: false
            });
        }
    
        const { lawyerId, fees, address, available, about } = validationResult.data;

        if (!lawyerId) {
            return res.status(400).json({ 
                success: false, 
                message: "Lawyer ID is required" 
            });
        }

        // Build updates object with only allowed fields
        const updates = {};
        if (fees !== undefined) updates.fees = fees;
        if (address !== undefined) updates.address = address;
        if (available !== undefined) updates.available = available;
        if (about !== undefined) updates.about = about;

        // Update lawyer profile
        const updatedLawyer = await lawyerModel.findByIdAndUpdate(
            lawyerId,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!updatedLawyer) {
            return res.status(404).json({
                success: false,
                message: "Lawyer not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            lawyer: updatedLawyer
        });

    } catch (error) {
        console.error("Error in updateLawyerProfile:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

// api to get data for lawyer dashboard
export const lawyerDashboard = async (req, res) => {
    try{
        const {lawyerId} = req.body;
        
        if(!lawyerId){
            return res.status(400).json({ success: false, message: "Lawyer ID is required" })
        }

        const appointments = await appointmentModel.find({lawyerId});

        let earnings = 0;
        appointments.map((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount
            }
        });

        let users = []

        appointments.map((item) => {
            if (!users.includes(item.userId)) {
                users.push(item.userId)
            }
        });

        const dashboardData = {
            earnings, 
            appointments: appointments.length,
            clients: users.length,
            latestAppointments: appointments.reverse()
        }

        res.status(200).json({ success: true, dashboardData})

    }catch(error){
        res.status(500).json({ success: false, message: error.message })
    }
}