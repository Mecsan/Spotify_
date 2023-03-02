import React from 'react'
import { useContext } from 'react'
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/auth'

function AuthProtected({ children }) {

  let { token,isload } = useContext(AuthContext);

  if (!token) {
    return (
      <Navigate to={"/"} />
    )
  }

  if (!isload && token) return children;
}

export default AuthProtected