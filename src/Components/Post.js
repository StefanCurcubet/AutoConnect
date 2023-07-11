import { useDispatch, useSelector } from "react-redux";
import { getFavourites, toggleFavourite } from "../Features/userSlice";
import { useNavigate, useParams } from "react-router-dom";
import fair from '../Images/listing-rating-fair.png'
import over from '../Images/listing-rating-over.png'
import under from '../Images/listing-rating-under.png'
import unrated from '../Images/listing-rating-unrated.png'
import { getAllPosts, ratePost, setDeleteModalOpen, setDeletePost } from "../Features/postSlice";
import { Link } from "react-router-dom";
import RatingStars from "./RatingStars";
import { MoonLoader } from "react-spinners";

export default function Post({postData}){

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {userName} = useParams()
    const {favouritedPosts, isLogged, userInfo, isLoading} = useSelector((store) => store.user)
    const {id, title, imageUrl, brand, modelYear, mileage, price,current_rating, author, added, ratings, comments} = postData

    let userRating = ratings.find((rating) => rating.rated_by === userInfo?.user_id)
   
    function formatTime(timeStamp){
        return new Date(timeStamp).toLocaleString()
    }

    async function updateFavourite(id,e) {
        if (!isLogged){
            e.stopPropagation()
            navigate('/login')
        } else {
            e.stopPropagation()
            await dispatch(toggleFavourite(id));
            dispatch(getFavourites());
        }
    }

    function handleSelect() {
        navigate(`/viewPost/${id}`)
    }

    async function handleRating(rating){
        if (!isLogged) {
            navigate('/login')
            return
        }
        await dispatch(ratePost({id, rating}))
        dispatch(getAllPosts())
    }

    function imgRating() {
        let image = unrated
        if (current_rating === 1) {
            image = under
        } else if (current_rating === 2) {
            image = fair
        } else if (current_rating === 3) {
            image = over  
        }
        return image
    }

    return (
        <div className="card mt-3 card-hover-shadow" onClick={() => handleSelect()}>
            <div className="row g-0">
                <div className="col-md-4">
                    <div className="ratio ratio-4x3">
                        <img src={imageUrl} className="img-fluid rounded-start " style={{cursor: 'pointer'}} alt="carImage"/>
                    </div>
                </div>
                <div className="col-md-8">
                    <div className="card-body pb-2 h-100">
                        {/* Large View */}
                        <div className="d-none d-sm-flex justify-content-between h-100" >
                            <div className="d-flex flex-column">
                                <h5 className="mb-3"><strong>{title}</strong></h5>
                                <p className="card-text mb-1">{brand}</p>
                                <p className="card-text mb-1">{modelYear}</p>
                                <p className="card-text mb-2">{mileage} km</p>
                                <p className="card-text mb-0" onClick={(e) => e.stopPropagation()}>Added by: <Link to={`/viewUser/${author}`} >{author}</Link></p>
                                <RatingStars author={author}/>
                                <p className="card-text"><small className="text-body-secondary">{formatTime(added)}</small></p>
                                <p className="card-text text-secondary mt-auto"><i className="bi bi-chat-left"></i> ({comments?.length})<i className="bi bi-hand-index"></i> ({ratings?.length})</p>
                                {isLogged && userInfo.username === userName ?
                                    <button className="btn btn-danger me-auto" onClick={(e) => {e.stopPropagation(); dispatch(setDeleteModalOpen(true)); dispatch(setDeletePost(id))}}>Delete listing</button>
                                : 
                                    null
                                }
                            </div>
                            <h5 className="d-flex flex-column align-items-center">
                                <div className="d-flex">
                                    <strong className="ms-5 text-danger"> {price} EUR</strong>
                                    {isLoading ?
                                        <MoonLoader loading={isLoading} size={15.56} className="ms-3 mt-auto"/>
                                    :
                                    <>
                                        {favouritedPosts.split(',').includes(`${id}`) ?
                                            <i className="bi bi-star-fill ms-3 text-danger star-hover" onClick={(e) => updateFavourite(id, e)} style={{cursor: "pointer"}}></i>
                                        :
                                            <i className="bi bi-star ms-3 star-hover " onClick={(e) => updateFavourite(id, e)} style={{cursor: "pointer"}}></i>
                                        }
                                    </>
                                    }
                                </div>
                                <div className="dropdown d-flex flex-column align-items-center" onClick={(e) => e.stopPropagation()}>
                                    {userInfo?.username === author ?
                                        <>
                                            <img className="ms-4 mt-2" src={imgRating()} width={95} height={80} alt="rating"/>
                                            <h6 className="ms-4"><strong>My listing</strong></h6>
                                        </>
                                    :
                                        <>
                                            <img className="ms-4 mt-2 dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" style={{cursor:"pointer"}} src={imgRating()} width={95} height={80} alt="rating"/>
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
                                        </>
                                    }
                                    
                                    <ul className="dropdown-menu no-min-width-pc">
                                        <li><div className="dropdown-item text-success" onClick={() => handleRating(1)} >Underpriced</div></li>
                                        <li><div className="dropdown-item text-warning" onClick={() => handleRating(2)} >Fair Value</div></li>
                                        <li><div className="dropdown-item text-danger" onClick={() => handleRating(3)} >Overpriced</div></li>
                                    </ul>
                                </div>
                            </h5>
                        </div>
                        {/* Small view */}
                        <div className="card-title d-sm-none d-flex flex-between h-100" > 
                            <div className="d-flex flex-column">
                                <h5><strong>{title}</strong></h5>
                                <h5 className="d-flex">
                                    <strong className="text-danger"> {price} EUR</strong>
                                    {isLoading ?
                                        <MoonLoader loading={isLoading} size={15.56} className="ms-3 mt-auto"/>
                                    :
                                        <>
                                            {favouritedPosts.split(',').includes(`${id}`) ?
                                                <i className="bi bi-star-fill ms-3 text-danger star-hover" onClick={(e) => updateFavourite(id, e)} style={{cursor: "pointer"}}></i>
                                            :
                                                <i className="bi bi-star ms-3 star-hover " onClick={(e) => updateFavourite(id, e)} style={{cursor: "pointer"}}></i>
                                            }
                                        </>
                                    }
                                </h5>
                                <p className="card-text mb-1">{brand}</p>
                                <p className="card-text mb-1">{modelYear}</p>
                                <p className="card-text mb-2">{mileage} km</p>
                                <p className="card-text mb-0" onClick={(e) => e.stopPropagation()}>Added by: <Link to={`/viewUser/${author}`} >{author}</Link></p>
                                <RatingStars author={author}/>
                                <p className="card-text"><small className="text-body-secondary">{formatTime(added)}</small></p>
                                <p className="card-text text-secondary mt-auto"><i className="bi bi-chat-left"></i> ({comments?.length})<i className="bi bi bi-hand-index"></i> ({ratings?.length})</p>
                                {isLogged && userInfo.username === userName ?
                                    <button className="btn btn-danger me-auto" onClick={(e) => {e.stopPropagation(); dispatch(setDeleteModalOpen(true)); dispatch(setDeletePost(id))}}>Delete listing</button>
                                : 
                                    null
                                }
                            </div>
                            <div className="dropdown d-flex flex-column align-items-center ms-auto" onClick={(e) => e.stopPropagation()}>
                                {userInfo?.username === author ?
                                    <>
                                        <img src={imgRating()} width={75} height={60} alt="rating"/>
                                        <h6><strong>My listing</strong></h6>
                                    </>
                                :
                                    <>
                                        <img className="dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" style={{cursor:"pointer"}} src={imgRating()} width={75} height={60} alt="rating"/>
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
                                    </>
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
    )
}