import { useState, useContext, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import moment from "moment";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Edit3, Home } from "lucide-react";

const Sidebar = ({ isMenuOpen, setIsMenuOpen }) => {
  const {
    token,
    setToken,
    userData,
    backendUrl,
    sessionId,
    setSessionId,
    currentSession,
    setCurrentSession,
    createNewChat,
    fetchUserChats,
  } = useContext(AppContext);
  
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [chatSessions, setChatSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingTitleId, setEditingTitleId] = useState(null);
  const [tempTitle, setTempTitle] = useState("");

  // Load user's chat sessions from backend
  const loadChatSessions = async () => {
    if (!token || !userData) return;
    
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/chat/sessions`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        setChatSessions(data.sessions || []);
      } else {
        toast.error(data.message || "Failed to load chat sessions");
      }
    } catch (error) {
      console.log("Error loading chat sessions:", error);
      toast.error("Failed to load chat sessions");
    } finally {
      setLoading(false);
    }
  };

  // Handle clicking on an old session - use fetchUserChats to load it
  const handleChatClick = async (chatSession) => {
    try {
      setSessionId(chatSession.sessionId);
      navigate(`/chatbot/${chatSession.sessionId}`);
      // Use fetchUserChats to load the specific session
      await fetchUserChats(chatSession.sessionId);
      setIsMenuOpen(false);
    } catch (error) {
      toast.error("Error loading chat session");
      console.log(error);
    }
  };

  // Delete any chat session
  const deleteChat = async (e, sessionIdToDelete) => {
    try {
      e.stopPropagation();
      const confirm = window.confirm(
        "Are you sure you want to delete this chat?"
      );

      if (!confirm) return;

      const { data } = await axios.delete(`${backendUrl}/api/chat/delete`, {
        data: { sessionId: sessionIdToDelete },
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        // Reload sessions from backend after successful deletion
        await loadChatSessions();
        
        // If deleting current active session, redirect
        if (sessionId === sessionIdToDelete) {
          setSessionId(null);
          setCurrentSession(null);
          navigate("/chatbot");
        }
        toast.success(data.message || "Chat deleted successfully");
      } else {
        toast.error(data.message || "Failed to delete chat");
      }
    } catch (error) {
      toast.error("Error deleting chat");
      console.log(error);
    }
  };

  const handleNewChat = async () => {
    const newSessionId = await createNewChat();
    if (newSessionId) {
      navigate(`/chatbot/${newSessionId}`);
      // Reload sessions from backend to show the new chat
      await loadChatSessions();
    }
    setIsMenuOpen(false);
  };

  // Update chat title
  const updateChatTitle = async (sessionIdToUpdate, newTitle) => {
    try {
      // Update chat title in backend
      const { data } = await axios.put(`${backendUrl}/api/chat/update-title`, {
        sessionId: sessionIdToUpdate,
        title: newTitle
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        // Update local state
        setChatSessions(prevSessions => 
          prevSessions.map(chat => 
            chat.sessionId === sessionIdToUpdate 
              ? { ...chat, title: newTitle, updatedAt: new Date().toISOString() }
              : chat
          )
        );
        toast.success("Chat title updated successfully");
      } else {
        toast.error(data.message || "Failed to update chat title");
      }
    } catch (error) {
      console.log("Error updating chat title:", error);
      toast.error("Error updating chat title");
    }
  };

  const startEditingTitle = (chat) => {
    setEditingTitleId(chat.sessionId);
    setTempTitle(chat.title || chat.lastMessage || `Chat ${chat.sessionId.split('-')[1]}`);
  };

  const saveTitle = async (sessionIdToUpdate) => {
    if (tempTitle.trim()) {
      await updateChatTitle(sessionIdToUpdate, tempTitle.trim());
    }
    setEditingTitleId(null);
    setTempTitle("");
  };

  const cancelEdit = () => {
    setEditingTitleId(null);
    setTempTitle("");
  };

  // Load sessions on component mount
  useEffect(() => {
    loadChatSessions();
  }, [userData, token]);

  return (
    <div
      className={`flex flex-col h-screen min-w-80 p-5 dark:bg-gradient-to-b from-[#242124]/30 to-[#000000]/30 border-r border-[#80609F]/30 backdrop-blur-3xl transition-all duration-500 ${
        isMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Logo */}
      {/* <img
        src={assets.legallogo}
        alt="Law Bridge Logo"
        className="w-full max-w-48"
      /> */}

      {/* Go to Homepage Button */}
      <button
        onClick={() => {
          navigate('/');
          setIsMenuOpen(false);
        }}
        className="flex justify-center items-center w-full py-3 mt-15 text-gray-700 dark:text-white bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm rounded-md cursor-pointer transition-colors"
      >
        <Home size={16} className="mr-2" /> Go to Homepage
      </button>

      {/* New Chat Button */}
      <button
        onClick={handleNewChat}
        disabled={!userData}
        className="flex justify-center items-center w-full py-2 mt-3 text-white bg-[#A456F7] hover:bg-[#9146E6] text-sm rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <span className="mr-2 text-xl">+</span> New Legal Chat
      </button>

      {/* Search Conversations */}
      <div className="flex items-center gap-3 p-3 mt-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl shadow-sm hover:bg-white/20 transition-all duration-200">
        <img
          src={assets.search_icon}
          alt="search"
          className="w-4 h-4 opacity-70 not-dark:invert flex-shrink-0"
        />
        <input
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          type="text"
          placeholder="Search conversations..."
          className="flex-1 text-sm placeholder:text-gray-400 dark:placeholder:text-gray-300 text-gray-700 dark:text-white outline-none bg-transparent"
        />
      </div>

      {/* Recent Chats */}
      {chatSessions.length > 0 && (
        <div className="mt-6 mb-2">
          <h3 className="text-base font-semibold text-center text-black dark:text-white">
            Recent Legal Chats
          </h3>
        </div>
      )}
      <div className="flex-1 overflow-y-scroll mt-3 text-sm space-y-3">
        {loading ? (
          <div className="text-center text-gray-500">Loading chats...</div>
        ) : (
          chatSessions
            .filter((chat) =>
              chat.lastMessage
                ? chat.lastMessage.toLowerCase().includes(search.toLowerCase())
                : chat.sessionId.toLowerCase().includes(search.toLowerCase())
            )
            .map((chat) => (
              <div
                key={chat.sessionId}
                className={`p-2 px-4 border border-gray-300 dark:border-[#80609F]/15 rounded-md flex justify-between group ${
                  sessionId === chat.sessionId 
                    ? 'bg-[#A456F7] text-white' 
                    : 'dark:bg-[#57317C]/10 hover:bg-gray-50 dark:hover:bg-[#57317C]/20'
                }`}
              >
                <div className="flex-1 min-w-0" onClick={() => !editingTitleId && handleChatClick(chat)}>
                  {editingTitleId === chat.sessionId ? (
                    <input
                      type="text"
                      value={tempTitle}
                      onChange={(e) => setTempTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveTitle(chat.sessionId);
                        if (e.key === 'Escape') cancelEdit();
                      }}
                      onBlur={() => saveTitle(chat.sessionId)}
                      className="w-full text-sm bg-transparent border-b border-primary outline-none"
                      autoFocus
                    />
                  ) : (
                    <p className="truncate cursor-pointer" onDoubleClick={() => startEditingTitle(chat)}>
                      {chat.title || chat.lastMessage || `Legal Chat ${chat.sessionId.split('-')[1]}`}
                    </p>
                  )}
                  <p className={`text-sm font-medium mt-1 ${
                    sessionId === chat.sessionId 
                      ? 'text-white/90' 
                      : 'text-[#A456F7] dark:text-gray-300'
                  }`}>
                    {moment(chat.updatedAt).format('MMM DD, YYYY h:mm A')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditingTitle(chat);
                    }}
                    className="p-1 text-black hover:text-gray-700 hover:bg-white/20 rounded transition-all duration-200"
                  >
                    <Edit3 size={16} />
                  </button>
                  <img
                    onClick={(e) => deleteChat(e, chat.sessionId)}
                    src={assets.bin_icon}
                    alt="delete"
                    className="w-4 cursor-pointer brightness-0 flex-shrink-0"
                  />
                </div>
              </div>
            ))
        )}
      </div>

      {/* User Info */}
      {userData && (
        <div className="mt-auto p-3 border border-gray-300 dark:border-white/15 rounded-md hover:bg-gray-50 dark:hover:bg-[#57317C]/20 transition-colors cursor-pointer"
             onClick={() => {
               navigate('/my-profile');
               setIsMenuOpen(false);
             }}>
          <div className="flex items-center gap-3">
            <img src={assets.user_icon} alt="user" className="w-7 rounded-full" />
            <p className="text-sm dark:text-primary truncate">
              {userData.name}
            </p>
          </div>
        </div>
      )}

      {/* Remove duplicate close button - main toggle handles this */}
    </div>
  );
};

export default Sidebar;