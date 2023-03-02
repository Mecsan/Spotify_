import React from 'react'
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { signin } from '../config/api';
import { useContext } from 'react';
import { AuthContext } from '../context/auth';
import toast from 'react-hot-toast';

function Singin() {
    const { token,dispatch } = useContext(AuthContext);
    const navigate = useNavigate();
    let schema = yup.object().shape({
        email: yup.string().email("invalid email").required("email is required"),
        password: yup.string().required("password is required").min(6, "password too sort").max(12, "password too large")
    });

    const form = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validationSchema: schema,
        onSubmit: async () => {
            let tid = toast.loading("singing in...")
            let res = await fetch(signin, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({ email: form.values.email, password: form.values.password })
            })

            let data = await res.json();
            if (!res.ok) {
                let err = JSON.parse(data.msg);
                form.setFieldError(err.field, err.msg);
                toast.error("something went wrong", { id: tid })
                return;
            }

            localStorage.setItem("spoti", data.msg);
            dispatch({ type: "SET_TOKEN", data: data.msg });
            toast.success("Signin successfullly", { id: tid });
            navigate("/");
        }

    })
    return (
        <div className="main_container">
            {token && <Navigate to="/" />}

            <div className="form-container">

                <div className="logo" onClick={() => navigate("/")}>
                    <img src='./assests/logo.png' />
                </div>

                <div className="links">
                    <Link to="/signin" className='active link'>SIGN IN</Link>
                    <Link to="/signup" className='  link'>SIGN UP</Link>
                </div>

                <form autoComplete='off' onSubmit={form.handleSubmit}>
                    <div className="input">
                        <input className={form.touched.email && form.errors.email && "err"} placeholder='usermail' name='email' type="text" value={form.values.email} onChange={form.handleChange} onBlur={form.handleBlur} />
                        <span>{form.touched.email && form.errors.email && form.errors.email}</span>
                    </div>
                    <div className="input">
                        <input className={form.touched.password && form.errors.password && "err"} placeholder='password' name='password' type="password" value={form.values.password} onChange={form.handleChange} onBlur={form.handleBlur} />
                        <span>{form.touched.password && form.errors.password && form.errors.password}</span>
                    </div>
                    <div className="input">
                        <input type="submit" value={"SIGN IN"} />
                    </div>

                </form>
            </div>
        </div>
    )
}

export default Singin