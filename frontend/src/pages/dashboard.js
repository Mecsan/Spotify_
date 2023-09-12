import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AdminProvider from '../context/admincontent'
import Artists from './admin/artists'
import BottomNav from '../components/admin/bottomnav'
import DashNav from '../components/admin/nav'
import DashHome from './admin/home'
import Songs from './admin/songs'
import Users from './admin/users'   
function DashBoard() {
    return (
        <AdminProvider>
            <DashNav />
            <BottomNav />
            <Routes>
                <Route path='/' element={<DashHome />} />
                <Route path='/users' element={<Users />} />
                <Route path='/songs' element={<Songs />} />
                <Route path='/artists' element={<Artists />} />
                <Route path='*' element={<><Navigate to="/" /></>} />
            </Routes>
        </AdminProvider>
    )
}

export default DashBoard