export default function checkFilter(post, filter) {
    const {brand, modelYear, price, mileage} = post.props.postData
    let displayPost = true
    if (brand !== filter.make && filter.make !== "") {
        displayPost = false
    }
    if (modelYear < filter.registration_from && filter.registration_from !== "") {
        displayPost = false
    }
    if (modelYear > filter.registration_until && filter.registration_until !== "") {
        displayPost = false
    }
    if (price < filter.price_from && filter.price_from !== "") {
        displayPost = false
    }
    if (price > filter.price_until && filter.price_until !== "") {
        displayPost = false
    }
    if (mileage < filter.mileage_from && filter.mileage_from !== "") {
        displayPost = false
    }
    if (mileage > filter.mileage_until && filter.mileage_until !== "") {
        displayPost = false
    }
    return displayPost
}