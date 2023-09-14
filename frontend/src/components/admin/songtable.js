import React from 'react'
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
import { useNavigate, useParams } from 'react-router-dom'
import { ActiveContext } from '../../context/active'
import { delete_ } from '../../services/song'


function SongTable({ songs, removeFrom, edit = null }) {

  const { playlists, dispatch } = useContext(AdminContext);
  const { token } = useContext(AuthContext)
  const { dispatch: setactive } = useContext(ActiveContext)
  const [isoption, setoption] = useState(-1);

  const { id: pid } = useParams();

  const deleteSong = async (key) => {
    let ans = window.confirm("are u sure wanted to delete?");
    if (ans == false) return;
    let tid = toast.loading("deleting song...");
    let { res } = await delete_(key, token);
    if (res.ok) {
      dispatch({ type: "DELETE_SONG", data: key })
      toast.success("song deleleted", { id: tid });
    } else {
      toast.error("something went wrong", { id: tid })
    }
  }
  const playThis = (id) => {
    setactive({ type: "SET_ACTIVE", id });
    setactive({ type: "SET_LIST", songs });
  }
  return (
    <div className="table" >
      {
        songs.map((song, id) => {
          return (
            <div key={id} className="song_row" onMouseLeave={() => setoption(-1)}>
              <span>{id + 1}</span>
              <div className='small_song t_name' onClick={() => playThis(id)}>
                <img src={image + song?.image} />
                <span>
                  {song.name}
                  <div className="small_artist">{song.artist.name}</div>
                </span>
              </div>
              <div className='t_artist'>
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
                      {edit == null ? <div onClick={() => {
                        removeFrom(song._id)
                      }}>remove from this playlist</div> : null}
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