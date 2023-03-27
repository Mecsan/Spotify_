import React from 'react'
import { artist, image } from '../../config/api'
import { MdDeleteOutline } from 'react-icons/md'
import { FaUserEdit } from 'react-icons/fa'
import { useContext } from 'react'
import { AuthContext } from '../../context/auth'
import { AdminContext } from '../../context/admincontent'
import toast from 'react-hot-toast'


function ArtissTable({ artists, edit }) {

  const { token } = useContext(AuthContext);
  const { dispatch } = useContext(AdminContext);

  const playThis = () => {

  }

  const deleteArtist = async (key) => {
    let res = await fetch(artist + key, {
      method: "DELETE",
      headers: {
        "authorization": "berear " + token,
      }
    })

    if (!res.ok) {
      toast.error("something went wrong");
      return;
    }

    let data = await res.json();
    dispatch({ type: "DELETE_ARTIST", data: key });
    toast.success("artist deleted successfully");
  }
  return (
    <div className="table" >

      <div className="head_row">
        <span>#</span>
        <span className='t_name'>artist</span>
        <span>option</span>
      </div>

      {
        artists.map((artist, id) => {
          return (
            <div className="song_row">
              <span>{id + 1}</span>
              <div className='small_song t_name' onClick={playThis}>
                <img src={image + artist.logo} />
                <span>
                  {artist.name}
                </span>
              </div>
              <div className='user-option'>
                <div className="dlt" onClick={() => { deleteArtist(artist._id) }}>
                  <MdDeleteOutline />
                </div>
                <div className="up" onClick={() => { edit(artist) }}>
                  <FaUserEdit />
                </div>
              </div>

            </div>
          )
        })
      }

    </div>
  )
}

export default ArtissTable