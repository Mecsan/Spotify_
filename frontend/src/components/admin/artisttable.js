import React from 'react'
import { artist, image } from '../../config/api'
import { MdDeleteOutline } from 'react-icons/md'
import { FaUserEdit } from 'react-icons/fa'
import { useContext } from 'react'
import { AuthContext } from '../../context/auth'
import { AdminContext } from '../../context/admincontent'
import toast from 'react-hot-toast'
import { delete_ } from '../../services/artist'


function ArtissTable({ artists, edit }) {

  const { token } = useContext(AuthContext);
  const { dispatch } = useContext(AdminContext);

  const deleteArtist = async (key) => {
    let ans = window.confirm("are u sure wanted to delete?");
    if (ans == false) return;
    let tid = toast.loading("deleting artist...")
    let {res,data} = await delete_(key,token);
    if (!res.ok) {
      toast.error("something went wrong", { id: tid });
      return;
    }
    dispatch({ type: "DELETE_ARTIST", data: key });
    toast.success("artist deleted successfully",{ id: tid });
  }
  return (
    <div className="table" >
      {
        artists.map((artist, id) => {
          return (
            <div className="song_row">
              <span>{id + 1}</span>
              <div className='small_song t_name'>
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