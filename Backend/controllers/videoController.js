// Backend/controllers/videoController.js

import appointmentModel from '../models/appointmentModel.js';
import { generateStreamToken, createVideoCall, endVideoCall } from '../config/streamService.js';

/**
 * Generate Stream token for user
 * Endpoint: POST /api/video/get-token
 */

export const getVideoToken = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const userId = req.body.userId || req.body.lawyerId; // Works for both user and lawyer
    
    // Find appointment
    const appointment = await appointmentModel.findById(appointmentId);
    
    if (!appointment) {
      return res.json({ success: false, message: 'Appointment not found' });
    }

    // Verify user is part of appointment
    const isUser = appointment.userId === userId;
    const isLawyer = appointment.lawyerId === userId;
    
    if (!isUser && !isLawyer) {
      return res.json({ success: false, message: 'Unauthorized access' });
    }

    // Check if appointment is paid
    if (!appointment.payment) {
      return res.json({ success: false, message: 'Appointment not paid' });
    }

    // Check if appointment is not cancelled
    if (appointment.cancelled && appointment.cancelled !== "Not Cancelled") {
      return res.json({ success: false, message: 'Appointment cancelled' });
    }

    // Get user name
    const userName = isUser ? appointment.userData.name : appointment.lawyerData.name;
    
    // Generate Stream token
    const token = await generateStreamToken(userId, userName);
    
    // Create video call if not exists
    let callId = appointment.videoCall.callId;
    if (!callId) {
      callId = `appointment_${appointmentId}`;
      try {
        await createVideoCall(callId, appointment.userId, appointment.lawyerId);
        
        // Update appointment with call details
        appointment.videoCall.callId = callId;
        appointment.videoCall.roomId = callId;
        await appointment.save();
      } catch (createError) {
        console.error('Call creation error:', createError);
        // If call creation fails, we can still proceed - 
        // Stream allows calls to be created on join with proper settings
        appointment.videoCall.callId = callId;
        appointment.videoCall.roomId = callId;
        await appointment.save();
      }
    }

    res.json({
      success: true,
      token,
      callId: appointment.videoCall.callId,
      apiKey: process.env.STREAM_API_KEY,
      userId
    });

  } catch (error) {
    console.error('Get video token error:', error);
    res.json({ success: false, message: error.message });
  }
};

/**
 * Update video call status (join/leave)
 * Endpoint: POST /api/video/update-status
 */
export const updateCallStatus = async (req, res) => {
  try {
    const { appointmentId, action } = req.body; // action: 'join' | 'leave' | 'end'
    const userId = req.body.userId || req.body.lawyerId;
    
    const appointment = await appointmentModel.findById(appointmentId);
    
    if (!appointment) {
      return res.json({ success: false, message: 'Appointment not found' });
    }

    const isUser = appointment.userId === userId;
    const isLawyer = appointment.lawyerId === userId;

    switch (action) {
      case 'join':
        if (isUser) appointment.videoCall.userJoined = true;
        if (isLawyer) appointment.videoCall.lawyerJoined = true;
        
        // Start call when first person joins
        if (!appointment.videoCall.startedAt) {
          appointment.videoCall.startedAt = new Date();
          appointment.videoCall.status = 'in_progress';
        }
        break;

      case 'leave':
        if (isUser) appointment.videoCall.userJoined = false;
        if (isLawyer) appointment.videoCall.lawyerJoined = false;
        
        // End call when both have left
        if (!appointment.videoCall.userJoined && !appointment.videoCall.lawyerJoined) {
          appointment.videoCall.endedAt = new Date();
          appointment.videoCall.status = 'completed';
          
          // Calculate duration
          const duration = Math.round(
            (appointment.videoCall.endedAt - appointment.videoCall.startedAt) / 60000
          );
          appointment.videoCall.duration = duration;
          
          // End call on Stream
          await endVideoCall(appointment.videoCall.callId);
        }
        break;

      case 'end':
        appointment.videoCall.endedAt = new Date();
        appointment.videoCall.status = 'completed';
        appointment.videoCall.userJoined = false;
        appointment.videoCall.lawyerJoined = false;
        
        const duration = Math.round(
          (appointment.videoCall.endedAt - appointment.videoCall.startedAt) / 60000
        );
        appointment.videoCall.duration = duration;
        
        await endVideoCall(appointment.videoCall.callId);
        break;
    }

    await appointment.save();
    
    res.json({ success: true, message: 'Call status updated' });

  } catch (error) {
    console.error('Update call status error:', error);
    res.json({ success: false, message: error.message });
  }
};

/**
 * Get call details
 * Endpoint: GET /api/video/call-details/:appointmentId
 */
export const getCallDetails = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const userId = req.body.userId || req.body.lawyerId;
    
    const appointment = await appointmentModel.findById(appointmentId);
    
    if (!appointment) {
      return res.json({ success: false, message: 'Appointment not found' });
    }

    const isUser = appointment.userId === userId;
    const isLawyer = appointment.lawyerId === userId;
    
    if (!isUser && !isLawyer) {
      return res.json({ success: false, message: 'Unauthorized access' });
    }

    res.json({
      success: true,
      callDetails: appointment.videoCall,
      canJoin: appointment.payment && !appointment.cancelled
    });

  } catch (error) {
    console.error('Get call details error:', error);
    res.json({ success: false, message: error.message });
  }
};