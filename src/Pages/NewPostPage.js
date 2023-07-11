import { useState } from "react"
import PreviewModal from "../Components/PreviewModal"
import { useSelector } from "react-redux"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function NewPostPage() {

    const [previewOpen, setPreviewOpen] = useState(false)
    const [postAdded, setPostAdded] = useState(false)
    const [postData, setPostData] = useState({
        title : "",
        make : "",
        firstRegistration : 0,
        mileage : 0,
        price : 0,
        imageUrl: "",
        description: ""
    })
    const {isLogged} = useSelector((store) => store.user)
    const navigate = useNavigate()

    useEffect(() => {
        if (!isLogged) {
            navigate('/')
        }
    },[])

    function handleSubmit(e) {
        e.preventDefault()
        setPreviewOpen(true)
    }

    async function addPost() {
        const {access} = JSON.parse(localStorage.getItem('authTokens'))
        const response = await fetch (`http://127.0.0.1:8000/newPost/`, {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${access}`,
            },
            body: JSON.stringify({postData})
        })
        if (response.status === 200) {
            setPostAdded(true)
         } else {
             alert('Something went wrong.')
         }
    }

    function createPost() {
        setPreviewOpen(false)
        addPost()
    }



    return (
        <>
        {postAdded ?
            <div class="alert alert-success" role="alert">
                <h2>Your listing has been submitted.</h2>
            </div>
            :
            <div className="container-md d-flex justify-content-center">
                <form className="col-md-5" onSubmit={(e) => handleSubmit(e)}>
                    <div className="col mt-2">
                        <label htmlFor="title" className="form-label">Title</label>
                        <input type="text" className="form-control" id="title" placeholder="Title of your listing" onChange={(e) => setPostData((prevData) => ({...prevData, title : e.target.value}))} required/>
                    </div>
                    <div className="col mt-2">
                        <label htmlFor="make" className="form-label">Make</label>
                        <input type="text" className="form-control" id="make" placeholder="Make of your car" onChange={(e) => setPostData((prevData) => ({...prevData, make : e.target.value}))} required/>
                    </div>
                    <div className="col mt-2">
                        <label htmlFor="firstRegistration" className="form-label">First Registration</label>
                        <input type="number" className="form-control" id="firstRegistration" placeholder="First registration year" onChange={(e) => setPostData((prevData) => ({...prevData, firstRegistration : e.target.value}))} required/>
                    </div>
                    <div className="col mt-2">
                        <label htmlFor="mileage" className="form-label">Mileage(km)</label>
                        <input type="number" className="form-control" id="mileage" placeholder="Mileage in km" onChange={(e) => setPostData((prevData) => ({...prevData, mileage : e.target.value}))} required/>
                    </div>
                    <div className="col mt-2">
                        <label htmlFor="price" className="form-label">Price(EUR)</label>
                        <input type="number" className="form-control" id="price" placeholder="Price in Euros" onChange={(e) => setPostData((prevData) => ({...prevData, price : e.target.value}))} required/>
                    </div> 
                    <div className="col mt-2">
                        <label htmlFor="imageUrl" className="form-label">Image URL</label>
                        <input type="text" className="form-control" id="imageUrl" placeholder="Url link to the image of your car" onChange={(e) => setPostData((prevData) => ({...prevData, imageUrl : e.target.value}))} required/>
                    </div>
                    <div className="col mt-2">
                        <label htmlFor="description" className="form-label">Description</label>
                        <input type="text" className="form-control" id="description" placeholder="Description of your listing" onChange={(e) => setPostData((prevData) => ({...prevData, description : e.target.value}))} required/>
                    </div>
                    <div className="col mt-3">
                        <button className="btn btn-primary" type="submit">Preview Listing</button>
                    </div>
                </form>
                <PreviewModal previewOpen={previewOpen} setPreviewOpen={setPreviewOpen} createPost={createPost} postData={postData} />
            </div>
        }
        </>
    )
}