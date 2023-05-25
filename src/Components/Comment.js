export default function Comment({data}) {

    const {author, content, added} = data

    function formatTime(timeStamp){
        return new Date(timeStamp).toLocaleString()
    }

    return (
        <div className="card text-bg-light mb-3">
            <div className="card-body">
                <h6 className="card-title">{author}</h6>
                <p className="card-text">{content}</p>
                <small>{formatTime(added)}</small>
            </div>
        </div>
    )
}