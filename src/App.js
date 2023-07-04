import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import AuthPage from './Pages/AuthPage';
import Navbar from './Components/Navbar';
import { useEffect } from 'react';
import { getLocalTokens, updateTokens } from './Features/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import FavouritesPage from './Pages/FavouritesPage';
import NewListingPage from './Pages/NewListingPage';
import ListingPage from './Pages/ListingPage';
import MessagingPage from './Pages/MessagingPage';
import { getConversations } from './Features/messagingSlice';
import UserPage from './Pages/UserPage';
import PasswordResetPage from './Pages/PasswordResetPage';

function App() {

  const dispatch = useDispatch()
  const {userInfo, isLogged} = useSelector((store) => store.user)

  function handleStart() {
    dispatch(getLocalTokens(JSON.parse(localStorage.getItem('authTokens'))))
    dispatch(getConversations())
  }

  useEffect(()=> {
    if (localStorage.getItem('authTokens')) {
      handleStart()
    }
  },[])

  useEffect(() => {
    if (userInfo) {
      const nineMinutes = 1000 * 60 * 9
      const updateTokensInterval = setInterval(() => {dispatch(updateTokens())}, nineMinutes)
      return () => {clearInterval(updateTokensInterval)}
    }
  },[userInfo])

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<AuthPage />} />
          <Route path='/reset/:resetCode' element={<PasswordResetPage />} />
          <Route path='/viewListing/:listingId' element={<ListingPage />} />
          <Route path='/viewUser/:userName' element={<UserPage />} />
          <Route path='/favourites' element={<FavouritesPage />} />
          <Route path='/newListing' element={<NewListingPage />} />
          <Route path='/messaging' element={<MessagingPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;