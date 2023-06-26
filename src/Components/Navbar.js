import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getSettings, logout, setSettingsModal } from "../Features/userSlice";
import SettingsModal from "./SettingsModal";

export default function Navbar() {

    const {isLogged, userInfo} = useSelector((store) => store.user)
    const {conversations} = useSelector((store) => store.messaging)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    return (
        <>
            <nav className="navbar navbar-expand-md bg-body-tertiary color-white shadow sticky-top justify-content-start">
                <div className="navbar-brand ms-5" style={{cursor: 'default'}}>AutoConnect</div>
                <button className="navbar-toggler no-border" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <i className="bi bi-list"></i>
                </button>
                <div className="ms-auto me-2 me-sm-5 d-flex align-items-center d-md-none">
                    {userInfo ? 
                        <div className="dropdown">
                            <div className="dropdown-toggle d-flex align-items-center" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <i className="bi bi-person-circle me-1"></i>
                                <h6 className="m-0">{userInfo.username}</h6>
                            </div>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <Link to={`/viewUser/${userInfo.username}`} className="nav-link ps-3" style={{cursor: 'pointer'}}>
                                    My Profile
                                </Link>
                                <li className="nav-link ps-3" style={{cursor: 'pointer'}} onClick={() => (dispatch(setSettingsModal(true)), dispatch(getSettings()))}>Settings</li>
                                <li className="nav-link ps-3" style={{cursor: 'pointer'}} onClick={() => {dispatch(logout()); navigate('/')}}> Log out</li>
                            </ul>
                        </div>
                    :
                        <>
                            <i className="bi bi-person-circle me-1"></i>
                            <h6 className="m-0">Guest</h6>
                        </>
                    }
                </div>
                <div className="collapse navbar-collapse" id="navbarContent">
                    <a className="nav-link p-2" href="/">Browse</a>
                    {isLogged ?
                    <>
                        <Link to={'/favourites'} className="nav-link p-2" style={{cursor: 'pointer'}}>
                            Favourites
                        </Link>
                        <Link to={'/newListing'} className="nav-link p-2" style={{cursor: 'pointer'}}>
                            Create New Listing
                        </Link>
                        <div className="d-flex">
                            <Link to={'/messaging'} className="nav-link p-2" style={{cursor: 'pointer'}}>
                                Messages
                            </Link>
                            {conversations.find((conversation) => conversation.update_from !== userInfo.username && conversation.update_from !== '') ? <i className="bi bi-exclamation-circle ms-negative text-primary"></i> : null}
                        </div>
                    </>
                        :
                        <Link to={'/login'} className="nav-link p-2" style={{cursor: 'pointer'}}>
                            Login
                        </Link>
                    }
                </div>
                <div className="ms-auto me-2 me-sm-5 d-flex align-items-center d-none d-md-flex">
                    {userInfo ? 
                        <div className="dropdown">
                            <div className="dropdown-toggle d-flex align-items-center" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <i className="bi bi-person-circle me-1"></i>
                                <h6 className="m-0">{userInfo.username}</h6>
                            </div>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <Link to={`/viewUser/${userInfo.username}`} className="nav-link ps-3" style={{cursor: 'pointer'}}>
                                    My Profile
                                </Link>
                                <li className="nav-link ps-3" style={{cursor: 'pointer'}} onClick={() => (dispatch(setSettingsModal(true)), dispatch(getSettings()))}>Settings</li>
                                <li className="nav-link ps-3" style={{cursor: 'pointer'}} onClick={() => {dispatch(logout()); navigate('/')}}> Log out</li>
                            </ul>
                        </div>
                    :
                        <>
                            <i className="bi bi-person-circle me-1"></i>
                            <h6 className="m-0">Guest</h6>
                        </>
                    }
                </div>
            </nav>
            <SettingsModal />
        </>
    )
}