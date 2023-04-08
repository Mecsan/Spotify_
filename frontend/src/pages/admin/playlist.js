import React from 'react'
import { useEffect } from 'react';
import { useContext } from 'react';
import { BsThreeDots, BsFillPlayCircleFill } from 'react-icons/bs'
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import PlayListForm from '../../components/form';
import { AdminContext } from '../../context/admincontent';
import { PlaylistContext } from '../../context/playlist';
import { image, playlist } from '../../config/api';
import SongTable from '../../components/admin/songtable';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/auth';
import { RotatingLines } from 'react-loader-spinner';

function Playlist() {
  let countTime = (songs) => {
    let time = 0;
    songs?.forEach(like => {
      time += parseInt(like?.duration)
    });
    return (time / 60).toFixed(2)
  }

  let { id } = useParams();
  const { dispatch: playlistdispathc, currPlayList } = useContext(PlaylistContext);
  const { dispatch } = useContext(AdminContext);
  const { token } = useContext(AuthContext)

  const [isform, setform] = useState(false);
  const [load, setload] = useState(true);

  const travers = useNavigate();
  let fethcPlayListInfo = async () => {
    setload(true);
    let res = await fetch(playlist + id);
    let data = await res.json();
    if (res.ok) {
      playlistdispathc({ type: "SET_CURR_PLAYLIST", data: data.playlists });
    }
    setload(false);
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
          load ? <div className="center">
            <RotatingLines
              strokeColor="green"
              strokeWidth="5"
              animationDuration="0.75"
              width="45"
              visible={true}
            />
          </div> :
            <>

              {
                currPlayList ?
                  <>
                    <div className="playlist_cont pointer">
                      <div className="playlist_img" onClick={setform}>
                        <img src={image + currPlayList.image} />
                      </div>
                      <div className="playlist_info">
                        <span>
                          playlist
                        </span>
                        <h1 onClick={setform}>
                          {currPlayList?.name}
                        </h1>
                        {currPlayList?.desc ? <div className="playlist_desc" onClick={setform}>
                          {currPlayList?.desc}
                        </div> : null}

                        <div className="playlist_extra">
                          <span onClick={() => {
                            travers("/user/" + currPlayList.user._id);
                          }}>{currPlayList?.user?.name}</span>
                          <span>{currPlayList?.createdAt?.substr(0, 4)}</span>
                          <span>{currPlayList?.songs?.length} songs</span>
                          <span> {countTime(currPlayList.songs)}</span>
                        </div>
                      </div>
                    </div>

                    {
                      isform && <PlayListForm
                        setform={setform}
                        item={currPlayList}
                        extra={update} />
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
            </>
        }
      </div>
    </div>
  )
}

export default Playlist