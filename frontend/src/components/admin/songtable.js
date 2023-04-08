import React from 'react'
import { BiTimeFive } from 'react-icons/bi'
import { MdDeleteOutline } from 'react-icons/md'
import { FaUserEdit } from 'react-icons/fa'
import { image, song } from '../../config/api'
import { useContext } from 'react'
import { AdminContext } from '../../context/admincontent'
import { AuthContext } from '../../context/auth'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { BsThreeDots, BsFillCaretRightFill } from 'react-icons/bs'
import Options from '../options'
import { useLocation, useNavigate, useParams } from 'react-router-dom'


function SongTable({ songs, edit = null }) {

  const navigate = useNavigate();

  const { playlists, dispatch } = useContext(AdminContext);
  const { token } = useContext(AuthContext)

  const [isoption, setoption] = useState(-1);

  const { id: pid } = useParams();

  const deleteSong = async (key) => {
    let ans = window.confirm("are u sure wanted to delete?");
    if (ans == false) return;
    let tid = toast.loading("deleting song...");
    let res = await fetch(song + key, {
      method: "DELETE",
      headers: {
        "authorization": "berear " + token
      }
    })
    if (res.ok) {
      dispatch({ type: "DELETE_SONG", data: key })
      toast.success("song deleleted", { id: tid });
    } else {
      toast.error("something went wrong", { id: tid })
    }

  }

  const playThis = () => {

  }
  return (
    <div className="table" >


      {
        songs.map((song, id) => {
          return (
            <div key={id} className="song_row" onMouseLeave={() => setoption(-1)}>
              <span>{id + 1}</span>
              <div className='small_song t_name' onClick={playThis}>
                <img src={image + song?.image} />
                <span>
                  {song.name}
                  <div className="small_artist">{song.artist.name}</div>
                </span>
              </div>
              <div className='t_artist' onClick={() => {
                navigate("/artist/" + song.artist._id)
              }}>
                <span>
                  {song.artist.name}
                </span>
              </div>
              <div>
                {isNaN(song.duration / 60) ? 0 : (song.duration / 60).toFixed(2)}
              </div>
              <div className='user-option'>
                {
                  edit != null ?
                    <>
                      <div className="dlt" onClick={() => { deleteSong(song._id) }}>
                        <MdDeleteOutline />
                      </div>
                      <div className="up" onClick={() => { edit(song) }}>
                        <FaUserEdit />
                      </div>
                    </> : null
                }
              </div>
              <div className="playlist_option">

                <BsThreeDots onClick={(e) => {
                  setoption(id)
                }} />

                {
                  isoption == id && playlists?.length ?
                    < div className="options">
                      <div className='addTolist'>
                        add to playlist <BsFillCaretRightFill />
                        <Options
                          id={song._id}
                          setoption={setoption}
                          playlists={playlists}
                          cuurentPid={pid}
                        />
                      </div>
                    </div>
                    : ""
                }
              </div>
            </div>
          )
        })
      }

    </div>
  )
}

export default SongTable