export default function RatingStars({user_rating, nr_ratings}) {
    let rating = user_rating
    let stars = []
    const starEmpty = <i className="bi bi-star text-warning-emphasis"></i>
    const starFull = <i className="bi bi-star-fill text-warning"></i>
    const starHalf = <i className="bi bi-star-half text-warning"></i>

    for (let i = 0; i < 5; ++i) {
        if (rating > 1) {
            stars.push(starFull)
            --rating
        } else if (rating === 0.5) {
            stars.push(starHalf)
            rating -= 0.5
        } else {
            stars.push(starEmpty)
        }
    }

    return (
        <div className="ms-2">
           {stars} {nr_ratings === 0 ? "Unrated" : `(${nr_ratings})`}
        </div>
    )
}