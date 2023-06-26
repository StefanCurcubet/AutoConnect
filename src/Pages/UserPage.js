import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import MessageModal from "../Components/MessageModal"
import { setMessageModalOpen } from "../Features/messagingSlice"
import Post from "../Components/Post"
import RatingStars from "../Components/RatingStars"
import DeleteListingModal from "../Components/DeleteListingModal"
import { getAllSellerRatings } from "../Features/browseSlice"

export default function UserPage() {
    const {userName} = useParams()
    const {isLogged, userInfo} = useSelector((store) => store.user)
    const {allSellerRatings} = useSelector((store) => store.browse)
    const [selectedUserData, setSelectedUserData] = useState()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    function formatTime(timeStamp){
        return new Date(timeStamp).toLocaleDateString()
    }

    async function getSelectedUser() {
        const response = await fetch(`http://127.0.0.1:8000/getSeller/${userName}`)
        const data = await response.json()
        setSelectedUserData(data)
    }

    async function rateUser(rating) {
        const {access} = JSON.parse(localStorage.getItem('authTokens'))
        await fetch(`http://127.0.0.1:8000/rateSeller/${userName}/${rating}`,{
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${access}`,
            },
        })
    }

    async function handleRating(rating) {
        if (!isLogged) {
            navigate('/login')
            return
        }
        await rateUser(rating)
        await getSelectedUser()
        dispatch(getAllSellerRatings())
    }

    useEffect(() => {
        getSelectedUser()
        if (allSellerRatings.length === 0) { // only gets all ratings again if user refreshes page
            dispatch(getAllSellerRatings())
        }
    },[userName])

    let userRating = selectedUserData?.ratings.find((rating) => rating.rated_by === userInfo?.user_id) // refers to the logged on users rating of the seller/user he is viewing
    let user_listings = selectedUserData?.listings.map((listing) => <Post key={listing.id} postData={listing} />)

    return (
        <>
            <div className="container-fluid bg-body-tertiary d-flex justify-content-center flex-column">
                <h1 className="mt-3 ms-2"><span>{selectedUserData?.username === userInfo?.username ? "My Profile" : selectedUserData?.username}</span></h1>
                <div className="ms-2"><RatingStars author={userName} /></div>
                <h3 className="ms-2">Date Joined: {formatTime(selectedUserData?.date_joined)}</h3>
                <div className="d-flex">
                    {
                        userInfo?.username === userName ? null :
                        <>
                            <button className="btn btn-outline-primary ms-2 me-2 mb-2" onClick={() => dispatch(setMessageModalOpen(true))}>
                                Message User
                            </button>
                            <div className="dropdown me-auto">
                                <button className="btn btn-outline-warning dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    {userRating ?
                                            <>
                                                You rated {userRating.rating}
                                                ({<i className="bi bi-star-fill text-outline-warning"></i>})
                                            </>
                                        : 
                                            "Rate User:"
                                    }
                                </button>
                                <ul className="dropdown-menu">
                                    <li><div className="dropdown-item" onClick={() => handleRating(1)}><i className="bi bi-star-fill text-warning"></i></div></li>
                                    <li><div className="dropdown-item" onClick={() => handleRating(2)} ><i className="bi bi-star-fill text-warning"></i> <i className="bi bi-star-fill text-warning"></i></div></li>
                                    <li><div className="dropdown-item" onClick={() => handleRating(3)} ><i className="bi bi-star-fill text-warning"></i> <i className="bi bi-star-fill text-warning"></i> <i className="bi bi-star-fill text-warning"></i></div></li>
                                    <li><div className="dropdown-item" onClick={() => handleRating(4)} ><i className="bi bi-star-fill text-warning"></i> <i className="bi bi-star-fill text-warning"></i> <i className="bi bi-star-fill text-warning"></i> <i className="bi bi-star-fill text-warning"></i></div></li>
                                    <li><div className="dropdown-item" onClick={() => handleRating(5)} ><i className="bi bi-star-fill text-warning"></i> <i className="bi bi-star-fill text-warning"></i> <i className="bi bi-star-fill text-warning"></i> <i className="bi bi-star-fill text-warning"></i> <i className="bi bi-star-fill text-warning"></i></div></li>
                                </ul>
                            </div>
                        </>
                    }
                </div>
                <MessageModal recipient={userName} />
                <DeleteListingModal getSelectedUser={getSelectedUser}/>
            </div>
            <h2 className="text-center">Listings</h2>
            {user_listings}
        </>
    )
}