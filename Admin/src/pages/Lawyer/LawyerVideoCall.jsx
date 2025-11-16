// Admin/src/pages/Lawyer/LawyerVideoCall.jsx

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StreamVideo, StreamVideoClient, StreamCall, CallControls, SpeakerLayout, CallParticipantsList } from '@stream-io/video-react-sdk';
import axios from 'axios';
import { toast } from 'react-toastify';
import '@stream-io/video-react-sdk/dist/css/styles.css';

const LawyerVideoCall = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  useEffect(() => {
    initializeCall();
    
    return () => {
      if (call) {
        handleLeaveCall();
      }
    };
  }, [appointmentId]);

  const initializeCall = async () => {
    try {
      const lToken = localStorage.getItem('lToken');
      
      // Get Stream token and call details from backend
      const { data } = await axios.post(
        backendUrl + '/api/video/get-token',
        { appointmentId },
        { headers: { Authorization: `Bearer ${lToken}` } }
      );

      if (!data.success) {
        toast.error(data.message);
        navigate('/lawyer-appointments');
        return;
      }

      // Initialize Stream client
      const streamClient = new StreamVideoClient({
        apiKey: data.apiKey,
        user: {
          id: data.userId,
          name: 'Lawyer'
        },
        token: data.token
      });

      // Join the call (create if doesn't exist)
      const streamCall = streamClient.call('default', data.callId);
      await streamCall.join({ create: true });

      setClient(streamClient);
      setCall(streamCall);
      setConnectionStatus('connected');
      setLoading(false);

      // Update call status to joined
      await axios.post(
        backendUrl + '/api/video/update-status',
        { appointmentId, action: 'join' },
        { headers: { Authorization: `Bearer ${lToken}` } }
      );

    } catch (error) {
      console.error('Video call initialization error:', error);
      toast.error('Failed to join video call');
      navigate('/lawyer-appointments');
    }
  };

  const handleLeaveCall = async () => {
    try {
      if (call) {
        await call.leave();
      }
      
      const lToken = localStorage.getItem('lToken');
      
      // Update call status to left
      await axios.post(
        backendUrl + '/api/video/update-status',
        { appointmentId, action: 'leave' },
        { headers: { Authorization: `Bearer ${lToken}` } }
      );

      toast.success('Call ended');
      navigate('/lawyer-appointments');
      
    } catch (error) {
      console.error('Leave call error:', error);
      navigate('/lawyer-appointments');
    }
  };

  const handleEndCall = async () => {
    try {
      if (call) {
        // End the call for all participants
        await call.endCall();
      }
      
      const lToken = localStorage.getItem('lToken');
      
      // End call for everyone
      await axios.post(
        backendUrl + '/api/video/update-status',
        { appointmentId, action: 'end' },
        { headers: { Authorization: `Bearer ${lToken}` } }
      );

      toast.success('Call ended for all participants');
      navigate('/lawyer-appointments');
      
    } catch (error) {
      console.error('End call error:', error);
      navigate('/lawyer-appointments');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Connecting to video call...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      <StreamVideo client={client}>
        <StreamCall call={call}>
          {/* Header */}
          <div className="bg-gray-800 px-6 py-4 flex items-center justify-between border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-500' : 
                connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'
              }`}></div>
              <h1 className="text-white font-semibold">Client Consultation</h1>
              <span className="bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-medium">
                LAWYER
              </span>
              <span className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded-md">
                {connectionStatus === 'connected' ? 'Connected' : 
                 connectionStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
              </span>
            </div>
            <div className="text-gray-300 text-sm">
              ID: {appointmentId.slice(-6).toUpperCase()}
            </div>
          </div>

          <div className="flex-1 flex flex-col relative">
            {/* Video Layout */}
            <div className="flex-1 relative bg-black">
              <SpeakerLayout />
              
              {/* Floating Participants Panel */}
              <div className="absolute top-4 right-4 bg-gray-800/90 rounded-lg p-3 max-w-xs backdrop-blur-sm">
                <div className="text-white text-sm font-medium mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  Participants
                </div>
                <CallParticipantsList onClose={() => {}} />
              </div>
            </div>

            {/* Enhanced Call Controls */}
            <div className="bg-gray-800 px-6 py-4 border-t border-gray-700">
              <div className="flex items-center justify-between">
                {/* Left: Stream Controls */}
                <div className="flex items-center space-x-3">
                  <CallControls onLeave={handleLeaveCall} />
                </div>
                
                {/* Right: Action Buttons */}
                <div className="flex items-center space-x-3">
                  {/* Leave Call Button */}
                  <button
                    onClick={handleLeaveCall}
                    className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Leave Call</span>
                  </button>
                  
                  {/* End Call for All Button */}
                  <button
                    onClick={handleEndCall}
                    className="flex items-center space-x-2 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-lg"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>End Call for All</span>
                  </button>
                </div>
              </div>
              
              {/* Call Info */}
              <div className="mt-3 flex items-center justify-between text-sm">
                <p className="text-gray-400">
                  <span className="text-yellow-400">Leave:</span> Exit but keep call active for client
                </p>
                <p className="text-gray-400">
                  <span className="text-red-400">End for All:</span> Terminate the consultation
                </p>
              </div>
            </div>
          </div>
        </StreamCall>
      </StreamVideo>
    </div>
  );
};

export default LawyerVideoCall;