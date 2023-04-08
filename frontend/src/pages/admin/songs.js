import React from 'react'
import { useContext } from 'react';
import { useState } from 'react'
import { BsMusicNoteBeamed } from 'react-icons/bs'
import { MdOutlineAddCircleOutline } from 'react-icons/md'
import { AdminContext } from '../../context/admincontent';
import SongForm from '../../components/admin/songform';
import SongTable from '../../components/admin/songtable';

function Songs() {
  const [form, setform] = useState(false);
  const [active, setactive] = useState(null);

  const editSong = (item) => {
    setform(true);
    setactive(item);
  }
  const { songs } = useContext(AdminContext);
  return (
    <div className="right">
      <div className="songstabel details">

        <div className="user_head">

          <div className="title">
            <BsMusicNoteBeamed />
            <span>Songs</span>
          </div>

          <div className="add-user" onClick={() => {
            setactive(null);
            setform(true)
          }}>
            <MdOutlineAddCircleOutline color='white' />
            Add new song
          </div>
        </div>

        {songs.length ? <SongTable songs={songs} edit={editSong} /> : null}

        {form ? <SongForm item={active} setform={setform} /> : null}

      </div>
    </div>
  )
}

export default Songs