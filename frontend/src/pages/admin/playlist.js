import React from 'react'
import { useEffect } from 'react';
import { useContext } from 'react';
import { BsThreeDots, BsFillPlayCircleFill } from 'react-icons/bs'

import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import PlayListForm from '../../components/form';
import Upper from '../../components/upper';
import { AdminContext } from '../../context/admincontent';
import { PlaylistContext } from '../../context/playlist';
import { playlist } from '../../config/api';
import SongTable from './songtable';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/auth';

function Playlist() {

  let { id } = useParams();
  const { dispatch: playlistdispathc, currPlayList } = useContext(PlaylistContext);
  const { dispatch } = useContext(AdminContext);
  const { token } = useContext(AuthContext)

  const [isform, setform] = useState(false);

  const travers = useNavigate();


  let fethcPlayListInfo = async () => {
    let res = await fetch(playlist + id);
    let data = await res.json();
    if (res.ok) {
      playlistdispathc({ type: "SET_CURR_PLAYLIST", data: data.playlists });
    }
  }

  const update = (data) => {
    dispatch({ type: "UPDATE_PLAYLIST", data: data });
  }

  useEffect(() => {
    fethcPlayListInfo()
  }, [id])

  const changeVisible = async () => {
    let res = await fetch(playlist + (currPlayList.isPrivate ? "public/" : "private/") + id, {
      headers: {
        'authorization': "berear " + token
      }
    });
    let data = await res.json();
    playlistdispathc({ type: 'SET_PRIVATE', data: currPlayList.isPrivate ? false : true });
    toast.success(`${currPlayList.name} is now ${currPlayList.isPrivate ? "Public" : "Private"}`)
  }

  const deletePlaylist = async () => {
    let tid = toast.loading("deleting...")
    let res = await fetch(playlist + id, {
      method: "DELETE",
      headers: { "authorization": "berear " + token }
    })
    let data = await res.json();
    toast.success("Delted successfully", { id: tid })
    dispatch({ type: "DELETE_PlAYLIST", data: data.msg });
    travers('/dashboard/playlists');
  }

  return (
    <div className="right">
      <div className="details">
        {
          currPlayList ?
            <>
              <Upper
                item={currPlayList}
                hasPermission={true}
                setform={setform}
              />

              {
                isform && <PlayListForm setform={setform} item={currPlayList} extra={update} />
              }

              <div className="play_option">
                < BsFillPlayCircleFill color='#43b943' size={50} onClick={() => { }} />
                <>
                  <div className="play_">

                    <BsThreeDots size={35} />
                    <div className="options_">
                      <div onClick={changeVisible}>
                        {
                          currPlayList?.isPrivate ? "Make Public" : "Make Private"
                        }
                      </div>
                      <div onClick={() => setform(true)}>Edit playlist</div>
                      <div onClick={deletePlaylist}>Delele this playlist</div>
                    </div>
                  </div>
                  <div>{
                    currPlayList?.isPrivate ? "Private" : "Public"
                  }
                  </div>
                </>
              </div>

              {currPlayList.songs ? <SongTable songs={currPlayList.songs} /> : null}

            </> : null

        }
      </div>
    </div>
  )
}

export default Playlist