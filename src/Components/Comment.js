export default function Comment({data, listingAuthor}) {

    const {author, content, added} = data

    function formatTime(timeStamp){
        return new Date(timeStamp).toLocaleString()
    }

    return (
        <>
        {listingAuthor === author ?
            <div className="card bg-light border-primary-subtle mb-3">
                <div className="card-body">
                    <h6 className="card-title">{author} <strong className="bg-dark-subtle p-1">Owner</strong></h6>
                    <p className="card-text">{content}</p>
                    <small>{formatTime(added)}</small>
                </div>
            </div>
        :
            <div className="card bg-light mb-3">
                <div className="card-body">
                    <h6 className="card-title">{author}</h6>
                    <p className="card-text">{content}</p>
                    <small>{formatTime(added)}</small>
                </div>
            </div>
        }
        </>
    )
}