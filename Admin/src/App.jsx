import React, { useContext } from 'react'
import { LawyerContext } from './context/LawyerContext';
import { AdminContext } from './context/AdminContext';
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Admin/Dashboard';
import AllAppointments from './pages/Admin/AllAppointments';
import AddLawyer from './pages/Admin/AddLawyer.jsx';
import LawyerList from './pages/Admin/LawyerList.jsx';
import Login from './pages/Login';
import LawyerAppointments from './pages/Lawyer/LawyerAppointments';
import LawyerDashboard from './pages/Lawyer/LawyerDashboard';
import LawyerProfile from './pages/Lawyer/LawyerProfile';
import LawyerVideoCall from './pages/Lawyer/LawyerVideoCall.jsx';

function App() {
  const adminContext = useContext(AdminContext);
  const lawyerContext = useContext(LawyerContext);
  
  const aToken = adminContext?.aToken;
  const lToken = lawyerContext?.lToken;

  return aToken || lToken ? (
    <div className='bg-[#F8F9FD]'>
      {/* <Login /> */}
      
      
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored"/>
      <Navbar />
      <div className="flex items-start">
      <Sidebar />
       <Routes>
          <Route path='/' element={<></>} />
          <Route path='/admin-dashboard' element={<Dashboard />} />
          <Route path='/all-appointments' element={<AllAppointments />} />
          <Route path='/add-lawyer' element={<AddLawyer />} />
          <Route path='/lawyer-list' element={<LawyerList />} />
          <Route path='/lawyer-dashboard' element={<LawyerDashboard />} />
          <Route path='/lawyer-appointments' element={<LawyerAppointments />} />
          <Route path='/lawyer-profile' element={<LawyerProfile />} />
          <Route path="/lawyer/video-call/:appointmentId" element={<LawyerVideoCall />} />
        </Routes>

        </div>
    </div>
  ):(
    <>
      <Login />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored"/>
    </>
  )
}

export default App

