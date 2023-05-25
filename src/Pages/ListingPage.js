import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { getFavourites, toggleFavourite } from "../Features/userSlice";
import { useEffect, useState } from "react";
import Comment from "../Components/Comment";

export default function ListingPage() {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {listingId} = useParams()
    const {favouritedPosts, isLogged} = useSelector((store) => store.user)
    const [listing, setListing] = useState()
    const [comments, setComments] = useState()
    const [newComment, setNewComment] = useState()
    function formatTime(timeStamp){
        return new Date(timeStamp).toLocaleString()
    }

    async function getListing() {
        const response = await fetch(`http://127.0.0.1:8000/getListing/${listingId}`)
        const data = await response.json()
        setListing(data)
    }

    async function getComments() {
        const response = await fetch(`http://127.0.0.1:8000/getComments/${listingId}`)
        const data = await response.json()
        console.log(data);
        setComments(data)
    }

    async function addComment() {
        const {access} = JSON.parse(localStorage.getItem('authTokens'))
        const response = await fetch (`http://127.0.0.1:8000/addComment/${listingId}`, {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${access}`,
            },
            body: JSON.stringify({newComment})
        })
        if (response.status === 200) {
            getComments()
        } else {
            alert('Something went wrong.')
        }
    }

    useEffect(() => {
        getListing()
        getComments()
    },[])


    async function updateFavourite(id) {
        if (!isLogged){
            navigate('/login')
        } else {
            await dispatch(toggleFavourite(id));
            dispatch(getFavourites());
        }
    }

    if (!listing) {
        return <h2 className="mt-3">Loading ...</h2>
    }

    const {id, title, imageUrl, brand, modelYear, mileage, price, author, added} = listing
    const commentList = comments?.map((comment) => <Comment key={comment.id} data={comment}/>)

    return (
        <div className="container-lg" style={{cursor: 'default'}}>
            <div className="card mt-3 no-border">
            <div className="row g-0">
                <div className="col-md-4">
                    <img src={imageUrl} className="img-fluid rounded-start" alt="carImage"/>
                </div>
                <div className="col-md-8">
                    <div className="card-body">
                        <h5 className="card-title mb-4" >
                            <strong>{title}</strong>
                            <strong className="ms-5 text-danger"> {price} EUR</strong>
                            {favouritedPosts.split(',').includes(`${id}`) ?
                            <i className="bi bi-star-fill ms-3 text-danger star-hover" onClick={() => updateFavourite(id)} style={{cursor: "pointer"}}></i>
                            :
                            <i className="bi bi-star ms-3 star-hover " onClick={() => updateFavourite(id)} style={{cursor: "pointer"}}></i>
                            }
                        </h5>
                        <p className="card-text">{brand}</p>
                        <p className="card-text">{modelYear}</p>
                        <p className="card-text">{mileage} km</p>
                        <p className="card-text">Added by: {author} </p>
                        <p className="card-text"><small className="text-body-secondary">{formatTime(added)}</small></p>
                    </div>
                </div>
            </div>
        </div>
        <hr/>
        <button className="btn hover-light no-border mb-3" type="button" data-bs-toggle="collapse" data-bs-target="#collapseAddComment" aria-expanded="false">
            <i className="bi bi-chat-left me-2"></i>
            Leave a comment
        </button>
        <div className="collapse mb-3" id="collapseAddComment">
            <div className="card card-body d-flex">
                <textarea className="no-border" placeholder="Type comment here ..." onChange={(e) => setNewComment(e.target.value)} />
                <div className="d-flex">
                    <button className="btn btn-outline-primary me-2 mt-2" data-bs-toggle="collapse" data-bs-target="#collapseAddComment" onClick={() => addComment()}>Submit</button>
                    <button className="btn btn-outline-danger me-auto mt-2" data-bs-toggle="collapse" data-bs-target="#collapseAddComment">Cancel</button>
                </div>
            </div>
        </div>
        {commentList?.length !== 0 ? commentList : <h5 className="mt-4 ms-2">No comments yet</h5> }
        </div>
    )
}