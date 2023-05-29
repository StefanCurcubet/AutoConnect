import { useSelector } from "react-redux"

export default function ConversationPartner({data, setSelectedConv}) {

    const {userInfo} = useSelector((store) => store.user)

    return (
            <div className="btn btn-light mt-2 no-border" onClick={() => setSelectedConv(data.id)}>
            {data.usernames === userInfo.username ? data.usernames[0] : data.usernames[1]}
            </div>
    )
}