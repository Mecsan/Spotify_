
import { Route, BrowserRouter as Router, Routes, Outlet } from 'react-router-dom'
import Home from "./pages/home";
import Liked from "./pages/liked";
import Search from "./pages/search";
import Nav from './components/Nav';
import Playlist from './pages/playlist';
import Header from './components/Header';
import Library from './pages/library';
import Player from './components/Player';
import { Toaster } from 'react-hot-toast';
import Song from './pages/song';
import Artist from './pages/artist';
import Queue from './pages/queue';
import DashBoard from './pages/dashboard';
import AuthProtected from './protected/authProtected';
import AdminProteced from './protected/adminProtected';
import Singin from './pages/signin';
import Signup from './pages/signup';
import Songs from './pages/songs';
import Playlists from './pages/playlists';
import ARtists from './pages/artists';
import BottomNav from './components/bottomnav';
import User from './pages/user';
import Profile from './pages/profile';
function App() {

  return (
    <div className="App">
      <Toaster toastOptions={{
        duration: 2300,
        position: 'top-center',
      }} />
      <div className="main">
        <Router>
          <Routes>
            <Route element={
              <>
                <Player />
                <Outlet />
              </>
            }>

              <Route element={
                <>
                  <Nav />
                  <BottomNav />
                  <Header />
                  <Outlet />
                </>
              }>
                <Route path="/" element={<Home />} />

                <Route path="/liked" element={
                  <AuthProtected>
                    <Liked />
                  </AuthProtected>}
                />

                <Route path="/library" element={
                  <AuthProtected>
                    <Library />
                  </AuthProtected>}
                />

                <Route path='/profile' element={
                  <AuthProtected>
                    <Profile />
                  </AuthProtected>
                } />

                <Route path="/search/*" element={<Search />} />

                <Route path='/playlist/:id' element={<Playlist />} />
                <Route path='/song/:id' element={<Song />} />
                <Route path='/artist/:id' element={<Artist />} />
                <Route path='/user/:id' element={<User />} />

                <Route path='/playing' element={<Queue />} />
                <Route path='/songs' element={<Songs />} />
                <Route path="/playlists" element={<Playlists />} />
                <Route path="/artists" element={<ARtists />} />

              </Route>

              <Route path='/dashboard/*' element={
                <AdminProteced>
                  <DashBoard />
                </AdminProteced>
              } />
            </Route>


            <Route path='/signin' element={<Singin />} />
            <Route path='/signup' element={<Signup />} />

            <Route path='*' element={<><div>redirecting to home page / login page</div></>} />
          </Routes>
        </Router>
      </div>
    </div >
  );
}

export default App;
