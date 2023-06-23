import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams, Link } from "react-router-dom"
import { getFavourites, toggleFavourite } from "../Features/userSlice";
import { useEffect, useState } from "react";
import Comment from "../Components/Comment";
import MessageModal from "../Components/MessageModal";
import { setMessageModalOpen } from "../Features/messagingSlice";
import fair from '../Images/listing-rating-fair.png';
import over from '../Images/listing-rating-over.png';
import under from '../Images/listing-rating-under.png';
import unrated from '../Images/listing-rating-unrated.png'
import { getAllSellerRatings, ratePost } from "../Features/browseSlice";
import RatingStars from "../Components/RatingStars";

export default function ListingPage() {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {listingId} = useParams()
    const {favouritedPosts, isLogged, userInfo} = useSelector((store) => store.user)
    const {allSellerRatings} = useSelector((store) => store.browse)
    const [listing, setListing] = useState()
    const [comments, setComments] = useState()
    const [newComment, setNewComment] = useState()

    let userRating = listing?.ratings.find((rating) => rating.rated_by === userInfo?.user_id)

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
        if (allSellerRatings.length === 0) { // only gets all ratings again if user refreshes page
            dispatch(getAllSellerRatings())
        }
    },[])

    async function updateFavourite(id) {
        if (!isLogged){
            navigate('/login')
        } else {
            await dispatch(toggleFavourite(id));
            dispatch(getFavourites());
        }
    }

    function handleMessage() {
        dispatch(setMessageModalOpen(true))
    }

    async function handleRating(rating){
        if (!isLogged) {
            navigate('/login')
            return
        }
        await dispatch(ratePost({id, rating}))
        getListing()
    }

    if (!listing) {
        return <h2 className="mt-3">Loading ...</h2>
    }

    function imgRating() {
        let image = unrated
        if (listing.current_rating === 1) {
            image = under
        } else if (listing.current_rating === 2) {
            image = fair
        } else if (listing.current_rating === 3) {
            image = over  
        }
        return image
    }

    const {id, title, imageUrl, brand, modelYear, mileage, price, author, added, ratings} = listing
    const commentList = comments?.map((comment) => <Comment key={comment.id} data={comment} listingAuthor={author}/>)

    return (
        <div className="container-lg" style={{cursor: 'default'}}>
            <div className="card mt-3 no-border">
                <div className="row g-0">
                    <div className="col-md-4">
                        <img src={imageUrl} className="img-fluid rounded-start" alt="carImage"/>
                    </div>
                    <div className="col-md-8">
                    <div className="card-body pb-1 h-100">
                        {/* Large View */}
                        <div className="d-none d-sm-flex justify-content-between h-100" >
                            <div className="d-flex flex-column">
                            <h5 className="mb-3"><strong>{title}</strong></h5>
                            <p className="card-text mb-1">{brand}</p>
                            <p className="card-text mb-1">{modelYear}</p>
                            <p className="card-text mb-2">{mileage} km</p>
                            <p className="card-text mb-0" onClick={(e) => e.stopPropagation()}>Added by: <Link to={`/viewUser/${author}`} >{author}</Link></p>
                            <RatingStars author={author} />
                            <p className="card-text mt-2"><small className="text-body-secondary">{formatTime(added)}</small></p>
                            <p className="card-text text-secondary mt-auto"><i className="bi bi-chat-left"></i> ({comments?.length})<i className="bi bi-hand-thumbs-up"></i> ({ratings?.length})</p>
                            </div>
                            <h5 className="d-flex flex-column align-items-center">
                                <div>
                                    <strong className="ms-5 text-danger"> {price} EUR</strong>
                                    {favouritedPosts.split(',').includes(`${id}`) ?
                                        <i className="bi bi-star-fill ms-3 text-danger star-hover" onClick={(e) => updateFavourite(id, e)} style={{cursor: "pointer"}}></i>
                                    :
                                        <i className="bi bi-star ms-3 star-hover " onClick={(e) => updateFavourite(id, e)} style={{cursor: "pointer"}}></i>
                                    }
                                </div>
                                <div className="dropdown d-flex flex-column align-items-center" onClick={(e) => e.stopPropagation()}>
                                    <img className="ms-4 mt-2 dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" style={{cursor:"pointer"}} src={imgRating()} width={95} height={80}/>
                                    {userRating ?
                                        <div>
                                            <h6 className="ms-4"><strong>You rated:</strong></h6>
                                            {userRating.rating === 1 ?
                                                <h6 className="ms-4 text-success">Underpriced</h6>
                                            : 
                                                userRating.rating === 2 ?
                                                    <h6 className="ms-4 text-warning">Fair Value</h6>
                                                : 
                                                    <h6 className="ms-4 text-danger">Overpriced</h6>
                                            }
                                        </div>
                                    :
                                        <h6 className="ms-4"><strong>Rate listing <i className="bi bi-hand-index"></i></strong></h6>
                                    }
                                    <ul className="dropdown-menu no-min-width-pc">
                                        <li><div className="dropdown-item text-success" onClick={() => handleRating(1)}>Underpriced</div></li>
                                        <li><div className="dropdown-item text-warning" onClick={() => handleRating(2)}>Fair Value</div></li>
                                        <li><div className="dropdown-item text-danger" onClick={() => handleRating(3)}>Overpriced</div></li>
                                    </ul>
                                </div>
                            </h5>
                        </div>
                        {/*Small View */}
                        <div className="d-sm-none d-flex justify-content-between h-100" >
                            <div className="d-flex flex-column">
                                <h5><strong>{title}</strong></h5>
                                <h5>
                                    <strong className="text-danger"> {price} EUR</strong>
                                    {favouritedPosts.split(',').includes(`${id}`) ?
                                        <i className="bi bi-star-fill ms-3 text-danger star-hover" onClick={(e) => updateFavourite(id, e)} style={{cursor: "pointer"}}></i>
                                    :
                                        <i className="bi bi-star ms-3 star-hover " onClick={(e) => updateFavourite(id, e)} style={{cursor: "pointer"}}></i>
                                    }
                                </h5>
                                <p className="card-text mb-1">{brand}</p>
                                <p className="card-text mb-1">{modelYear}</p>
                                <p className="card-text mb-2">{mileage} km</p>
                                <p className="card-text mb-0" onClick={(e) => e.stopPropagation()}>Added by: <Link to={`/viewUser/${author}`} >{author}</Link></p>
                                <RatingStars author={author} /> 
                                <p className="card-text"><small className="text-body-secondary">{formatTime(added)}</small></p>
                                <p className="card-text text-secondary mt-auto"><i className="bi bi-chat-left"></i> ({comments?.length})<i className="bi bi-hand-thumbs-up"></i> ({ratings?.length})</p>
                            </div>
                            <div className="dropdown d-flex flex-column align-items-center" onClick={(e) => e.stopPropagation()}>
                                <img className="dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" style={{cursor:"pointer"}} src={imgRating()} width={75} height={60}/>
                                {userRating ?
                                    <div>
                                        <h6><strong>You rated:</strong></h6>
                                        {userRating.rating === 1 ?
                                            <h6 className=" text-success">Underpriced</h6>
                                        : 
                                            userRating.rating === 2 ?
                                                <h6 className="text-warning">Fair Value</h6>
                                            : 
                                                <h6 className="text-danger">Overpriced</h6>
                                        }
                                    </div>
                                :
                                    <h6><strong>Rate listing <i className="bi bi-hand-index"></i></strong></h6>
                                }
                                <ul className="dropdown-menu no-min-width-mobile">
                                    <li><div className="dropdown-item text-success" onClick={() => handleRating(1)}>Underpriced</div></li>
                                    <li><div className="dropdown-item text-warning" onClick={() => handleRating(2)}>Fair Value</div></li>
                                    <li><div className="dropdown-item text-danger" onClick={() => handleRating(3)}>Overpriced</div></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
            <hr className="mt-1"/>
            <button className="btn hover-light no-border mb-3" type="button" data-bs-toggle="collapse" data-bs-target="#collapseAddComment" aria-expanded="false">
                <i className="bi bi-chat-left me-2"></i>
                Leave a comment
            </button>
            {author !== userInfo?.username || !userInfo ?
                <button className="btn btn-outline-primary mb-3 ms-2" onClick={() => handleMessage()}>
                    Message User
                </button>
            :
                null
            }
            <div className="collapse mb-3" id="collapseAddComment">
                {isLogged ?
                    <div className="card card-body d-flex">
                        <textarea className="no-border" placeholder="Type comment here ..." onChange={(e) => setNewComment(e.target.value)} />
                        <div className="d-flex">
                            <button className="btn btn-outline-primary me-2 mt-2" data-bs-toggle="collapse" data-bs-target="#collapseAddComment" onClick={() => addComment()}>Submit</button>
                            <button className="btn btn-outline-danger me-auto mt-2" data-bs-toggle="collapse" data-bs-target="#collapseAddComment">Cancel</button>
                        </div>
                    </div>
                :
                    <div className="card text-center">
                        <div className="card-body">
                            <h5 className="card-title">Hello, Guest</h5>
                            <p className="card-text">Log in to join the conversation.</p>
                            <Link to={'/login'} className="btn btn-primary" >
                                Log in
                            </Link>
                        </div>
                    </div>
                }
            </div>
            {commentList?.length !== 0 ? commentList : <h5 className="mt-4 ms-2">No comments yet</h5> }
            <MessageModal  recipient={author}/>
        </div>
    )
}