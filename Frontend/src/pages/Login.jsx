import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext.jsx'
import api from '../api/axiosClient'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Login = () => {

  // to manage state of login and signup
  const [state, setState] = useState('Sign Up')

  // to store values of input fields
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  // Track if we just performed login/signup
  const [justAuthenticated, setJustAuthenticated] = useState(false)

  const navigate = useNavigate()
  const { backendUrl, token, setToken } = useContext(AppContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (state === 'Sign Up') {
      try {
        const { data } = await api.post(backendUrl + '/api/user/signup', { 
          name, 
          email, 
          password 
        });

        if (data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
          setJustAuthenticated(true);
          toast.success('Registration successful!');
          // Navigate after successful registration
          setTimeout(() => navigate('/'), 1000);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.error('Registration error:', error);
        const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message;
        if (error.response?.status === 409) {
          toast.error('An account with this email already exists. Please login instead.');
        } else {
          toast.error(errorMessage || 'Registration failed. Please try again.');
        }
      }

        } else { // state is Login

      try {
        const { data } = await api.post(backendUrl + '/api/user/login', { email, password })

        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
          setJustAuthenticated(true);
          toast.success('Login successful!');
          // Navigate after successful login
          setTimeout(() => navigate('/'), 1000);
        } else {
          console.log(data.message)
          toast.error("User does not exist. Please sign up first.")
        }
      } catch (error) {
        console.log(error)
        toast.error("User does not exist. Please sign up first.")
      }

        }

      }


  // No automatic redirect - only redirect after successful auth in onSubmitHandler

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
        <p className='text-2xl font-semibold'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</p>
        <p>Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book appointment</p>
        {state === 'Sign Up'
          ? <div className='w-full '>
            <p>Full Name</p>
            <input onChange={(e) => setName(e.target.value)} value={name} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="text" required />
          </div>
          : null
        }
        <div className='w-full '>
          <p>Email</p>
          <input onChange={(e) => setEmail(e.target.value)} value={email} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="email" required />
        </div>
        <div className='w-full '>
          <p>Password</p>
          <input onChange={(e) => setPassword(e.target.value)} value={password} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="password" required />
        </div>
        <button className='bg-primary text-white w-full py-2 my-2 rounded-md text-base'>{state === 'Sign Up' ? 'Create account' : 'Login'}</button>
        {state === 'Sign Up'
          ? <p>Already have an account? <span onClick={() => setState('Login')} className='text-primary underline cursor-pointer'>Login here</span></p>
          : <p>Create an new account? <span onClick={() => setState('Sign Up')} className='text-primary underline cursor-pointer'>Click here</span></p>
        }
      </div>
    </form>
  )
}

export default Login