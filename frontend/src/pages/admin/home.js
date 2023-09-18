import React from 'react'
import { useContext } from 'react'
import { BsMusicNoteBeamed } from 'react-icons/bs'
import { FaUserFriends } from 'react-icons/fa'
import { MdPerson } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { AdminContext } from '../../context/admincontent'

function DashHome() {
  const { songs, users, artists,playlists } = useContext(AdminContext)
  return (
    <div className="right">
      <div className="details">
        <div className="icon-links">

          <Link to="songs" className="icon-link">
            <BsMusicNoteBeamed size={30} />
            <span> {songs.length} Songs</span>
          </Link>

          <Link to="users" className="icon-link">
            <FaUserFriends size={30} />
            <span>{users.length} Users</span>
          </Link>

          <Link to="artists" className="icon-link">
            <MdPerson size={30} />
            <span>{artists.length} Artists</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default DashHome