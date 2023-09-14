import React, { useRef } from 'react'
import { useContext } from 'react';
import { useState } from 'react';
import Avatar from 'react-avatar';
import toast from 'react-hot-toast';
import { MdOutlineClose } from 'react-icons/md'
import { RiImageEditLine } from 'react-icons/ri'
import { image as imgapi, profile } from '../config/api';
import { AuthContext } from '../context/auth';
import { update } from '../services/auth';

function ProfileForm({ close, item }) {

    let imageInput = useRef(null);
    const [image, setimage] = useState(null);
    const [name, setname] = useState(item.name);
    const [file, setfile] = useState(null)
    const { token, dispatch } = useContext(AuthContext)

    const getImage = (e) => {
        setfile(e.target.files[0]);
        let src = URL.createObjectURL(e.target.files[0]);
        setimage(src);
    }

    const updateProfile = async () => {
        const tid = toast.loading("updating task", {
            duration: 100000
        });
        let form = new FormData();
        form.append('name', name);
        form.append("image", file);
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
                        <div className="image_overlay" onClick={() => imageInput.current.click()}>
                            <RiImageEditLine size={50} />
                            <span>Choose image</span>
                        </div>
                        {
                            image == null ?
                                <>
                                    {
                                        item.logo ?
                                            <img src={imgapi + item.logo} />
                                            :
                                            <Avatar name={name} size={"100%"} />
                                    }
                                </> :
                                <img src={image} />
                        }
                    </div>
                    <div className='input'>
                        <input type='text' placeholder='name' value={name} onChange={(e) => setname(e.target.value)} />
                        <input ref={imageInput} name='image' type="file" hidden onChange={getImage} />
                    </div>
                </div>

                <div className="submit" onClick={updateProfile}>Update </div>
            </div>
        </div>
    )
}

export default ProfileForm