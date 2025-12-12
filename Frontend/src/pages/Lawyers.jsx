import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate, useParams } from 'react-router-dom';

const Lawyers = () => {
  const { speciality } = useParams();
  const [filterlawyer, setFilterlawyer] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();
  const { lawyers } = useContext(AppContext);

  const applyFilter = () => {
    if (speciality) {
      setFilterlawyer(lawyers.filter(lawyer => lawyer.speciality === speciality));
    } else {
      setFilterlawyer(lawyers);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [lawyers, speciality]);

  return (
    <div>
      <p className='text-gray-600'>Browse through the lawyers specialist.</p>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        <button
          onClick={() => setShowFilter(!showFilter)}
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-primary text-white' : ''}`}
        >
          Filters
        </button>

        <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          {['Criminal Lawyer', 'Civil Litigation Lawyer', 'Corporate Lawyer', 'Family & Divorce Lawyer', 'Tax Lawyer', 'Intellectual Property Lawyer'].map((spec, index) => (
            <p
              key={index}
              onClick={() => speciality === spec ? navigate('/lawyers') : navigate(`/lawyers/${spec}`)}
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
                speciality === spec ? 'bg-[#E2E5FF] text-black' : ''
              }`}
            >
              {spec}
            </p>
          ))}
        </div>

        <div className='w-full grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {filterlawyer.map((item, index) => (
            <div
              onClick={() => {
                navigate(`/appointment/${item._id}`);
                scrollTo(0, 0);
              }}
              className='border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2.5 transition-all duration-500'
              key={index}
            >
              {/* Fixed Image Styling */}
              <div className='w-full h-60 overflow-hidden bg-[#EAEFFF]'>
                <img className='w-full h-full object-cover' style={{objectPosition: 'center 35%'}} src={item.image} alt={item.name} />
              </div>

              <div className='p-4'>
                <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : 'text-gray-500'}`}>
                  <p className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-gray-500'}`}></p>
                  <p>{item.available ? 'Available' : 'Not Available'}</p>
                </div>
                <p className='text-[#262626] text-lg font-medium'>{item.name}</p>
                <p className='text-[#5C5C5C] text-sm'>{item.speciality}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Lawyers;