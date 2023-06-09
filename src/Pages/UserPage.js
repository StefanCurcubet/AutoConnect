import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import MessageModal from "../Components/MessageModal"
import { setMessageModalOpen } from "../Features/messagingSlice"
import Post from "../Components/Post"
import RatingStars from "../Components/RatingStars"

export default function UserPage() {

    const {userName} = useParams()
    const [selectedUser, setSelectedUser] = useState()
    const dispatch = useDispatch()

    console.log(selectedUser);
    let user_rating = 3.5
    let nr_ratings = 5

    function formatTime(timeStamp){
        return new Date(timeStamp).toLocaleDateString()
    }

    async function getSelectedUser() {
        const response = await fetch(`http://127.0.0.1:8000/getUser/${userName}`)
        const data = await response.json()
        setSelectedUser(data)
        
    }

    useEffect(() => {
        getSelectedUser()
    },[])

    let user_listings = selectedUser?.listings.map((listing) => <Post key={listing.id} postData={listing} />)

    return (
        <>
            <div className="container-fluid bg-body-tertiary d-flex justify-content-center flex-column">
                <h1 className="mt-3 ms-2"><span>{selectedUser?.username}</span></h1>
                <RatingStars user_rating={user_rating} nr_ratings={nr_ratings}/>
                <h3 className="ms-2">Date Joined: {formatTime(selectedUser?.date_joined)}</h3>
                <button className="btn btn-outline-primary ms-2 me-auto mb-2" onClick={() => dispatch(setMessageModalOpen(true))}>
                    Message User
                </button>
                <MessageModal recipient={userName} />
            </div>
            <h2 className="text-center">Listings</h2>
            {user_listings}
        </>
    )
}