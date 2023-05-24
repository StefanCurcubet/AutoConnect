import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { getFavourites, toggleFavourite } from "../Features/userSlice";

export default function ListingPage() {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {favouritedPosts, isLogged} = useSelector((store) => store.user)
    const {allPosts, selectedPostId} = useSelector((store) => store.browse)
    function formatTime(timeStamp){
        return new Date(timeStamp).toLocaleString()
    }

    async function updateFavourite(id) {
        if (!isLogged){
            navigate('/login')
        } else {
            await dispatch(toggleFavourite(id));
            dispatch(getFavourites());
        }
    }

    let selectedListing = {}
    if (selectedPostId) {
        selectedListing = allPosts.find((post) => post.id === selectedPostId);
    } else {
        navigate('/')
    }

    const {id, title, imageUrl, brand, modelYear, mileage, price, author, added} = selectedListing

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
        <hr className="shadow"/>
        </div>
    )
}