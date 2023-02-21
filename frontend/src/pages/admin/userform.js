import React, { useContext } from 'react'
import { MdOutlineClose } from 'react-icons/md'
import { useFormik } from 'formik';
import { user } from '../../config/api';
import { AuthContext } from '../../context/auth';
import toast from 'react-hot-toast';
import { AdminContext } from '../../context/admincontent';

function UserForm({ setform, item }) {

    const { token } = useContext(AuthContext);
    const { dispatch } = useContext(AdminContext);

    const updateuser = async () => {
        let res = await fetch(user+item._id, {
            method: "PUT",
            headers: {
                "authorization": "berear " + token,
                "content-type": "application/json"
            },
            body: JSON.stringify(form.values)
        })

        if (!res.ok) {
            toast.error("something went wrong");
            return;
        }
        let data = await res.json();
        setform(false);
        dispatch({ type: "UPDATE_USER", data: data });
        toast.success("user updated successfully");
    }

    const Adduser = async () => {
        let res = await fetch(user, {
            method: "POST",
            headers: {
                "authorization": "berear " + token,
                "content-type": "application/json"
            },
            body: JSON.stringify(form.values)
        })

        if (!res.ok) {
            toast.error("something went wrong");
            return;
        }
        let data = await res.json();
        setform(false);
        dispatch({ type: "ADD_USER", data: data });
        toast.success("user added successfully");
    }

    const form = useFormik({

        initialValues: {
            name: item ? item.name : "",
            mail: item ? item.mail : "",
            password: item ? item.password : "",
            isAdmin: item ? item.isAdmin : false
        },

        onSubmit: async () => {
            if (item == null) {
                Adduser();
            } else {
                updateuser();
            }
        }

    })
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

                    <div className='input'>
                        <input type='text' name='name' placeholder='name' onChange={form.handleChange} value={form.values.name} />
                        <input name='mail' type='text' placeholder='mail' onChange={form.handleChange} value={form.values.mail} />
                        {item == null && <input name='password' type='text' placeholder='password' onChange={form.handleChange} value={form.values.password} />}
                        <select name='isAdmin' value={form.values.isAdmin} onChange={form.handleChange}>
                            <option value={true}>admin</option>
                            <option value={false}>normal user</option>
                        </select>
                    </div>
                </div>

                <input type='submit' value={item==null?"Add user":"Update user"} onClick={() => form.submitForm()} className="submit" />

            </div>
        </div>
    )
}

export default UserForm