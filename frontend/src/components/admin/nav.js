import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaUserFriends } from 'react-icons/fa'
import { MdDashboard } from 'react-icons/md'
import { BsMusicNoteBeamed } from 'react-icons/bs'
import { MdPerson } from 'react-icons/md'
import { BiLibrary } from 'react-icons/bi'

function DashNav() {
    const navigate = useNavigate();
    const location = useLocation();
    return (
        <div className="left">

            <div className="dash-nav">

                <div className="logo" onClick={() => navigate("/")}>
                    <img src='/assests/logo.png' />
                </div>

                <div className="dash-links">
                    <div className={location.pathname == "/dashboard" ? "dash-link active" : "dash-link"}>
                        <MdDashboard color='white' />
                        <Link to="" >home</Link>
                    </div>
                    <div className={location.pathname == "/dashboard/users" ? "dash-link active" : "dash-link"} >
                        <FaUserFriends color='white' />
                        <Link to="users" >users</Link>
                    </div>
                    <div className={location.pathname == "/dashboard/songs" ? "dash-link active" : "dash-link"} >
                        <BsMusicNoteBeamed color='white' />
                        <Link to="songs" >songs</Link>
                    </div>
                    <div className={location.pathname == "/dashboard/artists" ? "dash-link active" : "dash-link"}>
                        <MdPerson color='white' />
                        <Link to="artists" >artists</Link>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default DashNav