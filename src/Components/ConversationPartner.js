import { useSelector, useDispatch } from "react-redux"
import { setSelectedConv } from "../Features/messagingSlice"

export default function ConversationPartner({data}) {

    const {userInfo} = useSelector((store) => store.user)
    const {selectedConv} = useSelector((store) => store.messaging)

    const dispatch = useDispatch()

    return (
        <div className={selectedConv === data.id ? "btn btn-secondary mt-2 no-border" : "btn btn-light mt-2 no-border"} onClick={() => dispatch(setSelectedConv(data.id))}>
            {data.usernames[0] === userInfo.username ? data.usernames[1] : data.usernames[0]}
            {data.update_from === userInfo.username || data.update_from === '' ? null : <i className="bi bi-exclamation-circle ms-1 text-primary"></i>} 
        </div>
    )
}