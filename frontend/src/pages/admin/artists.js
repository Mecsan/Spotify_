import React from 'react'
import { useContext } from 'react';
import { useState } from 'react'
import { AdminContext } from '../../context/admincontent';
import { FaUserFriends } from 'react-icons/fa';
import { MdOutlineAddCircleOutline } from 'react-icons/md'
import ArtissTable from '../../components/admin/artisttable';
import ArtistForm from '../../components/admin/artistform';



function Artists() {

  const { artists, dispatch } = useContext(AdminContext);

  const [form, setform] = useState(false);
  const [active, setactive] = useState(null);

  const EditUser = (artist) => {
    setactive(artist);
    setform(true);
  }

  return (
    <div className="right">
      <div className="details artistTbale">
        <div className="user_head">

          <div className="title">
            <FaUserFriends />
            <span>Artists</span>
          </div>

          <div className="add-user" onClick={() => {
            setactive(null);
            setform(true)
          }}>
            <MdOutlineAddCircleOutline color='white' />
            Add new artist
          </div>
        </div>

        {artists.length ? <ArtissTable artists={artists} edit={EditUser} /> : null}

        {form ? <ArtistForm setform={setform} item={active} /> : null}

      </div>
    </div>
  )
}

export default Artists