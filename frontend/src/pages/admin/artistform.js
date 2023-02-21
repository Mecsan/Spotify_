import { useFormik } from 'formik';
import React from 'react'
import { useRef } from 'react';
import { useContext } from 'react';
import { useState } from 'react'
import toast from 'react-hot-toast';
import { MdOutlineClose } from 'react-icons/md'
import { RiImageEditLine } from 'react-icons/ri'
import { artist, image as imageapi } from '../../config/api';
import { AdminContext } from '../../context/admincontent';
import { AuthContext } from '../../context/auth';


function ArtistForm({ item, setform }) {

    const { token } = useContext(AuthContext);
    const { dispatch } = useContext(AdminContext)

    const [image, setimage] = useState(null);
    const [imagefile, setimagefile] = useState(null);

    const addArtist = async (formdata) => {
        let res = await fetch(artist, {
            method: "POST",
            headers: {
                "authorization": "berear " + token,
            },
            body: formdata
        })

        if (!res.ok) {
            toast.error("something went wrong");
            return;
        }
        let data = await res.json();
        dispatch({ type: "ADD_ARTIST", data });
        setform(false);
        toast.success("artist added");
    }

    const updateArtist = async (formdata) => {
        let res = await fetch(artist + item._id, {
            method: "PUT",
            headers: {
                "authorization": "berear " + token,
            },
            body: formdata
        })
        if (!res.ok) {
            toast.error("something went wrong");
            return;
        }

        let data = await res.json();
        dispatch({ type: "UPDATE_ARTIST", data });
        setform(false);
        toast.success("artist updated");
    }


    const imageInput = useRef(null);

    const form = useFormik({
        initialValues: {
            name: item ? item.name : "",
            logo: item ? item.logo : ""
        },
        onSubmit: async () => {
            let formdata = new FormData();
            formdata.append("name", form.values.name);
            formdata.append("image", imagefile);

            if (item == null) {
                addArtist(formdata);
            } else {
                updateArtist(formdata)
            }

        }
    })

    const getImage = (e) => {
        setimagefile(e.target.files[0]);
        let src = URL.createObjectURL(e.target.files[0]);
        setimage(src);
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
                            image ? <img src={image} /> :
                                <>{
                                    form.values.logo ?
                                        <img src={imageapi + form.values.logo} />
                                        : null
                                }
                                </>

                        }
                    </div>
                    <div className='input'>

                        <input type='text' name='name' placeholder='name' onChange={form.handleChange} value={form.values.name} />

                        <input ref={imageInput} name='image' type="file" hidden onChange={getImage} />
                    </div>
                </div>

                <input type='submit' value={item == null ? "Add user" : "Update user"} onClick={() => form.submitForm()} className="submit" />

            </div>
        </div>
    )
}

export default ArtistForm