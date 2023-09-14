import React, { useState } from 'react'
import { MdOutlineClose } from 'react-icons/md'
import { useFormik } from 'formik';
import { RiImageEditLine } from 'react-icons/ri'
import { artist, image as imageapi, song } from '../../config/api';
import { useRef } from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa'
import { useContext } from 'react';
import { AdminContext } from '../../context/admincontent';
import Select from 'react-select';
import { AuthContext } from '../../context/auth';
import toast from 'react-hot-toast'
import { Oval } from 'react-loader-spinner';
import Loader from './loader';
import { add, update } from '../../services/song';

function SongForm({ setform, item }) {

    const { artists, dispatch } = useContext(AdminContext);
    const { token } = useContext(AuthContext)

    const [image, setimage] = useState(null);
    const [imagefile, setimagefile] = useState(null);
    const [songfile, setsongfile] = useState(null);
    const [load, setload] = useState(false);

    const imageInput = useRef(null);
    const songInput = useRef(null);

    const getImage = (e) => {
        setimagefile(e.target.files[0]);
        let src = URL.createObjectURL(e.target.files[0]);
        setimage(src);
    }

    const getsong = (e) => {
        // check for size of song
        setsongfile(e.target.files[0]);
        let src = URL.createObjectURL(e.target.files[0]);
        let forTime = new Audio(src);
        forTime.onloadedmetadata = () => {
            let dura = Math.floor(forTime.duration);
            form.setFieldValue('duration', dura);
        }
    }

    const valiadte = (obj) => {
        if (obj.name == "") {
            toast.error("name is required");
            return false;
        }
        if (obj.artist == "select") {
            toast.error("select any artist");
            return false;
        }
        if (obj.image == null && imagefile == null) {
            toast.error("choose image for song");
            return false;
        }
        if (obj.song == null && songfile == null) {
            toast.error("upload song file");
            return false;
        }
        return true;
    }

    const addSong = async (formdata) => {
        setload(true)
        let { res, data } = await add(token, formdata);
        if (!res.ok) {
            setload(false)
            toast.error("something went wrong");
            return;
        }
        setform(false);
        setload(false)
        dispatch({ type: "ADD_SONG", data: data });
        toast.success("song added successfully");
    }

    const updatesong = async (formdata) => {
        setload(true)
        let { res, data } = await update(item._id, formdata, token);
        if (!res.ok) {
            setload(false)
            toast.error("something went wrong");
            return;
        }
        setform(false);
        setload(false);
        dispatch({ type: "UPDATE_SONG", data: data });
        toast.success("song updated successfully");
    }
    const form = useFormik({

        initialValues: {
            name: item ? item.name : "",
            image: item ? item.image : null,
            artist: item ? item.artist : "select",
            song: item ? item.song : null,
            duration: item && item.duration ? item.duration : 0
        },

        onSubmit: async () => {
            if (!valiadte(form.values)) return;
            let formdata = new FormData();
            formdata.append('duration', form.values.duration);
            formdata.append("name", form.values.name);
            formdata.append('artist', form.values.artist._id);
            formdata.append("photo", imagefile);
            formdata.append("data", songfile);

            if (item == null) {
                addSong(formdata);
            } else {
                updatesong(formdata)
            }

        }

    })
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
                            <div className="image_overlay" onClick={() => imageInput.current.click()}>
                                <RiImageEditLine size={50} />
                                <span>Choose image</span>
                            </div>
                            {
                                image ? <img src={image} /> :
                                    <>{
                                        form.values.image ?
                                            <img src={imageapi + form.values.image} />
                                            : null
                                    }
                                    </>

                            }
                        </div>
                        <div className='input'>

                            <input type='text' name='name' placeholder='name' onChange={form.handleChange} value={form.values.name} />

                            <Select name='artist'
                                styles={{
                                    control: (styles, state) => {
                                        return {
                                            ...styles,
                                            backgroundColor: "#80808051",
                                        }
                                    }
                                    ,
                                    option: (pre, state) => {
                                        return {
                                            ...pre,
                                            padding: "0px"
                                        }
                                    }
                                }}
                                placeholder="Select artist"
                                value={form.values.artist}
                                onChange={(some) => {
                                    form.setFieldValue('artist', some);
                                }}
                                options={artists}
                                formatOptionLabel={(artist) => {
                                    return (
                                        <div className='artist-option'>
                                            <img src={imageapi + artist.logo} />
                                            {artist.name}</div>
                                    )
                                }} />



                            <input ref={imageInput} name='image' type="file" hidden onChange={getImage} />

                            <input ref={songInput} name="song" type="file" hidden onChange={getsong} />

                            <div className='choose-song' onClick={() => songInput.current.click()}> <FaCloudUploadAlt size={30} /> Choose song</div>
                            {
                                songfile ? <span className='songinfo'>{songfile.name}</span> : null
                            }
                        </div>
                    </div>

                    {
                        load ?
                            <Oval
                                height={40}
                                width={40}
                                color="#4fa94d"
                                visible={true}
                                ariaLabel='oval-loading'
                                secondaryColor="#4fa94d"
                                strokeWidth={8}
                                strokeWidthSecondary={8}
                            />
                            :
                            <input type='submit' value={item == null ? "Add song" : "Update user"} onClick={() => form.submitForm()} className="submit" />
                    }




                </div>
            </div>
            {load ? <Loader /> : null}
        </>

    )
}

export default SongForm
