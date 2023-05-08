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
import Loading from '../components/loader';
import usePlaylist from '../common/usePlaylist';
import countTime from '../helper/countTime';
function Playlist() {

  let { dispatch, currPlayList, isOwn, isliked: checkLike, playlists } = useContext(PlaylistContext)

  let { token } = useContext(AuthContext);
  let { dispatch: setactive } = useContext(ActiveContext);
  let { update, delete_, get, removeSong, changeVis } = usePlaylist();

  let { id } = useParams();
  let travers = useNavigate();

  let [isform, setForm] = useState(false);
  const [load, setload] = useState(true);
  const [hasPermission, setpermission] = useState(false);

  const [islike, setlike] = useState(false);

  useEffect(() => {
    setlike(checkLike(id))
  }, [playlists, id])

  const removeFrom = async (key) => {
    let tid = toast.loading("removing song ...")
    const res = await removeSong(id, key);
    if (res.ok) {
      dispatch({ type: "REMOVE_SONG", data: key })
      toast.success("Removed successfully", { id: tid });
    }
  }

  useEffect(() => {

    let fethcPlayListInfo = async () => {
      setload(true);
      const data = await get(id);
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
    setactive({ type: "SET_ACTIVE", data: 0 });
  }

  const changeVisible = async () => {
    let data = await changeVis(id, currPlayList.isPrivate ? "false" : "true");
    dispatch({ type: 'SET_PRIVATE', data});
    toast.success(`${currPlayList.name} is now ${currPlayList.isPrivate ? "Public" : "Private"}`)
  }

  const deletePlaylist = async () => {
    let tid = toast.loading("deleting...")
    const data = await delete_(id);
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


  const openForm = () => {
    if (hasPermission) {
      setForm(true);
    }
  }

  const updatePlaylist = async (form) => {
    const tid = toast.loading("updating task", {
      duration: 100000
    });
    const data = await update(currPlayList._id, form);
    if (data.success == false) {
      toast.error(data.msg, { id: tid, duration: 3000 });
    } else {
      toast.success("updated successfully", { id: tid, duration: 3000 });
      setForm(false);
      dispatch({ type: "SET_CURR_PLAYLIST", data });
      dispatch({ type: "UPDATE_PLAYLIST", data: data })
    }
  }

  return (
    <div className="right">
      <div className="details">
        <Loading load={load}>
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
                          <div onClick={openForm}>Edit playlist</div>
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
                  isform && <PlayListForm
                    setform={setForm}
                    item={currPlayList}
                    update={updatePlaylist} />
                }
              </> : null
            }
          </>
        </Loading>
      </div>

    </div >
  )
}

export default Playlist