import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext.jsx'
import api from '../api/axiosClient'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Login = () => {

  // login / signup toggle
  const [state, setState] = useState('Sign Up')

  // inputs
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // UI states
  const [showResend, setShowResend] = useState(false)
  const [showForgot, setShowForgot] = useState(false)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const { backendUrl, setToken } = useContext(AppContext)

  // =====================
  // SUBMIT HANDLER
  // =====================
  const onSubmitHandler = async (event) => {
    event.preventDefault()
    setLoading(true)
    setShowResend(false)
    setShowForgot(false)

    // =====================
    // SIGN UP
    // =====================
    if (state === 'Sign Up') {
      try {
        const { data } = await api.post(
          backendUrl + '/api/user/signup',
          { name, email, password }
        )

        if (data.success) {
          toast.success('Signup successful! Please verify your email.')
          setState('Login')
        }
      } catch (error) {
        const msg =
          error.response?.data?.error ||
          error.response?.data?.message ||
          'Registration failed'

        if (error.response?.status === 409) {
          toast.error('Account already exists. Please login.')
          setState('Login')
        } else {
          toast.error(msg)
        }
      } finally {
        setLoading(false)
      }
      return
    }

    // =====================
    // LOGIN
    // =====================
    try {
      const { data } = await api.post(
        backendUrl + '/api/user/login',
        { email, password }
      )

      if (data.success) {
        localStorage.setItem('token', data.token)
        setToken(data.token)
        toast.success('Login successful!')
        navigate('/')
      }
    } catch (error) {
      const status = error.response?.status
      const msg = error.response?.data?.message

      // email not verified
      if (status === 403 && msg?.toLowerCase().includes('verify')) {
        toast.error(msg)
        setShowResend(true)
      } else {
        toast.error(msg || 'Login failed')
      }
    } finally {
      setLoading(false)
    }
  }

  // =====================
  // RESEND VERIFICATION
  // =====================
  const handleResendVerification = async () => {
    if (!email) {
      toast.error('Please enter your email')
      return
    }

    try {
      const { data } = await api.post(
        backendUrl + '/api/user/resend-verification',
        { email }
      )

      if (data.success) {
        toast.success('Verification email sent again!')
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        'Could not resend verification email'
      )
    }
  }

  // =====================
  // FORGOT PASSWORD
  // =====================
  const handleForgotPassword = async () => {
    if (!email) {
      toast.error('Please enter your email first')
      return
    }

    try {
      const { data } = await api.post(
        backendUrl + '/api/user/forgot-password',
        { email }
      )

      toast.success(
        data.message || 'Password reset email sent!'
      )
      setShowForgot(false)
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        'Could not send reset email'
      )
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>

        <p className='text-2xl font-semibold'>
          {state === 'Sign Up' ? 'Create Account' : 'Login'}
        </p>

        <p>
          Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book appointment
        </p>

        {state === 'Sign Up' && (
          <div className='w-full'>
            <p>Full Name</p>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              className='border border-[#DADADA] rounded w-full p-2 mt-1'
              type="text"
              required
            />
          </div>
        )}

        <div className='w-full'>
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className='border border-[#DADADA] rounded w-full p-2 mt-1'
            type="email"
            required
          />
        </div>

        <div className='w-full'>
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className='border border-[#DADADA] rounded w-full p-2 mt-1'
            type="password"
            required
          />
        </div>

        <button
          disabled={loading}
          className='bg-primary text-white w-full py-2 my-2 rounded-md text-base disabled:opacity-60'
        >
          {loading
            ? 'Please wait...'
            : state === 'Sign Up'
              ? 'Create account'
              : 'Login'}
        </button>

        {/* Forgot password */}
        {state === 'Login' && (
          <p
            onClick={() => setShowForgot(!showForgot)}
            className='text-sm text-primary underline cursor-pointer'
          >
            Forgot password?
          </p>
        )}

        {state === 'Login' && showForgot && (
          <div className='w-full text-sm'>
            <p className='text-red-500'>
              We’ll send a password reset link to your email.
            </p>
            <button
              type="button"
              onClick={handleForgotPassword}
              className='mt-2 bg-primary text-white px-4 py-1 rounded-md'
            >
              Send reset email
            </button>
          </div>
        )}

        {/* Resend verification */}
        {state === 'Login' && showResend && (
          <p className='text-sm text-red-500'>
            Email not verified.&nbsp;
            <span
              onClick={handleResendVerification}
              className='text-primary underline cursor-pointer'
            >
              Resend verification email
            </span>
          </p>
        )}

        {state === 'Sign Up'
          ? <p>
              Already have an account?{' '}
              <span
                onClick={() => setState('Login')}
                className='text-primary underline cursor-pointer'
              >
                Login here
              </span>
            </p>
          : <p>
              Create a new account?{' '}
              <span
                onClick={() => setState('Sign Up')}
                className='text-primary underline cursor-pointer'
              >
                Click here
              </span>
            </p>
        }

      </div>
    </form>
  )
}

export default Login
