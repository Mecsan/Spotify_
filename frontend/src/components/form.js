import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';
import { MdOutlineClose } from 'react-icons/md'
import { RiImageEditLine } from 'react-icons/ri'
import { image as imgapi } from '../config/api';
import useUpload from '../hooks/useUpload';

function PlayListForm({ setform, item, update }) {
  let [name, setname] = useState(item.name);
  let [desc, setdesc] = useState(item.desc);
  let [file, setfile] = useState(null);

  let imageInput = useRef(null);
  const { error, loading, progress, url } = useUpload('image', file);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error])

  let clickInput = () => {
    if (loading) return;
    imageInput.current.click();
  }

  const getImage = (e) => {
    setfile(e.target.files[0]);
  }

  const handleSubmit = () => {
    if (loading) {
      toast.error("Please wait, image is uploading");
      return;
    }
    if (name == "") {
      toast.error("invalid name")
      return;
    }

    let body = {
      name,
      desc,
      image: url
    }

    update(body);
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
            <div className={loading ? "image_overlay upload_load" : "image_overlay"} onClick={clickInput}>
              {
                loading ? <div className="progress">
                  <div className="progress-val">
                    {progress + "%"}
                  </div>
                  <div className="progress-bar" style={{ width: progress + "%" }}></div>
                </div> :
                  <>
                    <RiImageEditLine size={50} />
                    <span>Choose image</span>
                  </>
              }
            </div>
            {
              url == null ?
                <>
                  <img src={item.image} />
                </> :
                <img src={url} />
            }
          </div>
          <div className='input'>
            <input type='text' placeholder='name' value={name} onChange={(e) => setname(e.target.value)} />
            <textarea placeholder='enter description' value={desc} onChange={(e) => setdesc(e.target.value)} />
            <input accept='image/png,image/jpg,image/jpeg' ref={imageInput} name='image' type="file" hidden onChange={getImage} />
          </div>
        </div>

        <div className="submit" onClick={handleSubmit}>Update </div>
      </div>
    </div>
  )
}

export default PlayListForm