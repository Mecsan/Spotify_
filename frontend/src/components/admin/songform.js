import React, { useState } from 'react'
import { MdOutlineClose } from 'react-icons/md'
import { useFormik } from 'formik';
import { RiImageEditLine } from 'react-icons/ri'
import { artist, image as imageapi, song } from '../../config/api';
import { useRef } from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa'
import { useEffect } from 'react';
import { useContext } from 'react';
import { AdminContext } from '../../context/admincontent';
import Select from 'react-select';
import { AuthContext } from '../../context/auth';
import toast from 'react-hot-toast'

function SongForm({ setform, item }) {

    const { artists, dispatch } = useContext(AdminContext);
    const { token } = useContext(AuthContext)

    const [image, setimage] = useState(null);
    const [imagefile, setimagefile] = useState(null);
    const [songfile, setsongfile] = useState(null);

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
        setTimeout(() => {
            let dura = Math.floor(forTime.duration);
            form.setFieldValue('duration', dura);
        }, 100);
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

        let res = await fetch(song, {
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
        setform(false);
        dispatch({ type: "ADD_SONG", data: data });
        toast.success("song added successfully");
    }

    const updatesong = async (formdata) => {

        let res = await fetch(song + item._id, {
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
        setform(false);
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

    const mystyle = {

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

                <input type='submit' value={item == null ? "Add user" : "Update user"} onClick={() => form.submitForm()} className="submit" />

            </div>
        </div>
    )
}

export default SongForm
