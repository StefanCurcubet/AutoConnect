import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import AuthPage from './Pages/AuthPage';
import Navbar from './Components/Navbar';
import { useEffect } from 'react';
import { getLocalTokens } from './Features/userSlice';
import { useDispatch } from 'react-redux';
import FavouritesPage from './Pages/FavouritesPage';

function App() {

  const dispatch = useDispatch()

  useEffect(()=> {
    if (localStorage.getItem('authTokens')) {
      console.log('got auth tokens at top level to set access and user info');
      dispatch(getLocalTokens(JSON.parse(localStorage.getItem('authTokens'))))
    }
  },[])

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<AuthPage />} />
          <Route path='/favourites' element={<FavouritesPage/>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
