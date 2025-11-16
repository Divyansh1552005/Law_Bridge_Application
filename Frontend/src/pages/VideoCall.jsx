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
  const [isCallEnded, setIsCallEnded] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  useEffect(() => {
    let mounted = true;
    
    const initCall = async () => {
      if (mounted && !isCallEnded) {
        await initializeCall();
      }
    };
    
    initCall();
    
    return () => {
      mounted = false;
      // Simple cleanup without calling handleLeaveCall to avoid loops
      if (call && !isCallEnded) {
        try {
          // Remove specific event handlers
          if (call._eventHandlers) {
            call.off('call.ended', call._eventHandlers.handleCallEnded);
            call.off('call.session_ended', call._eventHandlers.handleSessionEnded);
          }
          call.leave();
        } catch (error) {
          console.log('Cleanup error:', error);
        }
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

      // Add event listeners for call events
      const handleCallEnded = () => {
        console.log('Call ended by another participant');
        setIsCallEnded(true);
        setTimeout(() => {
          toast.info('Call ended by lawyer');
          navigate('/my-appointments');
        }, 100);
      };

      const handleSessionEnded = () => {
        console.log('Call session ended');
        setIsCallEnded(true);
        setTimeout(() => {
          toast.info('Call session ended');
          navigate('/my-appointments');
        }, 100);
      };

      streamCall.on('call.ended', handleCallEnded);
      streamCall.on('call.session_ended', handleSessionEnded);

      // Store event handlers for cleanup
      streamCall._eventHandlers = { handleCallEnded, handleSessionEnded };

      setClient(streamClient);
      setCall(streamCall);
      setConnectionStatus('connected');
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

  if (isCallEnded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Call ended. Redirecting...</p>
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
              <h1 className="text-white font-semibold">Legal Consultation</h1>
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
                <div className="text-white text-sm font-medium mb-2">Participants</div>
                <CallParticipantsList onClose={() => {}} />
              </div>
            </div>

            {/* Enhanced Call Controls */}
            <div className="bg-gray-800 px-6 py-4">
              <div className="flex items-center justify-center space-x-4">
                {/* Custom Controls */}
                <div className="flex items-center space-x-3">
                  <CallControls onLeave={handleLeaveCall} />
                </div>
                
                {/* Leave Call Button */}
                <button
                  onClick={handleLeaveCall}
                  className="flex items-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  <span>Leave Call</span>
                </button>
              </div>
              
              {/* Call Info */}
              <div className="mt-3 text-center">
                <p className="text-gray-400 text-sm">
                  Click "Leave Call" to exit the consultation
                </p>
              </div>
            </div>
          </div>
        </StreamCall>
      </StreamVideo>
    </div>
  );
};

export default VideoCall;