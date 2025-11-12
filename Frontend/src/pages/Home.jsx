import React from 'react'
import Header from '../components/Header.jsx'
import TopLawyers from '../components/TopLawyers.jsx'
import Features from '../components/Features.jsx'
import Faq from '../components/Faq.jsx'

const Home = () => {
  return (
    <div>
      <Header />
      <Features />
      <TopLawyers />
      <Faq />
    </div>
  )
}

export default Home