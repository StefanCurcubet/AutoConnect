import { useDispatch, useSelector } from "react-redux";
import { getFavourites, toggleFavourite } from "../Features/userSlice";
import { useNavigate } from "react-router-dom";
import fair from '../Images/listing-rating-fair.png'
import over from '../Images/listing-rating-over.png'
import under from '../Images/listing-rating-under.png'
import unrated from '../Images/listing-rating-unrated.png'
import { ratePost } from "../Features/browseSlice";

export default function Post({postData}){

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {favouritedPosts, isLogged} = useSelector((store) => store.user)
    const {id, title, imageUrl, brand, modelYear, mileage, price, author, added} = postData
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
        navigate(`/viewListing/${id}`)
    }

    function handleRating(rating){
        dispatch(ratePost({id, rating}))
    }

    return (
        <div className="card mt-3 card-hover-shadow" onClick={() => handleSelect()}>
            <div className="row g-0">
                <div className="col-md-4">
                    <img src={imageUrl} className="img-fluid rounded-start" style={{cursor: 'pointer'}} alt="carImage"/>
                </div>
                <div className="col-md-8">
                    <div className="card-body">
                        <div className="card-title mb-4 d-none d-sm-flex justify-content-between" >
                            <div className="d-flex flex-column">
                            <h5><strong>{title}</strong></h5>
                            <p className="card-text">{brand}</p>
                            <p className="card-text">{modelYear}</p>
                            <p className="card-text">{mileage} km</p>
                            <p className="card-text">Added by: {author} </p>
                            <p className="card-text"><small className="text-body-secondary">{formatTime(added)}</small></p>
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
                                    <img className="ms-4 mt-2 dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" style={{cursor:"pointer"}} src={unrated} width={120} height={80}/>
                                    <h6 className="ms-4"><strong>Rate listing <i className="bi bi-hand-index"></i></strong> </h6>
                                    <ul className="dropdown-menu no-min-width-pc">
                                        <li><div className="dropdown-item text-success" onClick={() => handleRating(1)} >Underpriced</div></li>
                                        <li><div className="dropdown-item text-warning" onClick={() => handleRating(2)} >Fair Value</div></li>
                                        <li><div className="dropdown-item text-danger" onClick={() => handleRating(3)} >Overpriced</div></li>
                                    </ul>
                                </div>
                            </h5>
                        </div>
                        <div className="card-title mb-4 d-sm-none d-flex flex-between" >
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
                                <p className="card-text">{brand}</p>
                                <p className="card-text">{modelYear}</p>
                                <p className="card-text">{mileage} km</p>
                                <p className="card-text">Added by: {author} </p>
                                <p className="card-text"><small className="text-body-secondary">{formatTime(added)}</small></p>
                            </div>
                            <div className="dropdown d-flex flex-column align-items-center" onClick={(e) => e.stopPropagation()}>
                                <img className="dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" style={{cursor:"pointer"}} src={fair} width={90} height={60}/>
                                <h6><strong>Rate listing <i className="bi bi-hand-index"></i></strong> </h6>
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