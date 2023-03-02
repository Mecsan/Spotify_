import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import LikeProvider from './context/likes';
import PlaylistProvider from './context/playlist';
import AuthProvider from './context/auth';
import ActiveProvider from './context/active';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ActiveProvider>
        <AuthProvider>
            <PlaylistProvider>
                <LikeProvider>
                    <App />
                </LikeProvider>
            </PlaylistProvider>
        </AuthProvider>
    </ActiveProvider>
);
