import React, { useContext, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';
import { MdOutlineClose } from 'react-icons/md'
import { RiImageEditLine } from 'react-icons/ri'
import { image as imgapi, playlist } from '../config/api';
import { PlaylistContext } from '../context/playlist';

function PlayListForm({ setform, item, extra = () => { } }) {

  let { dispatch } = useContext(PlaylistContext)

  let [name, setname] = useState("");
  let [desc, setdesc] = useState("");

  useEffect(() => {
    setdesc(item.desc);
    setname(item.name)
  }, [])

  // link of image choosen by user
  let [image, setimage] = useState(null);
  let [file, setfile] = useState("");
  let imageInput = useRef(null);

  const getImage = (e) => {
    setfile(e.target.files[0]);
    let src = URL.createObjectURL(e.target.files[0]);
    setimage(src);
  }

  const updatePlaylist = async () => {

    const tid = toast.loading("updating task", {
      duration: 100000
    });
    let form = new FormData();
    form.append('name', name);
    form.append("desc", desc);
    form.append("image", file);

    let res = await fetch(playlist + item._id, {
      method: "PUT",
      headers: {
        "authorization": "berear " + localStorage.getItem('spoti')
      },
      body: form
    });
    let data = await res.json();
    if (data.success == false) {
      toast.error(data.msg, { id: tid,duration:3000 });
    } else {
      toast.success("updated successfully", { id: tid ,duration:3000});
      setform(false);
      dispatch({ type: "SET_CURR_PLAYLIST", data });
      extra(data);
    }
  }

  return (
    <div className="overlay" onClick={(e) => {
      if (e.target.classList.contains("overlay")) {
        setform(false);
      }
    }}>
      <div className="playlist_form">
        <div className='head'>
          <h3>Edit details</h3>
          <div className="close_form" onClick={() => setform(false)}>
            <MdOutlineClose color='white' size={27} />
          </div>
        </div>

        <div className='body'>
          <div className='image'>
            <div className="image_overlay" onClick={() => imageInput.current.click()}>
              <RiImageEditLine size={50} />
              <span>Choose image</span>
            </div>
            {
              image == null ?
                <>
                  <img src={imgapi + item.image} />
                </> :
                <img src={image} />
            }
          </div>
          <div className='input'>
            <input type='text' placeholder='name' value={name} onChange={(e) => setname(e.target.value)} />
            <textarea placeholder='enter description' value={desc} onChange={(e) => setdesc(e.target.value)} />
            <input ref={imageInput} name='image' type="file" hidden onChange={getImage} />
          </div>
        </div>

        <div className="submit" onClick={updatePlaylist}>Update </div>
      </div>
    </div>
  )
}

export default PlayListForm