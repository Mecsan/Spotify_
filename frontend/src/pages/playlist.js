import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BsFillPlayCircleFill, BsThreeDots } from 'react-icons/bs'
import SongTable from '../components/SongTable';
import toast from 'react-hot-toast';
import { image, playlist, playlist as some } from '../config/api'
import { PlaylistContext } from '../context/playlist';
import { ActiveContext } from '../context/active';
import { AuthContext } from '../context/auth';
import PlayListForm from '../components/form';
import { AiFillAlert, AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { RotatingLines } from 'react-loader-spinner';

function Playlist() {

  let { dispatch, currPlayList, isOwn, isliked: checkLike, playlists } = useContext(PlaylistContext)

  let { token } = useContext(AuthContext);
  let { dispatch: setactive } = useContext(ActiveContext)

  let { id } = useParams();
  let travers = useNavigate();

  let [isform, openForm] = useState(false);
  const [load, setload] = useState(true);
  const [hasPermission, setpermission] = useState(false);

  const [islike, setlike] = useState(false);

  useEffect(() => {
    setlike(checkLike(id))
  }, [playlists, id])

  const removeFrom = async (key) => {
    let res = await fetch(playlist + "/songs/" + id + "/" + key, {
      method: "DELETE",
      headers: {
        "authorization": "berear " + token
      }
    })
    let data = await res.json();
    if (res.ok) {
      dispatch({ type: "REMOVE_SONG", data: key })
      toast.success("Removed successfully");
    }
  }

  const update = (data) => {
    dispatch({ type: "UPDATE_PLAYLIST", data: data })
  }

  useEffect(() => {

    let fethcPlayListInfo = async () => {
      setload(true);
      const option = {};
      if (token) {
        option['headers'] = { "authorization": "berear " + token }
      }
      let res = await fetch(playlist + id, option)
      let data = await res.json();
      setpermission(data.permission);
      dispatch({ type: "SET_CURR_PLAYLIST", data: data.playlists })
      setload(false)
    }

    fethcPlayListInfo();

  }, [token, id])

  const playPlaylist = () => {
    if (currPlayList.songs.length == 0) {
      toast.error("playlist has no songs to play");
      return;
    }
    setactive({ type: "SET_LIST", data: currPlayList.songs });
    setactive({ type: "SET_ACTIVE", data: currPlayList.songs[0] });
  }

  const changeVisible = async () => {

    let res = await fetch(some + (currPlayList.isPrivate ? "public/" : "private/") + id, {
      headers: {
        "authorization": "berear " + token
      }
    });
    let data = await res.json();
    dispatch({ type: 'SET_PRIVATE', data: currPlayList.isPrivate ? false : true });
    toast.success(`${currPlayList.name} is now ${currPlayList.isPrivate ? "Public" : "Private"}`)
  }

  const deletePlaylist = async () => {
    let tid = toast.loading("deleting...")
    let res = await fetch(some + id, {
      method: "DELETE",
      headers: { "authorization": "berear " + token }
    })
    let data = await res.json();
    toast.success("Delted successfully", { id: tid })
    dispatch({ type: "DELETE_PLAYLIST", data: data.msg })
    travers('/');
  }

  const likePlaylist = async () => {
    let res = await fetch(playlist + "like/" + id, {
      method: "GET",
      headers: {
        "authorization": "berear " + token
      }
    });
    const data = await res.json();
    setlike(data.like);
    if (data.like) {
      dispatch({ type: "ADD_PLAYLIST", data: { like: true, ...currPlayList } });
      toast("Added to library");
    } else {
      dispatch({ type: "DELETE_PLAYLIST", data: id });
      toast("Removed from library");
    }

  }

  let countTime = (songs) => {
    let time = 0;
    songs?.forEach(like => {
      time += parseInt(like?.duration)
    });
    return (time / 60).toFixed(2)
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
                currPlayList ? <>

                  <div className={hasPermission ? "playlist_cont pointer" : "playlist_cont"
                  }>
                    <div className="playlist_img" onClick={openForm}>
                      <img src={image + currPlayList.image} />
                    </div>
                    <div className="playlist_info">
                      <span>
                        playlist
                      </span>
                      <h1 onClick={openForm}>
                        {currPlayList?.name}
                      </h1>
                      {currPlayList?.desc ? <div className="playlist_desc" onClick={openForm}>
                        {currPlayList?.desc}
                      </div> : null}

                      <div className="playlist_extra">
                        <span onClick={() => {
                          if (currPlayList.isAdmin) return;
                          travers("/user/" + currPlayList.user._id);
                        }}>{currPlayList?.isAdmin ? "✔ Spotify ✔" : currPlayList?.user?.name}</span>
                        <span>{currPlayList?.createdAt?.substr(0, 4)}</span>
                        <span>{currPlayList?.songs?.length} songs</span>
                        <span> {countTime(currPlayList.songs)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="play_option">
                    < BsFillPlayCircleFill color='#43b943' size={50} onClick={playPlaylist} />
                    {!isOwn(id) && <div className="like" onClick={likePlaylist}>
                      {
                        islike ?
                          <AiFillHeart size={30} color='green' />
                          : <AiOutlineHeart size={30} />
                      }
                    </div>}
                    {
                      hasPermission &&
                      <>
                        <div className="play_">

                          <BsThreeDots size={35} />
                          <div className="options_">
                            <div onClick={changeVisible}>
                              {
                                currPlayList?.isPrivate ? "Make Public" : "Make Private"
                              }
                            </div>
                            <div onClick={() => openForm(true)}>Edit playlist</div>
                            <div onClick={deletePlaylist}>Delele this playlist</div>
                          </div>
                        </div>
                        <div>{
                          currPlayList?.isPrivate ? "Private" : "Public"
                        }
                        </div>
                      </>
                    }
                  </div>

                  <SongTable
                    permission={hasPermission}
                    removeFrom={removeFrom}
                    songs={currPlayList.songs}
                  />

                  {
                    isform && <PlayListForm setform={openForm} item={currPlayList} extra={update} />
                  }
                </> : null


              }
            </>
        }
      </div>

    </div >
  )
}

export default Playlist