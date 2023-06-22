import { useSelector } from "react-redux"
import Post from "../Components/Post"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function FavouritePage(){

    const {favouritedPosts, isLogged} = useSelector((store) => (store.user))
    const {allPosts} = useSelector((store) => (store.browse))
    const navigate = useNavigate()

    useEffect(() => {
        if (!isLogged) {
            navigate('/')
        }
    },[])

    const posts = allPosts.map((post) => <Post key={post.id} postData={post} />).filter((post) => favouritedPosts.split(',').includes(`${post.props.postData.id}`))

    return (
        <div className="container-lg mb-2"> 
            {favouritedPosts === "" ?
                <h1 className="mt-5">
                    You haven't got any favourites yet.
                </h1> 
                :
                posts
            }
        </div>
    )
}