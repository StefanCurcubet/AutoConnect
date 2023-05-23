import Modal from 'react-modal';

export default function PreviewModal({previewOpen, setPreviewOpen, listingData, createListing}) {

    const {title, imageUrl, make, firstRegistration, mileage, price} = listingData

    const customStyles = {
        content: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'transparent',
          border: 'none',
        },
    };

    return (
        <Modal
            isOpen={previewOpen}
            style={customStyles}
            ariaHideApp={false}
        >
            <div>
                <div className="card">
                    <div className="row g-0">
                        <div className="col-md-4">
                            <img src={imageUrl} className="img-fluid rounded-start" alt="carImage"/>
                        </div>
                        <div className="col-md-8">
                            <div className="card-body">
                                <h5 className="card-title mb-4" >
                                    <strong>{title}</strong>
                                    <strong className="ms-5 text-danger"> {price} EUR</strong>
                                </h5>
                                <p className="card-text">{make}</p>
                                <p className="card-text">{firstRegistration}</p>
                                <p className="card-text">{mileage} km</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='d-flex mt-3'>
                    <button className='btn btn-success' onClick={() => createListing()}>Submit Listing</button>
                    <button className='btn btn-danger ms-2' onClick={() => setPreviewOpen(false)}>Cancel</button>
                </div>
            </div>
        </Modal>
    )
}