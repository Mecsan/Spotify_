import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';
import { MdOutlineClose } from 'react-icons/md'
import { RiImageEditLine } from 'react-icons/ri'
import { image as imgapi } from '../config/api';

function PlayListForm({ setform, item, update }) {
  let [name, setname] = useState("");
  let [desc, setdesc] = useState("");

  useEffect(() => {
    setdesc(item.desc);
    setname(item.name)
  }, [])

  //image choosen by user
  let [image, setimage] = useState(null);
  let [file, setfile] = useState("");
  let imageInput = useRef(null);

  const getImage = (e) => {
    setfile(e.target.files[0]);
    let src = URL.createObjectURL(e.target.files[0]);
    setimage(src);
  }

  const handleSubmit = () => {
    if (name == "") {
      toast.error("invalid name")
      return;
    }

    let form = new FormData();
    form.append('name', name);
    form.append("desc", desc);
    form.append("image", file);

    update(form);
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

        <div className="submit" onClick={handleSubmit}>Update </div>
      </div>
    </div>
  )
}

export default PlayListForm