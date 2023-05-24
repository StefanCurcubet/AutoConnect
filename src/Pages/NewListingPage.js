import { useState } from "react"
import PreviewModal from "../Components/PreviewModal"

export default function NewListingPage() {

    const [previewOpen, setPreviewOpen] = useState(false)
    const [listingAdded, setListingAdded] = useState(false)
    const [listingData, setListingData] = useState({
        title : "",
        make : "",
        firstRegistration : 0,
        mileage : 0,
        price : 0,
        imageUrl: ""
    })

    function handleSubmit(e) {
        e.preventDefault()
        setPreviewOpen(true)
    }

    async function addListing() {
        const {access} = JSON.parse(localStorage.getItem('authTokens'))
        const response = await fetch (`http://127.0.0.1:8000/newListing/`, {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${access}`,
            },
            body: JSON.stringify({listingData})
        })
        if (response.status === 200) {
            setListingAdded(true)
         } else {
             alert('Something went wrong.')
         }
    }

    function createListing() {
        setPreviewOpen(false)
        addListing()
    }



    return (
        <>
        {listingAdded ?
            <div class="alert alert-success" role="alert">
                <h2>Your listing has been submitted.</h2>
            </div>
            :
            <div className="container-md d-flex justify-content-center">
                <form className="col-md-5" onSubmit={(e) => handleSubmit(e)}>
                    <div className="col mt-2">
                        <label htmlFor="title" className="form-label">Title</label>
                        <input type="text" className="form-control" id="title" placeholder="Title of your listing" onChange={(e) => setListingData((prevData) => ({...prevData, title : e.target.value}))} required/>
                    </div>
                    <div className="col mt-2">
                        <label htmlFor="make" className="form-label">Make</label>
                        <input type="text" className="form-control" id="make" placeholder="Make of your car" onChange={(e) => setListingData((prevData) => ({...prevData, make : e.target.value}))} required/>
                    </div>
                    <div className="col mt-2">
                        <label htmlFor="firstRegistration" className="form-label">First Registration</label>
                        <input type="number" className="form-control" id="firstRegistration" placeholder="First registration year" onChange={(e) => setListingData((prevData) => ({...prevData, firstRegistration : e.target.value}))} required/>
                    </div>
                    <div className="col mt-2">
                        <label htmlFor="mileage" className="form-label">Mileage(km)</label>
                        <input type="number" className="form-control" id="mileage" placeholder="Mileage in km" onChange={(e) => setListingData((prevData) => ({...prevData, mileage : e.target.value}))} required/>
                    </div>
                    <div className="col mt-2">
                        <label htmlFor="price" className="form-label">Price(EUR)</label>
                        <input type="number" className="form-control" id="price" placeholder="Price in Euros" onChange={(e) => setListingData((prevData) => ({...prevData, price : e.target.value}))} required/>
                    </div> 
                    <div className="col mt-2">
                        <label htmlFor="imageUrl" className="form-label">Image URL</label>
                        <input type="text" className="form-control" id="imageUrl" placeholder="Url link to the image of your car" onChange={(e) => setListingData((prevData) => ({...prevData, imageUrl : e.target.value}))} required/>
                    </div>
                    <div className="col mt-3">
                        <button className="btn btn-primary" type="submit">Preview Listing</button>
                    </div>
                </form>
                <PreviewModal previewOpen={previewOpen} setPreviewOpen={setPreviewOpen} createListing={createListing} listingData={listingData} />
            </div>
        }
        </>
    )
}