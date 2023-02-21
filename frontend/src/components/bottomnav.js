import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { MdHomeFilled } from 'react-icons/md'
import { FiSearch } from 'react-icons/fi'
import { BsHeart } from 'react-icons/bs'
import { BiLibrary } from 'react-icons/bi'
import { useContext } from 'react'
import { AuthContext } from '../context/auth'
import toast from 'react-hot-toast'

function BottomNav() {

  let location = useLocation();
  const { token } = useContext(AuthContext)

  const navigate = useNavigate();

  return (
    <div className="nav-bottom" >
      <div className="link" onClick={() => navigate("/")}>
        <MdHomeFilled color={location.pathname === "/" ? "white" : "grey"} size={18} />
        <Link to='/' className={location.pathname === "/" ? "active" : ""}>Home</Link>
      </div>
      <div className="link" onClick={() => navigate("/search")}>
        <FiSearch color={location.pathname === "/search" ? "white" : "grey"} size={18} />
        <Link to='/search' className={location.pathname === "/search" ? "active" : ""}>Search</Link>
      </div>
      <div className="link" onClick={() => {
        
        if (!token){
          toast.error("login to continue");
          return;
        } 
        navigate("liked")
      }}>
        <BsHeart color={location.pathname === "/liked" ? "white" : "grey"} size={16} />
        <div className={location.pathname === "/liked" ? "active" : ""}>Likes</div>
      </div>
      <div className="link" onClick={() => {
        if (!token){
          toast.error("login to continue");
          return;
        }
        navigate("library")
      }}>
        <BiLibrary color={location.pathname === "/library" ? "white" : "grey"} size={18} />
        <div className={location.pathname === "/library" ? "active" : ""}>Library</div>
      </div>
    </div>
  )
}

export default BottomNav