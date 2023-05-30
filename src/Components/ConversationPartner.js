import { useSelector, useDispatch } from "react-redux"
import { setSelectedConv } from "../Features/messagingSlice"

export default function ConversationPartner({data}) {

    const {userInfo} = useSelector((store) => store.user)
    const dispatch = useDispatch()

    return (
            <div className="btn btn-light mt-2 no-border" onClick={() => dispatch(setSelectedConv(data.id))}>
            {data.usernames === userInfo.username ? data.usernames[0] : data.usernames[1]}
            </div>
    )
}