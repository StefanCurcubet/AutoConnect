import { useSelector } from "react-redux"

export default function Message({data}) {

    const {userInfo} = useSelector((store) => store.user)

    function formatTime(timeStamp){
        return new Date(timeStamp).toLocaleString()
    }

    return (
        <>
            {userInfo.username === data.sender ?
                <div className="card mb-2 mt-2 bg-primary-subtle ms-auto me-2 max-width-80">
                    <div className="card-body">
                        {data.content}
                    </div>
                    <div className="card-footer" style={{fontStyle:"italic", fontSize:"smaller"}}>
                        {formatTime(data.added)}
                    </div>
                </div>
            :
            <div className="card mb-2 mt-2 ms-2 me-auto max-width-80">
                <div className="card-body">
                    {data.content}
                </div>
                <div className="card-footer">
                    {data.sender}
                    <div style={{fontStyle:"italic", fontSize:"smaller"}}>
                        {formatTime(data.added)}
                    </div>
                </div>
            </div>
            }
        </>
    )
}