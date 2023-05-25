import { useDispatch, useSelector } from "react-redux";
import { getFavourites, toggleFavourite } from "../Features/userSlice";
import { useNavigate } from "react-router-dom";

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

    return (
        <div className="card mt-3 card-hover-shadow" onClick={() => handleSelect()}>
            <div className="row g-0">
                <div className="col-md-4">
                    <img src={imageUrl} className="img-fluid rounded-start" style={{cursor: 'pointer'}} alt="carImage"/>
                </div>
                <div className="col-md-8">
                    <div className="card-body">
                        <h5 className="card-title mb-4" >
                            <strong>{title}</strong>
                            <strong className="ms-5 text-danger"> {price} EUR</strong>
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
                </div>
            </div>
        </div>
    )
}