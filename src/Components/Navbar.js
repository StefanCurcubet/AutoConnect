import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../Features/userSlice";

export default function Navbar() {

    const {isLogged, userInfo} = useSelector((store) => store.user)
    const dispatch = useDispatch()

    return (
        <nav className="navbar bg-body-tertiary color-wwhite shadow sticky-top justify-content-start">
            <div className="navbar-brand ms-5" style={{cursor: 'default'}}>AutoConnect</div>
            <a className="nav-link ms-4" href="/">Browse</a>
            {isLogged ?
            <>
                <Link to={'/favourites'} className="nav-link ms-3" style={{cursor: 'pointer'}}>
                    Favourites
                </Link>
                <div className="nav-link ms-3" style={{cursor: 'pointer'}} onClick={() => {dispatch(logout())}}>Log out</div>
            </>
                :
                <Link to={'/login'} className="nav-link ms-3" style={{cursor: 'pointer'}}>
                    Login
                </Link>
            }
            <div className="ms-auto me-5">Hello, {userInfo ? userInfo.username : "Guest"}</div>
        </nav>
    )
}