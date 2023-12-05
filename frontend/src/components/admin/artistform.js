import { useFormik } from 'formik';
import React, { useEffect } from 'react'
import { useRef } from 'react';
import { useContext } from 'react';
import { useState } from 'react'
import toast from 'react-hot-toast';
import { MdOutlineClose } from 'react-icons/md'
import { RiImageEditLine } from 'react-icons/ri'
import { AdminContext } from '../../context/admincontent';
import { AuthContext } from '../../context/auth';
import useUpload from '../../hooks/useUpload';
import { add, update } from '../../services/artist';
import Loader from './loader';


function ArtistForm({ item, setform }) {

    const { token } = useContext(AuthContext);
    const { dispatch } = useContext(AdminContext)

    const [imagefile, setimagefile] = useState(null);
    const [load, setload] = useState(false);

    const { error, loading, progress, url } = useUpload('image', imagefile);

    const validate = (obj) => {
        if (obj.name == "") {
            toast.error("name is required");
            return false;
        }
        if (obj.logo == "" && url == null) {
            toast.error("upload photo of artist");
            return false;
        }

        return true;
    }

    const addArtist = async (formdata) => {
        setload(true)
        let { res, data } = await add(token, formdata);
        if (!res.ok) {
            setload(false)
            toast.error("something went wrong");
            return;
        }
        dispatch({ type: "ADD_ARTIST", data });
        setform(false);
        setload(false)
        toast.success("artist added");
    }

    const updateArtist = async (formdata) => {
        setload(true);
        let { res, data } = await update(item._id, token, formdata);
        if (!res.ok) {
            setload(false)
            toast.error("something went wrong");
            return;
        }
        dispatch({ type: "UPDATE_ARTIST", data });
        setform(false);
        setload(false)
        toast.success("artist updated");
    }


    const imageInput = useRef(null);

    const form = useFormik({
        initialValues: {
            name: item ? item.name : "",
            logo: item ? item.logo : ""
        },
        onSubmit: async (value) => {
            if (!validate(value) || loading) return;

            let body = {
                name: value.name,
                logo: url
            }

            if (item == null) {
                addArtist(body);
            } else {
                updateArtist(body);
            }
        }
    })

    const getImage = (e) => {
        setimagefile(e.target.files[0]);
    }

    useEffect(() => {
        if (error) {
            toast.error(error.message);
        }
    }, [error])

    let clickInput = () => {
        if (loading) return;
        imageInput.current.click();
    }


    return (
        <>
            <div className="overlay" onClick={(e) => {
                if (load) return;
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
                            <div className={loading ? "image_overlay upload_load" : "image_overlay"}

                                style={(url || form.values.logo) ? {} : { opacity: 1 }} onClick={clickInput}>
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
                                url ? <img src={url} /> :
                                    <>{
                                        form.values.logo ?
                                            <img src={form.values.logo} />
                                            : null
                                    }
                                    </>

                            }
                        </div>
                        <div className='input'>

                            <input type='text' name='name' placeholder='name' onChange={form.handleChange} value={form.values.name} />

                            <input  accept='image/png,image/jpg,image/jpeg' ref={imageInput} name='image' type="file" hidden onChange={getImage} />
                        </div>
                    </div>

                    <input type='submit' value={item == null ? "Add Artist" : "Update Artist"} onClick={() => form.submitForm()} className="submit" />

                </div>
            </div>
            {load ? <Loader /> : null}
        </>

    )
}

export default ArtistForm