import React from 'react'
import { useContext } from 'react'
import toast from 'react-hot-toast';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/auth'

function AuthProtected({ children }) {

  let { token } = useContext(AuthContext);
  if (token == null) {
    toast.error("Login to continue");
  }

  if (!token) {
    return (
      <Navigate to={"/"} />
    )
  }

  if (token) return children;
}

export default AuthProtected