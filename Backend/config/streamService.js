// Backend/config/streamService.js

import { StreamClient } from '@stream-io/node-sdk';

// Initialize Stream client
const streamClient = new StreamClient(
  process.env.STREAM_API_KEY,
  process.env.STREAM_API_SECRET
);

/**
 * Generate Stream user token for authentication
 * @param {string} userId - User/Lawyer ID
 * @param {string} userName - User/Lawyer name
 * @returns {Promise<string>} - User token
 */
export const generateStreamToken = async (userId, userName) => {
  try {
    // Create/update user in Stream
    await streamClient.upsertUsers([
      {
        id: userId,
        name: userName,
        role: 'user'
      }
    ]);

    // Generate token valid for 24 hours
    const token = streamClient.generateUserToken({ 
      user_id: userId,
      validity_in_seconds: 24 * 60 * 60 
    });

    return token;
  } catch (error) {
    console.error('Stream token generation error:', error);
    throw error;
  }
};

/**
 * Create a video call room
 * @param {string} callId - Unique call identifier (appointment ID)
 * @param {string} userId - User ID
 * @param {string} lawyerId - Lawyer ID
 * @returns {Promise<Object>} - Call details
 */
export const createVideoCall = async (callId, userId, lawyerId) => {
  try {
    const call = streamClient.video.call('default', callId);
    
    // Create call with members (using getOrCreate to avoid conflicts)
    await call.getOrCreate({
      data: {
        members: [
          { user_id: userId },
          { user_id: lawyerId }
        ]
      }
    });

    return { callId, success: true };
  } catch (error) {
    console.error('Stream call creation error:', error);
    throw error;
  }
};

/**
 * End a video call
 * @param {string} callId - Call identifier
 */
export const endVideoCall = async (callId) => {
  try {
    const call = streamClient.video.call('default', callId);
    await call.end();
    return { success: true };
  } catch (error) {
    console.error('Stream call end error:', error);
    throw error;
  }
};

export default streamClient;