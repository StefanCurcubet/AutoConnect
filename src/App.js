import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import AuthPage from './Pages/AuthPage';
import Navbar from './Components/Navbar';
import { useEffect } from 'react';
import { getLocalTokens } from './Features/userSlice';
import { useDispatch } from 'react-redux';
import FavouritesPage from './Pages/FavouritesPage';
import NewListingPage from './Pages/NewListingPage';
import ListingPage from './Pages/ListingPage';
import MessagingPage from './Pages/MessagingPage';
import { getConversations } from './Features/messagingSlice';

function App() {

  const dispatch = useDispatch()

  async function handleStart() {
    await dispatch(getLocalTokens(JSON.parse(localStorage.getItem('authTokens'))))
    dispatch(getConversations())
  }

  useEffect(()=> {
    if (localStorage.getItem('authTokens')) {
      handleStart()
    }
  },[])

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<AuthPage />} />
          <Route path='/favourites' element={<FavouritesPage />} />
          <Route path='/newListing' element={<NewListingPage />} />
          <Route path='/viewListing/:listingId' element={<ListingPage />} />
          <Route path='/messaging' element={<MessagingPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;