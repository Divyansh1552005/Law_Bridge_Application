// Backend/routes/videoRoute.js

import express from 'express';
import { getVideoToken, updateCallStatus, getCallDetails } from '../controllers/videoController.js';
import authUser from '../middleware/authUser.js';
import authLawyer from '../middleware/authLawyer.js';

const videoRouter = express.Router();

// Middleware to accept both user and lawyer tokens
const authUserOrLawyer = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authorization required. Please provide a valid Bearer token.' 
    });
  }

  const token = authHeader.split(' ')[1];
  
  // Try to determine if it's a user or lawyer token by checking the request body/params
  // or by attempting both auth methods
  
  // First, try user authentication
  return authUser(req, res, (userError) => {
    if (!userError) {
      // User auth succeeded
      return next();
    }
    
    // If user auth failed, try lawyer auth
    return authLawyer(req, res, (lawyerError) => {
      if (!lawyerError) {
        // Lawyer auth succeeded
        return next();
      }
      
      // Both failed
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token. Please login again.' 
      });
    });
  });
};

// Get Stream token and call details
videoRouter.post('/get-token', authUserOrLawyer, getVideoToken);

// Update call status (join/leave/end)
videoRouter.post('/update-status', authUserOrLawyer, updateCallStatus);

// Get call details
videoRouter.get('/call-details/:appointmentId', authUserOrLawyer, getCallDetails);

export default videoRouter;