import { useSelector } from "react-redux"
import Post from "../Components/Post"

export default function FavouritePage(){

    const {favouritedPosts} = useSelector((store) => (store.user))
    const {allPosts} = useSelector((store) => (store.browse))

    console.log(allPosts);
    const posts = allPosts.map((post) => <Post key={post.id} postData={post} />).filter((post) => favouritedPosts.split(',').includes(`${post.props.postData.id}`))
    console.log(posts);

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