import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const TopLawyers = () => {
    const navigate = useNavigate();
    const { lawyers } = useContext(AppContext);

    return (
        <div className='flex flex-col items-center gap-6 my-20 text-gray-900 md:mx-10'>
            <div className='text-center max-w-2xl'>
                <h1 className='text-4xl md:text-5xl font-bold mb-4'>Top Lawyers to Book</h1>
                <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-6"></div>
                <p className='text-gray-600 text-lg'>Simply browse through our extensive list of trusted lawyers.</p>
            </div>

            <div className='w-full grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-8 px-3 sm:px-0'>
                {lawyers.slice(0, 10).map((item, index) => (
                    <div
                        onClick={() => {
                            navigate(`/appointment/${item._id}`);
                            scrollTo(0, 0);
                        }}
                        className='group bg-white border-2 border-gray-100 rounded-3xl overflow-hidden cursor-pointer hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-2 transition-all duration-300'
                        key={index}
                    >
                        {/* Image Container */}
                        <div className='relative w-full h-64 overflow-hidden bg-gradient-to-br from-blue-50 to-gray-50'>
                            <img 
                                className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300' 
                                style={{objectPosition: 'center 20%'}} 
                                src={item.image} 
                                alt={item.name} 
                            />
                            
                            {/* Availability Badge */}
                            <div className='absolute top-4 right-4'>
                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm ${
                                    item.available 
                                        ? 'bg-green-500/90 text-white' 
                                        : 'bg-gray-500/90 text-white'
                                }`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${item.available ? 'bg-white' : 'bg-gray-300'}`}></div>
                                    {item.available ? 'Available' : 'Busy'}
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className='p-5'>
                            <h3 className='text-gray-900 text-xl font-bold mb-1'>{item.name}</h3>
                            <p className='text-gray-600 text-sm font-medium'>{item.speciality}</p>
                            
                            {/* View Profile Link */}
                            <div className='mt-4 flex items-center text-primary text-sm font-semibold group-hover:gap-2 transition-all'>
                                <span>View Profile</span>
                                <svg className='w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                                </svg>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={() => {
                    navigate('/lawyers');
                    scrollTo(0, 0);
                }}
                className='bg-primary text-white px-10 py-4 rounded-full mt-12 font-semibold hover:bg-purple-500 transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center gap-2 cursor-pointer'
            >
                View All Lawyers
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                </svg>
            </button>
        </div>
    );
};

export default TopLawyers;