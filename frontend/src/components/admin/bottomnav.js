import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { BiLibrary } from 'react-icons/bi'
import { FaUserFriends } from 'react-icons/fa'
import { MdDashboard } from 'react-icons/md'
import { BsMusicNoteBeamed } from 'react-icons/bs'
import { MdPerson } from 'react-icons/md'

function BottomNav() {

    let location = useLocation();

    const navigate = useNavigate();

    return (
        <div className="nav-bottom dash-nav-bottom" >
            <div className="link" onClick={() => navigate("")}>
                <MdDashboard color={location.pathname === "/dashboard" ? "white" : "grey"} size={18} />
                <Link to='' className={location.pathname === "/dashboard" ? "active" : ""}>Home</Link>
            </div>

            <div className="link" onClick={() => navigate("users")}>
                <FaUserFriends color={location.pathname === "/dashboard/users" ? "white" : "grey"} size={18} />
                <Link to='users' className={location.pathname === "/dashboard/users" ? "active" : ""}>Users</Link>
            </div>

            <div className="link" onClick={() => navigate("songs")}>
                <BsMusicNoteBeamed color={location.pathname === "/dashboard/songs" ? "white" : "grey"} size={16} />
                <Link to="songs" className={location.pathname === "/dashboard/songs" ? "active" : ""}>songs</Link>
            </div>

            <div className="link" onClick={() => navigate("artists")}>
                <MdPerson color={location.pathname === "/dashboard/artists" ? "white" : "grey"} size={18} />
                <div className={location.pathname === "/dashboard/artists" ? "active" : ""}>artists</div>
            </div>

            <div className="link" onClick={() => navigate("playlists")}>
                <BiLibrary color={location.pathname === "/dashboard/playlists" ? "white" : "grey"} size={18} />
                <Link to="playlists" className={location.pathname === "/dashboard/playlists" ? "active" : ""}>playlists</Link>
            </div>

        </div>
    )
}

export default BottomNav