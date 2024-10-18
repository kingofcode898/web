import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy , Suspense} from 'react';
import { AuthProvider } from './userContext';

const LoginPage = lazy(() => import('./Pages/LoginPage'));
const SignUpPage = lazy(() => import('./Pages/SignUpPage'));
const HomePage = lazy(() => import('./Pages/HomePage'));
const ProfilePage = lazy(() => import('./Pages/ProfilePage'));
const UserProfileComponent = lazy(() => import('./components/UserProfileComponent'));
const SearchComponent = lazy(() => import('./components/SearchComponent'));

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />

            {/* Protected Routes */}
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/user/:username" element={<UserProfileComponent />} />
            <Route path="/search" element={<SearchComponent />} />

            {/* Home Route */}
            <Route path="/" element={<HomePage />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
};

export default App;