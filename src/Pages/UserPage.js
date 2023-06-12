import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import MessageModal from "../Components/MessageModal"
import { setMessageModalOpen } from "../Features/messagingSlice"
import Post from "../Components/Post"
import RatingStars from "../Components/RatingStars"

export default function UserPage() {

    const {userName} = useParams()
    const {isLogged, userInfo} = useSelector((store) => store.user)
    const [selectedUser, setSelectedUser] = useState()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    console.log(selectedUser);

    function formatTime(timeStamp){
        return new Date(timeStamp).toLocaleDateString()
    }

    async function getSelectedUser() {
        const response = await fetch(`http://127.0.0.1:8000/getUser/${userName}`)
        const data = await response.json()
        setSelectedUser(data)
    }

    async function rateUser(rating) {
        const {access} = JSON.parse(localStorage.getItem('authTokens'))
        const response = await fetch(`http://127.0.0.1:8000/rateSeller/${userName}/${rating}`,{
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${access}`,
            },
        })
        console.log(response.json()); 
    }

    async function handleRating(rating) {
        if (!isLogged) {
            navigate('/login')
            return
        }
        await rateUser(rating)
        getSelectedUser()
    }

    useEffect(() => {
        getSelectedUser()
    },[])

    let userRating = selectedUser?.ratings.find((rating) => rating.rated_by === userInfo?.user_id)
    let user_listings = selectedUser?.listings.map((listing) => <Post key={listing.id} postData={listing} />)

    return (
        <>
            <div className="container-fluid bg-body-tertiary d-flex justify-content-center flex-column">
                <h1 className="mt-3 ms-2"><span>{selectedUser?.username}</span></h1>
                <RatingStars user_rating={selectedUser?.current_rating} nr_ratings={selectedUser?.ratings.length}/>
                <h3 className="ms-2">Date Joined: {formatTime(selectedUser?.date_joined)}</h3>
                <div className="d-flex">
                    <button className="btn btn-outline-primary ms-2 me-2 mb-2" onClick={() => dispatch(setMessageModalOpen(true))}>
                        Message User
                    </button>
                    {
                        userInfo?.username === userName ? null :
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
                    }
                </div>
                <MessageModal recipient={userName} />
            </div>
            <h2 className="text-center">Listings</h2>
            {user_listings}
        </>
    )
}