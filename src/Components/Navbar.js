import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../Features/userSlice";

export default function Navbar() {

    const {isLogged, userInfo} = useSelector((store) => store.user)
    const dispatch = useDispatch()

    return (
        <nav className="navbar navbar-expand-md bg-body-tertiary color-white shadow sticky-top justify-content-start">
            <div className="navbar-brand ms-5" style={{cursor: 'default'}}>AutoConnect</div>
            <button class="navbar-toggler no-border" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <i className="bi bi-list"></i>
            </button>
            <div className="ms-auto me-2 me-sm-5 d-flex align-items-center d-md-none">
                <i className="bi bi-person-circle me-1"></i>
                <h6 className="m-0">{userInfo ? userInfo.username : "Guest"}</h6>
            </div>
            <div class="collapse navbar-collapse" id="navbarContent">
                <a className="nav-link p-2" href="/">Browse</a>
                {isLogged ?
                <>
                    <Link to={'/favourites'} className="nav-link p-2" style={{cursor: 'pointer'}}>
                        Favourites
                    </Link>
                    <Link to={'/newListing'} className="nav-link p-2" style={{cursor: 'pointer'}}>
                        Create New Listing
                    </Link>
                    <div className="nav-link p-2" style={{cursor: 'pointer'}} onClick={() => {dispatch(logout())}}>Log out</div>
                </>
                    :
                    <Link to={'/login'} className="nav-link p-2" style={{cursor: 'pointer'}}>
                        Login
                    </Link>
                }
            </div>
            <div className="ms-auto me-2 me-sm-5 d-flex align-items-center d-none d-md-flex">
                <i className="bi bi-person-circle me-1"></i>
                <h6 className="m-0">{userInfo ? userInfo.username : "Guest"}</h6>
            </div>
        </nav>
    )
}