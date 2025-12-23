import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import AdminContextProvider from './context/AdminContext.jsx'
import LawyerContextProvider from './context/LawyerContext.jsx'
import AppContextProvider from './context/AppContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <AdminContextProvider>
      <LawyerContextProvider>
        <AppContextProvider>
          <App />
        </AppContextProvider>
    </LawyerContextProvider>
    </AdminContextProvider>
)