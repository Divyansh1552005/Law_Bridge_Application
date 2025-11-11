import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
const RelatedLawyers = ({ speciality, lawyerId }) => {

  const navigate = useNavigate()
  const { lawyers } = useContext(AppContext)

  const [relLaw, setRelLaw] = useState([])

  useEffect(() => {
    if (lawyers.length > 0 && speciality) {
      const lawyersData = lawyers.filter((lawyer) => lawyer.speciality === speciality && lawyer._id !== lawyerId)
      setRelLaw(lawyersData)
    }
  }, [lawyers, speciality, lawyerId])

  return (
    <div>
      <h2 className='text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2'>
        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        Similar {speciality} Specialists
      </h2>

      {relLaw.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-xl">
          <p className="text-gray-600">No other specialists found in this category</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
          {relLaw.map((item, index) => (
            <div 
              key={index}
              onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }}
              className='group flex gap-4 p-3 sm:p-4 bg-white border border-gray-100 rounded-xl cursor-pointer hover:shadow-md hover:border-primary/20 transition-all duration-300'
            >
              <div className='w-20 sm:w-24 shrink-0'>
                <div className='aspect-square rounded-lg overflow-hidden bg-[#EAEFFF]'>
                  <img 
                    className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300' 
                    src={item.image} 
                    alt={item.name}
                  />
                </div>
              </div>
              
              <div className='flex-1 min-w-0'>
                <h3 className='text-base sm:text-lg font-semibold text-gray-900 truncate group-hover:text-primary transition-colors'>
                  {item.name}
                </h3>
                <p className='text-sm text-primary/80 font-medium mt-0.5'>
                  {item.speciality}
                </p>
                <div className='flex items-center gap-2 mt-2'>
                  <span 
                    className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                      item.available 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      item.available ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                    {item.available ? 'Available' : 'Not Available'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default RelatedLawyers