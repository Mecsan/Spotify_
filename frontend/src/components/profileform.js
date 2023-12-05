import React, { useEffect, useRef } from 'react'
import { useContext } from 'react';
import { useState } from 'react';
import Avatar from 'react-avatar';
import toast from 'react-hot-toast';
import { MdOutlineClose } from 'react-icons/md'
import { RiImageEditLine } from 'react-icons/ri'
import { image as imgapi, profile } from '../config/api';
import { AuthContext } from '../context/auth';
import useUpload from '../hooks/useUpload';
import { update } from '../services/auth';

function ProfileForm({ close, item }) {

    let imageInput = useRef(null);

    const [name, setname] = useState(item.name);
    const [file, setfile] = useState(null)
    const { token, dispatch } = useContext(AuthContext);

    const { error, loading, progress, url } = useUpload('image', file);

    const getImage = (e) => {
        setfile(e.target.files[0]);
    }

    let clickInput = () => {
        if (loading) return;
        imageInput.current.click();
    }

    useEffect(() => {
        if (error) {
            toast.error(error.message);
        }
    }, [error])

    const updateProfile = async () => {

        if (loading) {
            toast.error("Please wait ,logo is uploading");
            return;
        }
        if (name == "") {
            toast.error("invalid name")
            return;
        }

        const tid = toast.loading("updating profile", {
            duration: 100000
        });
        let form = {
            name,
            logo: url
        }
        let { data } = await update(token, form);
        if (data.success == false) {
            toast.error(data.msg, { id: tid, duration: 3000 });
        } else {
            toast.success("updated successfully", { id: tid, duration: 3000 });
            dispatch({ type: "SET_USER", data })
            close(false);
        }
    }
    return (
        <div className="overlay" onClick={(e) => {
            if (e.target.classList.contains("overlay")) {
                close(false);
            }
        }}>
            <div className="playlist_form">
                <div className='head'>
                    <h3>Edit details</h3>
                    <div className="close_form" onClick={() => close(false)}>
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
                                    {
                                        item.logo ?
                                            <img src={item.logo} />
                                            :
                                            <Avatar name={name} size={"100%"} />
                                    }
                                </> :
                                <img src={url} />
                        }
                    </div>
                    <div className='input'>
                        <input type='text' placeholder='name' value={name} onChange={(e) => setname(e.target.value)} />
                        <input accept='image/png,image/jpg,image/jpeg' ref={imageInput} name='image' type="file" hidden onChange={getImage} />
                    </div>
                </div>

                <div className="submit" onClick={updateProfile}>Update </div>
            </div>
        </div>
    )
}

export default ProfileForm