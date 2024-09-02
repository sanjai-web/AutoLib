import React from 'react'
import "../styles/navigation.css"
import { NavLink } from "react-router-dom";
function navigation() {
  return (
    <>
    <div className='Topnav'>

    <div className='navName' >company name</div>
    
   <span className='navmain'>
          <NavLink  to="/home" className="link1">
            <p className="homei" > Home </p>
          </NavLink>
     
          <NavLink to="/admin" className="link1">
            <p className="message"  > Admin </p>
          </NavLink>
       
          </span>
    </div>
    </>
  )
}

export default navigation