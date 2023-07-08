import React from 'react'
import { IoChevronBackCircleSharp } from 'react-icons/io5';
import { IoIosArrowDroprightCircle } from 'react-icons/io'
import { useContext } from 'react';
import { AuthContext } from '../context/auth';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'

function Header() {
  let { isload, user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="header">
      <div className="btns">
        <div className="lft-btn" onClick={() => navigate(-1)}>
          <IoChevronBackCircleSharp size={40} color="white" />
        </div>
        <div className="rht-btn" onClick={() => navigate(1)}>
          <IoIosArrowDroprightCircle size={40} color="white" />
        </div>
      </div>
      <div className="min-logo" onClick={() => navigate("/")}>
        <img src='/assests/logo.png' />
      </div>
      <div className="ins">
        {
          !isload &&
          <>
            {
              user ? <div className="profile_btn" >
                {user.name}
                <div className="profile_modal">
                  {/* <div>Profile</div> */}
                  <div onClick={() => {
                    dispatch({ type: "LOGOUT" });
                    navigate("/");
                    localStorage.removeItem('spoti');
                    toast.success("Logout successfullly");
                  }}>Logout</div>
                  <div onClick={() => {
                    navigate("/profile")
                  }}>Profile</div>
                  {user.isAdmin && <div onClick={() => navigate("/dashboard")}>Dashboard</div>}
                </div>
              </div> :
                <>
                  <Link
                    className="sign" to="signup">Sign up</Link>
                  <Link className="log" to="signin">Log in</Link>
                </>
            }

          </>
        }
      </div>
    </div>
  )
}

export default Header