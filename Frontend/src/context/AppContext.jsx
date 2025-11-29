import {createContext} from 'react';
import axios from 'axios'; 
import {toast} from 'react-toastify';
import {useEffect, useState} from 'react';


export const AppContext = createContext();

const AppContextProvider = (props) =>{

  const currencySymbol = '₹';
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [lawyers, setLawyers] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token') || null); // check localStorage for token first 
  const [userData, setUserData] = useState(false);

  // chatbot related states
  const [sessionId, setSessionId] = useState(null); // current active session id
  const [currentSession, setCurrentSession] = useState(null); // current active session chat
  const [loadingResponse, setLoadingResponse] = useState(false); // loading state for bot response

  const getLawyersData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/lawyer/list');
      if (data.success) {
          setLawyers(data.lawyers);
      }else{
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const loadUserProfileData = async () => {

      if(!token) return;
    try {
      const { data } = await axios.get(backendUrl + '/api/user/get-profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (data.success) {
        setUserData(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  
  }

  

  // creating new chat
  const createNewChat = async () => {
    try {
      if (!token) {
        toast.error("Please login to create a chat");
        return null;
      }

      // Generate unique session ID
      const newSessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setSessionId(newSessionId);  
      
      const { data } = await axios.post(backendUrl + '/api/chat/create', {
        sessionId: newSessionId
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (data.success) {
        const newSession = { sessionId: newSessionId, messages: [], _id: data.chatId };
        setCurrentSession(newSession);
        
        toast.success("New chat created");
        return newSessionId;
      } else {
        toast.error(data.message);
        return null;
      }
      
    } catch (error) {
      toast.error("Error creating new chat session");
      console.log(error);
      return null;
    }
  }

  const fetchUserChats = async (targetSessionId) => {
    try {
      const sessionToFetch = targetSessionId || sessionId;
      
      if (!token || !sessionToFetch) {
        console.log('Missing token or sessionId');
        return;
      }

      const { data } = await axios.get(`${backendUrl}/api/chat/get/${sessionToFetch}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (data.success) {
        setCurrentSession(data.chats);
        return data.chats;
      } else {
        toast.error(data.message);
        return null;
      }
      
    } catch (error) {
      toast.error("Error fetching chat session");
      console.log(error);
      return null;
    }
  }

  const value = {
    lawyers : lawyers,
    getLawyersData,
    currencySymbol,
    token,
    setToken,
    backendUrl,
    userData,
    setUserData,
    loadUserProfileData,
    // chatbot related values
    sessionId,
    setSessionId,
    currentSession,
    setCurrentSession,
    createNewChat,
    fetchUserChats,
    loadingResponse,
    setLoadingResponse,
  }

  // page load hote hi lawyers data leke aao
  useEffect(()=>{
    getLawyersData();
  }, [])

  // page load hote hi user profile data leke aao agar token available hai
  useEffect(() => {
    if (token) {
      loadUserProfileData();
    }
    else{
      // LOGOUT case
      setUserData(false);
    }
  }, [token]);


  


  return(
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}


export default AppContextProvider;