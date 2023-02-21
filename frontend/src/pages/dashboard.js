import React from 'react'
import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Header from '../components/Header'
import AdminProvider from '../context/admincontent'
import Artists from './admin/artists'
import BottomNav from './admin/bottomnav'
import DashHome from './admin/home'
import DashNav from './admin/nav'
import Playlist from './admin/playlist'
import Playlists from './admin/playlists'
import Songs from './admin/songs'
import Users from './admin/users'
function DashBoard() {

    return (
        <AdminProvider>
            <DashNav />
            <Header />
            <BottomNav />
            <Routes>
                <Route path='/' element={<DashHome />} />
                <Route path='/users' element={<Users />} />
                <Route path='/songs' element={<Songs />} />
                <Route path='/artists' element={<Artists />} />
                <Route path='/playlists' element={<Playlists />} />
                <Route path='/playlist/:id' element={<Playlist />} />
            </Routes>
        </AdminProvider>
    )
}

export default DashBoard