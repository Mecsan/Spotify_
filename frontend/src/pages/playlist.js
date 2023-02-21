import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Upper from '../components/upper';
import { BsFillPlayCircleFill, BsThreeDots } from 'react-icons/bs'
import SongTable from '../components/SongTable';
import toast from 'react-hot-toast';
import { playlist, playlist as some } from '../config/api'
import { PlaylistContext } from '../context/playlist';
import { ActiveContext } from '../context/active';
import { AuthContext } from '../context/auth';
import PlayListForm from '../components/form';

function Playlist() {

  let { dispatch, currPlayList } = useContext(PlaylistContext)
  let { token } = useContext(AuthContext);
  let { dispatch: setactive } = useContext(ActiveContext)

  let { id } = useParams();
  let travers = useNavigate();

  let [isform, setform] = useState(false);
  const [hasPermission, setpermission] = useState(false);

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
      const option = {};
      if (token) {
        option['headers'] = { "authorization": "berear " + token }
      }
      let res = await fetch(playlist + id, option)
      let data = await res.json();
      setpermission(data.permission);
      dispatch({ type: "SET_CURR_PLAYLIST", data: data.playlists })
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

  return (
    <div className="right">
      <div className="details">
        {
          currPlayList ? <>

            <Upper
              item={currPlayList}
              hasPermission={hasPermission}
              setform={setform}
            />

            <div className="play_option">
              < BsFillPlayCircleFill color='#43b943' size={50} onClick={playPlaylist} />

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
                      <div onClick={() => setform(true)}>Edit playlist</div>
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
              isform && <PlayListForm setform={setform} item={currPlayList} extra={update} />
            }
          </> : null


        }

      </div>

    </div>
  )
}

export default Playlist