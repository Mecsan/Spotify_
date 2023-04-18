import React from 'react'
import { useEffect } from 'react';
import { useContext } from 'react';
import { BsThreeDots, BsFillPlayCircleFill } from 'react-icons/bs'
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import PlayListForm from '../../components/form';
import { AdminContext } from '../../context/admincontent';
import { PlaylistContext } from '../../context/playlist';
import { image } from '../../config/api';
import SongTable from '../../components/admin/songtable';
import toast from 'react-hot-toast';
import { RotatingLines } from 'react-loader-spinner';
import usePlaylist from '../../hooks/usePlaylist';
import countTime from '../../helper/countTime';

function Playlist() {

  let { id } = useParams();
  const { dispatch: playlistdispathc, currPlayList } = useContext(PlaylistContext);
  const { dispatch } = useContext(AdminContext);
  const { update, changeVis, delete_, get, removeSong } = usePlaylist();

  const [isform, setform] = useState(false);
  const [load, setload] = useState(true);

  const travers = useNavigate();
  let fethcPlayListInfo = async () => {
    setload(true);
    let data = await get(id);
    setload(false);
    playlistdispathc({ type: "SET_CURR_PLAYLIST", data: data.playlists });
  }

  useEffect(() => {
    fethcPlayListInfo()
  }, [id])

  const changeVisible = async () => {
    let data = await changeVis(id, currPlayList.isPrivate ? "false" : "true");
    playlistdispathc({ type: 'SET_PRIVATE', data });
    toast.success(`${currPlayList.name} is now ${currPlayList.isPrivate ? "Public" : "Private"}`)
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
      setform(false);
      playlistdispathc({ type: "SET_CURR_PLAYLIST", data });
      dispatch({ type: "UPDATE_PLAYLIST", data: data })
    }
  }

  const deletePlaylist = async () => {
    let tid = toast.loading("deleting...")
    let data = await delete_(id)
    toast.success("Delted successfully", { id: tid })
    dispatch({ type: "DELETE_PlAYLIST", data: data.msg });
    travers('/dashboard/playlists');
  }
  const removeFrom = async (key) => {
    let tid = toast.loading("removing song ...")
    const res = await removeSong(id, key);
    if (res.ok) {
      playlistdispathc({ type: "REMOVE_SONG", data: key })
      toast.success("Removed successfully", { id: tid });
    }
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
                        update={updatePlaylist} />
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

                    {currPlayList.songs ? <SongTable removeFrom={removeFrom} songs={currPlayList.songs} /> : null}

                  </> : null

              }
            </>
        }
      </div>
    </div>
  )
}

export default Playlist