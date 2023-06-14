import { useSelector } from "react-redux"

export default function RatingStars({author}) {

    const {allSellerRatings} = useSelector((store) => store.browse)
    let rating = 0
    let rating_count = 0
    let stars = []

    const seller = allSellerRatings?.find((seller) => seller.username === author)
    rating = seller?.current_rating
    rating_count = seller?.nr_ratings
 

    for (let i = 0; i < 5; ++i) {
        if (rating >= 1) {
            stars.push(<i key={i} className="bi bi-star-fill text-warning"></i>)
            --rating
        } else if (rating >= 0.5) {
            stars.push(<i key={i} className="bi bi-star-half text-warning"></i>)
            rating -= 0.5
        } else {
            stars.push(<i key={i} className="bi bi-star text-warning-emphasis"></i>)
        }
    }

    return (
        <div className="">
           {stars} {rating_count === 0 ? "Unrated" : `(${rating_count})`}
        </div>
    )
}