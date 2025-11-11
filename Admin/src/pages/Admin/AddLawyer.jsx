import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const AddLawyer = () => {

    const [lawyerImg, setLawyerImg] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [experience, setExperience] = useState('1 Year')
    const [fees, setFees] = useState('')
    const [about, setAbout] = useState('')
    const [speciality, setSpeciality] = useState('Criminal Lawyer')
    const [degree, setDegree] = useState('')
    const [location, setLocation] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')

    const { backendUrl } = useContext(AppContext)
    const { aToken } = useContext(AdminContext)

    const onSubmitHandler = async (event) => {
        event.preventDefault()

        try {

            if (!lawyerImg) {
                return toast.error('Image Not Selected')
            }

            const formData = new FormData();

            formData.append('image', lawyerImg)
            formData.append('name', name)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('experience', experience)
            formData.append('fees', Number(fees))
            formData.append('about', about)
            formData.append('speciality', speciality)
            formData.append('degree', degree)
            formData.append('address', JSON.stringify({ Location: location, City: city, State: state }))

            // // console log formdata            
            // formData.forEach((value, key) => {
            //     console.log(`${key}: ${value}`);
            // });

            if (!aToken) {
                toast.error('Please login first');
                return;
            }

            const { data } = await axios.post(backendUrl + '/api/admin/add-lawyer', formData, {
                headers: {
                    'Authorization': `Bearer ${aToken}`,
                    'Content-Type': 'multipart/form-data'
                }
            })

            if (data.success) {
                toast.success(data.message)
                // aage aur lawyer add krna ho toh form reset krdo
                setLawyerImg(false)
                setName('')
                setPassword('')
                setEmail('')
                setLocation('')
                setCity('')
                setState('')
                setDegree('')
                setAbout('')
                setFees('')
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    return (
        <form onSubmit={onSubmitHandler} className='m-5 w-full'>

            <p className='mb-3 text-lg font-medium'>Add Lawyer</p>

            <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>
                <div className='flex items-center gap-4 mb-8 text-gray-500'>
                    <label htmlFor="lawyer-img">
                        <img className='w-16 bg-gray-100 rounded-full cursor-pointer' src={lawyerImg ? URL.createObjectURL(lawyerImg) : assets.upload_area} alt="" />
                    </label>
                    <input onChange={(e) => setLawyerImg(e.target.files[0])} type="file" name="" id="lawyer-img" hidden />
                    <p>Upload lawyer <br /> picture</p>
                </div>

                <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>

                    <div className='w-full lg:flex-1 flex flex-col gap-4'>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Your name</p>
                            <input onChange={e => setName(e.target.value)} value={name} className='border rounded px-3 py-2' type="text" placeholder='Name' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Lawyer Email</p>
                            <input onChange={e => setEmail(e.target.value)} value={email} className='border rounded px-3 py-2' type="email" placeholder='Email' required />
                        </div>


                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Set Password</p>
                            <input onChange={e => setPassword(e.target.value)} value={password} className='border rounded px-3 py-2' type="password" placeholder='Password' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Experience</p>
                            <select onChange={e => setExperience(e.target.value)} value={experience} className='border rounded px-2 py-2' >
                                <option value="1 Year">1 Year</option>
                                <option value="2 Year">2 Years</option>
                                <option value="3 Year">3 Years</option>
                                <option value="4 Year">4 Years</option>
                                <option value="5 Year">5 Years</option>
                                <option value="6 Year">6 Years</option>
                                <option value="8 Year">8 Years</option>
                                <option value="9 Year">9 Years</option>
                                <option value="10 Year">10 Years</option>
                                <option value=">10 Year">More than 10 Years</option>
                            </select>
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Fees</p>
                            <input onChange={e => setFees(e.target.value)} value={fees} className='border rounded px-3 py-2' type="number" placeholder='Lawyer fees' required />
                        </div>

                    </div>

                    <div className='w-full lg:flex-1 flex flex-col gap-4'>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Speciality</p>
                            <select onChange={e => setSpeciality(e.target.value)} value={speciality} className='border rounded px-2 py-2'>
                                <option value="Criminal Lawyer">Criminal Lawyer</option>
                                <option value="Family & Divorce Lawyer">Family & Divorce Lawyer</option>
                                <option value="Corporate Lawyer">Corporate Lawyer</option>
                                <option value="Civil Litigation Lawyer">Civil Litigation Lawyer</option>
                                <option value="Intellectual Property Lawyer">Intellectual Property Lawyer</option>
                                <option value="Tax Lawyer">Tax Lawyer</option>

                            </select>
                        </div>


                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Degree</p>
                            <input onChange={e => setDegree(e.target.value)} value={degree} className='border rounded px-3 py-2' type="text" placeholder='Degree' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Address</p>
                            <input onChange={e => setLocation(e.target.value)} value={location} className='border rounded px-3 py-2' type="text" placeholder='Location/Street Address' required />
                            <input onChange={e => setCity(e.target.value)} value={city} className='border rounded px-3 py-2' type="text" placeholder='City' required />
                            <input onChange={e => setState(e.target.value)} value={state} className='border rounded px-3 py-2' type="text" placeholder='State' required />
                        </div>

                    </div>

                </div>

                <div>
                    <p className='mt-4 mb-2'>About Lawyer</p>
                    <textarea onChange={e => setAbout(e.target.value)} value={about} className='w-full px-4 pt-2 border rounded' rows={5} placeholder='write about lawyer (More than 20 words)'></textarea>
                </div>

                <button type='submit' className='bg-primary px-10 py-3 mt-4 text-white rounded-full'>Add lawyer</button>

            </div>


        </form>
    )
}

export default AddLawyer