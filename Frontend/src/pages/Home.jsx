import React from 'react'
import Header from '../components/Header.jsx'
import SpecialityMenu from '../components/SpecialityMenu.jsx'
import TopLawyers from '../components/TopLawyers.jsx'
import Banner from '../components/Banner.jsx'


const Home = () => {
  return (
    <div>
      <Header />
      <SpecialityMenu />
      <TopLawyers />
      <Banner />
    </div>
  )
}

export default Home