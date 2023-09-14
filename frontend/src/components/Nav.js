import React, { useContext, useEffect } from 'react'
import { MdHomeFilled } from 'react-icons/md'
import { FiSearch } from 'react-icons/fi'
import { SiAddthis } from 'react-icons/si'
import { BsHeart } from 'react-icons/bs'
import { BiLibrary } from 'react-icons/bi'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { PlaylistContext } from '../context/playlist'
import toast from 'react-hot-toast'
import { AuthContext } from '../context/auth'
import { add } from '../services/playlist'
function Nav() {

  let location = useLocation();
  let traverse = useNavigate();
  const { playlists, dispatch } = useContext(PlaylistContext);
  const { token } = useContext(AuthContext)

  const addPlaylist = async () => {
    if (token == null) {
      toast.error("Login to continue");
      return;
    }
    const body = {
      name: "playlist " + (playlists.length + 1)
    }
    let { data } = await add(token, JSON.stringify(body));
    dispatch({ type: "ADD_PLAYLIST", data: data })
    toast.success("Playlist added");
  }

  const navigate = (str) => {
    traverse(str);
  }

  return (
    <div className="left">
      <div className="nav">
        <div className="logo" onClick={() => navigate("/")}>
          <img src="/assests/logo.png" />
        </div>
        <div className="links">
          <div className="link">
            <MdHomeFilled color='grey' size={20} />
            <Link to='/' className={location.pathname === "/" ? "active" : ""}>Home</Link>
          </div>
          <div className="link">
            <FiSearch color='grey' size={20} />
            <Link to='/search' className={location.pathname === "/search" ? "active" : ""}>Search</Link>
          </div>
          <div className="link">
            <BiLibrary color='grey' size={20} />
            <div onClick={() => {
              if (token == null) {
                toast.error("Login to continue");
                return;
              }
              navigate("library")
            }} className={location.pathname === "/library" ? "active" : ""}>your library</div>
          </div>
        </div>
        <div className="option">

          <div className="link" onClick={addPlaylist}>
            <SiAddthis color='grey' size={20} />
            <div>Create Playlist</div>
          </div>
          <div className="link">
            <BsHeart color='grey' size={20} />
            <div onClick={() => {
              if (token == null) {
                toast.error("Login to continue");
                return;
              }
              navigate("liked")
            }} className={location.pathname === "/liked" ? "active" : ""}>Liked songs</div>
          </div>
        </div>

        <hr />
        <div className="playlists">
          {
            playlists?.length && playlists.map((play) => {
              return <div key={play._id} className="list">
                <Link to={`/playlist/${play._id}`} className={
                  location.pathname === "/playlist/" + play._id ?
                    'active' : ""
                }>{play.name}</Link>
              </div>
            })
          }
        </div>
      </div>
    </div >

  )
}

export default Nav