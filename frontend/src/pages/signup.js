import React from 'react'
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../config/api';
import { useContext } from 'react';
import { AuthContext } from '../context/auth';
import toast from 'react-hot-toast';

function Signup() {

  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  let schema = yup.object().shape({
    name: yup.string().required("name is required").min(3, "name is too short"),
    email: yup.string().email("invalid email").required("email is required"),
    password: yup.string().required("password is required").min(6, "password too sort").max(12, "password too large")
  });

  const form = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: ""
    },
    validationSchema: schema,
    onSubmit: async () => {
      let tid = toast.loading("signing up...")

      let res = await fetch(signup, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ name: form.values.name, email: form.values.email, password: form.values.password })
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
      toast.success("Singup successfullly", { id: tid })
      navigate("/");
    }
  })
  return (
    <div className="main_container">

      <div className="form-container">

        <div className="logo" onClick={() => navigate("/")}>
          <img src='./assests/logo.png' />
        </div>

        <div className="links">
          <Link to="/signin" className=' link'>SIGN IN</Link>
          <Link to="/signup" className='active link'>SIGN UP</Link>
        </div>

        <form autoComplete='off' onSubmit={form.handleSubmit}>
          <div className="input">
            <input className={form.touched.name && form.errors.name && "err"} placeholder='usename' name='name' type="text" value={form.values.name} onChange={form.handleChange} onBlur={form.handleBlur} />
            <span>{form.touched.name && form.errors.name && form.errors.name}</span>
          </div>
          <div className="input">
            <input className={form.touched.email && form.errors.email && "err"} placeholder='Email' name='email' type="text" value={form.values.email} onChange={form.handleChange} onBlur={form.handleBlur} />
            <span>{form.touched.email && form.errors.email && form.errors.email}</span>
          </div>
          <div className="input">
            <input className={form.touched.password && form.errors.password && "err"} placeholder='password' name='password' type="password" value={form.values.password} onChange={form.handleChange} onBlur={form.handleBlur} />
            <span>{form.touched.password && form.errors.password && form.errors.password}</span>
          </div>
          <div className="input">
            <input type="submit" value={"SIGN UP"} />
          </div>

        </form>
      </div>
    </div>
  )
}

export default Signup