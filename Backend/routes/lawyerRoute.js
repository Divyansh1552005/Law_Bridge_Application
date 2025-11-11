import express from 'express';
import authLawyer from '../middleware/authLawyer.js';
import { changeAvailability, getLawyerList, lawyerLogin, cancelAppointmentByLawyer, appointmentCompletedByLawyer, getLawyerProfile, updateLawyerProfile, lawyerDashboard, getLawyerAppointments} from '../controllers/lawyerController.js';

const LawyerRouter = express.Router();

LawyerRouter.post('/change-availability', authLawyer, changeAvailability);
LawyerRouter.get('/list', getLawyerList);
LawyerRouter.post('/login', lawyerLogin);
LawyerRouter.post('/cancel-appointment', authLawyer, cancelAppointmentByLawyer);
LawyerRouter.post('/complete-appointment', authLawyer, appointmentCompletedByLawyer);
LawyerRouter.get('/get-profile', authLawyer, getLawyerProfile);
LawyerRouter.patch('/update-profile', authLawyer, updateLawyerProfile);
LawyerRouter.get('/dashboard', authLawyer, lawyerDashboard);
LawyerRouter.get("/lawyer-appointments", authLawyer, getLawyerAppointments);


export default LawyerRouter;