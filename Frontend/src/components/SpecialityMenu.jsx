import React from 'react'
import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'

const SpecialityMenu = () => {
    return (
        <div id='speciality' className='flex flex-col items-center gap-4 py-16 text-[#262626]'>
            <h1 className='text-3xl font-medium'>Find by Speciality</h1>
            <p className='sm:w-1/3 text-center text-base md:text-lg'>Simply browse through our extensive list of trusted Lawyers.</p>
            <div className='flex sm:justify-center gap-4 pt-5 w-full overflow-x-auto scrollbar-hide'>
                {specialityData.map((item, index) => (
                    <Link to={`/lawyers/${item.speciality}`} onClick={() => scrollTo(0, 0)} className='flex flex-col items-center text-sm sm:text-base cursor-pointer shrink-0 hover:translate-y-[-10px] transition-all duration-500' key={index}>
                        <img className='w-16 sm:w-24 mb-2 ' src={item.image} alt="" />
                        <p>{item.speciality}</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default SpecialityMenu