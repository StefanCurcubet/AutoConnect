import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import ConversationPartner from "../Components/ConversationPartner"
import Message from "../Components/Message"

export default function MessagingPage() {

    const {userInfo} = useSelector((store) => store.user)
    const[conversations, setConversations] = useState([])
    const[selectedConv, setSelectedConv] = useState()
    const[messages, setMessages] = useState()
    const[reply, setReply] = useState()

    async function getConversations() {
        const {access} = JSON.parse(localStorage.getItem('authTokens'))
        const response = await fetch (`http://127.0.0.1:8000/getConversations/`, {
            method: 'GET',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${access}`,
            },
        })
        if (response.status === 200) {
            const data = await response.json()
            setConversations(data)
            console.log(data);
         } else {
            alert('something is wrong')
         }
    }

    async function getMessages() {
        const {access} = JSON.parse(localStorage.getItem('authTokens'))
        const response = await fetch (`http://127.0.0.1:8000/getMessages/${selectedConv}`, {
            method: 'GET',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${access}`,
            },
        })
        if (response.status === 200) {
            const data = await response.json()
            setMessages(data);
         } else {
            alert('something is wrong')
         }
    }

    async function sendMessage() {
        const {access} = JSON.parse(localStorage.getItem('authTokens'))
        const response = await fetch (`http://127.0.0.1:8000/addMessage/${selectedConv}`, {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${access}`,
            },
            body: JSON.stringify({reply})
        })
        if (response.status === 200) {
            getMessages()
        } else {
            alert('Something went wrong.')
        }
    }

    function handleMessage() {
        sendMessage();
        setReply('')
    }

    useEffect(() => {
        getConversations()
    },[])

    useEffect(() => {
        if (!selectedConv) {
            return
        }
        getMessages()
    },[selectedConv])

    const conversations_list = conversations.map((conversation) => <ConversationPartner key={conversation.id} data={conversation} setSelectedConv={setSelectedConv} />)
    const allMessages = messages?.map((message) => <Message key={message.id} data={message} />)

    return (
        <>
            <div className="container-md d-flex d-md-flex d-md-none flex-column">
                <div className="d-flex m-auto w-100 flex-column mt-3">
                    <h5>Select conversation:</h5>
                    {conversations_list}
                </div>
                <div className="d-flex mt-3 d-md-flex d-md-none flex-column">
                {!selectedConv ? <h3>Choose a conversation to display messages</h3> :
                        <>
                         {allMessages}
                        <hr/>
                        <div className="card card-body d-flex no-border">
                            <textarea style={{borderRadius:"5px"}} placeholder="Type here..." value={reply} onChange={(e) => setReply(e.target.value)} />
                            <div className="d-flex">
                                <button className="btn btn-outline-primary me-2 mt-2" onClick={() => handleMessage()}>Send</button>
                            </div>
                        </div>
                        </>
                        }
                </div>
            </div>

            <div className="container-md d-none d-md-flex justify-center">
                <div className="d-flex mt-3 flex-column">
                    <h5>Select conversation:</h5>
                    {conversations_list}
                </div>
                <div className="m-3 d-none d-md-flex w-75">
                    <div className="ms-5 me-5 mt-3 d-none d-md-flex flex-column w-75">
                        {!selectedConv ? <h3>Choose a conversation to display messages</h3> :
                        <>
                         {allMessages}
                        <hr/>
                        <div className="card card-body d-flex no-border">
                            <textarea style={{borderRadius:"5px"}} placeholder="Type here..." value={reply} onChange={(e) => setReply(e.target.value)} />
                            <div className="d-flex">
                                <button className="btn btn-outline-primary me-2 mt-2" onClick={() => handleMessage()}>Send</button>
                            </div>
                        </div>
                        </>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

