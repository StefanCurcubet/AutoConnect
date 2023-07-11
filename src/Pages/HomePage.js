import { useEffect } from "react";
import Post from "../Components/Post";
import FilterDropdown from "../Components/FilterDropdown";
import SortDropdown from "../Components/SortDropdown";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "../Features/postSlice";
import checkFilter from "../Utils/checkFilter";
import { getFavourites } from "../Features/userSlice";
import { getAllSellerRatings } from "../Features/postSlice";

export default function HomePage() {

    const dispatch = useDispatch()
    const {allPosts, orderby, filter, isLoading} = useSelector((store) => store.post)

    useEffect(() => {
        dispatch(getAllPosts())
        dispatch(getAllSellerRatings())
        if (localStorage.getItem('authTokens')){
            dispatch(getFavourites())
        }
    },[orderby])

    let posts = allPosts?.map((post) => <Post key={post.id} postData={post}/>).filter((post) => checkFilter(post, filter))

    return (
        <div className="container-lg mb-2">
            <div className="d-flex justify-content-between">
                <FilterDropdown />
                <SortDropdown />
            </div>
            {isLoading ? <h1 className="mt-5">Loading...</h1> : posts?.length === 0 ? <h1 className="mt-5">Sorry, no posts match your criteria</h1> : posts}
        </div>
    )
}