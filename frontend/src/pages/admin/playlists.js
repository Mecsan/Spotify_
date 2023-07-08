import React from 'react'
import { useContext } from 'react'
import { BsMusicNoteBeamed } from 'react-icons/bs'
import { MdOutlineAddCircleOutline } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { image, playlist } from '../../config/api'
import { ActiveContext } from '../../context/active'
import { AdminContext } from '../../context/admincontent'
import { AuthContext } from '../../context/auth'
import { BsFillPlayCircleFill } from 'react-icons/bs'
import toast from 'react-hot-toast'

function Playlists() {

    const navigate = useNavigate();

    const { dispatch: active } = useContext(ActiveContext)

    const fetchSongs = async (item) => {
        let res = await fetch(playlist + item._id);
        let data = await res.json();
        if (data?.playlists?.songs?.length) {

            active({ type: "SET_LIST", data: data.playlists.songs })
            active({ type: "SET_ACTIVE", data: 0 })
        } else {
            toast.error("no songs in playlist");
        }
    }

    const { token } = useContext(AuthContext);
    const { dispatch, playlists } = useContext(AdminContext)

    const addPlayList = async () => {
        let res = await fetch(playlist + "/admin", {
            method: "POST",
            headers: {
                "authorization": "berear " + token
            }
        })

        let data = await res.json();
        if (res.ok) {
            dispatch({ type: "ADD_PlAYLIST", data });
            toast.success("playlist added");
            navigate("/dashboard/playlist/" + data._id)
        }
    }
    return (
        <div className="right">
            <div className="details">

                <div className="user_head">

                    <div className="title">
                        <BsMusicNoteBeamed />
                        <span>Playlists</span>
                    </div>

                    <div className="add-user" onClick={() => {
                        addPlayList()
                    }}>
                        <MdOutlineAddCircleOutline color='white' />
                        Add new playlist
                    </div>
                </div>

                <div className="songs_container full">
                    {
                        <div className="songs">
                            {
                                playlists.map((item, idx) => {
                                    return (
                                        <div className="song" onClick={() => { navigate("/dashboard/playlist/" + item._id) }}>
                                            <img src={image + item?.image} alt="" />
                                            <div className="name">{item?.name}</div>
                                            <div className="desc">{
                                                item?.desc.length < 30 ? item?.desc : item?.desc.substr(0, 30) + "..."
                                            }</div>
                                            <div className="play_hidden" onClick={(e) => {
                                                fetchSongs(item);
                                                e.stopPropagation();
                                            }}>
                                                <BsFillPlayCircleFill color='#43b943' size={40} />
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    }
                </div>


            </div>
        </div>
    )
}

export default Playlists