import React from 'react'
import { useNavigate } from 'react-router-dom'

const VerifyEmail = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-4 m-auto items-center p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg text-center">

        <p className="text-2xl font-semibold">
          Verify Your Email
        </p>

        <p>
          We’ve sent a verification link to your email address.
        </p>

        <p className="text-sm text-gray-500">
          Please open your email and click on the verification link
          to activate your account.
        </p>

        <button
          onClick={() => navigate('/login')}
          className="bg-primary text-white w-full py-2 rounded-md text-base mt-2"
        >
          Go to Login
        </button>

        <p className="text-xs text-gray-400">
          Didn’t receive the email?  
          Check spam or try resending from login.
        </p>

      </div>
    </div>
  )
}

export default VerifyEmail
