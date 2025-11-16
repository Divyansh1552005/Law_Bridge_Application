// Frontend/src/pages/VideoCall.jsx

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StreamVideo, StreamVideoClient, StreamCall, CallControls, SpeakerLayout, CallParticipantsList } from '@stream-io/video-react-sdk';
import axios from 'axios';
import { toast } from 'react-toastify';
import '@stream-io/video-react-sdk/dist/css/styles.css';

const VideoCall = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeCall();
    
    return () => {
      // Cleanup on unmount
      if (call) {
        handleLeaveCall();
      }
    };
  }, [appointmentId]);

  const initializeCall = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Get Stream token and call details from backend
      const { data } = await axios.post(
        backendUrl + '/api/video/get-token',
        { appointmentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!data.success) {
        toast.error(data.message);
        navigate('/my-appointments');
        return;
      }

      // Initialize Stream client
      const streamClient = new StreamVideoClient({
        apiKey: data.apiKey,
        user: {
          id: data.userId,
          name: 'User'
        },
        token: data.token
      });

      // Join the call (create if doesn't exist)
      const streamCall = streamClient.call('default', data.callId);
      await streamCall.join({ create: true });

      setClient(streamClient);
      setCall(streamCall);
      setLoading(false);

      // Update call status to joined
      await axios.post(
        backendUrl + '/api/video/update-status',
        { appointmentId, action: 'join' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

    } catch (error) {
      console.error('Video call initialization error:', error);
      toast.error('Failed to join video call');
      navigate('/my-appointments');
    }
  };

  const handleLeaveCall = async () => {
    try {
      if (call) {
        await call.leave();
      }
      
      const token = localStorage.getItem('token');
      
      // Update call status to left
      await axios.post(
        backendUrl + '/api/video/update-status',
        { appointmentId, action: 'leave' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Call ended');
      navigate('/my-appointments');
      
    } catch (error) {
      console.error('Leave call error:', error);
      navigate('/my-appointments');
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
    <div className="h-screen bg-gray-900">
      <StreamVideo client={client}>
        <StreamCall call={call}>
          <div className="flex flex-col h-full">
            {/* Video Layout */}
            <div className="flex-1 relative">
              <SpeakerLayout />
            </div>

            {/* Call Controls */}
            <div className="bg-gray-800 py-4">
              <CallControls onLeave={handleLeaveCall} />
            </div>

            {/* Participants List (Optional - can be toggled) */}
            <div className="absolute right-4 top-4 w-64">
              <CallParticipantsList onClose={() => {}} />
            </div>
          </div>
        </StreamCall>
      </StreamVideo>
    </div>
  );
};

export default VideoCall;