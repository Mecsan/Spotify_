import React from 'react'
import { useContext } from 'react'
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/auth'

function AdminProteced({ children }) {

  const { token, isload, user } = useContext(AuthContext);

  if (!token) return <Navigate to={"/"} />

  if (!isload && user.isAdmin) return children;

  if (!isload && !user.isAdmin) {
    return <Navigate to="/" />
  }
}

export default AdminProteced