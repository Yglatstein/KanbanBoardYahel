import React from 'react'
import Navbar from '../navbar/Navbar'
import Footer from '../footer/Footer'
import Routers from '../../routes/Routers'
export const Layout = () => {
  return (
    <div>
      <Navbar />

      <div>
        <Routers />
      </div>

      <Footer />

    </div>
  )
}
