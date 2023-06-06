import { useEffect, useRef, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import ConversationPartner from "../Components/ConversationPartner"
import Message from "../Components/Message"
import { getConversations, getMessages } from "../Features/messagingSlice"


export default function MessagingPage() {

    const {conversations, messages, selectedConv} = useSelector((store) => store.messaging)
    const {userInfo} = useSelector((store) => store.user)
  
    const[reply, setReply] = useState()
    const dispatch = useDispatch()
    const largeScrollRef = useRef()
    const smallScrollRef = useRef()

    useEffect(() => {
        dispatch(getConversations())
    },[])
    
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
            dispatch(getMessages())
        } else {
            alert('Something went wrong.')
        }
    }

    async function handleMessage() {
        await sendMessage();
        dispatch(getConversations())
        setReply('')
    }

    async function handleSelect() {
        await dispatch(getMessages())
        dispatch(getConversations())
    }

    useEffect(() => {
        if (!selectedConv) {
            return
        }
        handleSelect()
    },[selectedConv])

    useEffect(() => {
        if (largeScrollRef.current) {
            largeScrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
        if (smallScrollRef.current) {
            smallScrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages])

    const allMessages = messages?.map((message) => <Message key={message.id} data={message} />)

    return (
        <>
            <div className="container-md d-flex d-md-flex d-md-none flex-column">
                <div className="d-flex m-auto w-100 flex-column mt-3">
                    <h5>Select conversation:</h5>
                    {conversations.map((conversation) => <ConversationPartner key={conversation.id} data={conversation}/>)}
                </div>
                <div className="d-flex mt-3 d-md-flex d-md-none flex-column">
                {!selectedConv ? <h3>Choose a conversation to display messages</h3> :
                        <>
                            {allMessages}
                            <hr ref={smallScrollRef}/>
                            <div className="card card-body d-flex no-border">
                                <textarea style={{borderRadius:"5px"}} placeholder="Type here..." value={reply} onChange={(e) => setReply(e.target.value)} />
                                <div className="d-flex">
                                    <button className="btn btn-outline-primary ms-auto me-2 mt-2" onClick={() => handleMessage()}>Send</button>
                                </div>
                            </div>
                        </>
                        }
                </div>
            </div>

            <div className="container-md d-none d-md-flex justify-content-center">
                <div className="d-flex mt-3 flex-column">
                    <h5>Select conversation:</h5>
                    {conversations.map((conversation) => <ConversationPartner key={conversation.id} data={conversation}/>)}
                </div>
                <div className="m-3 d-none d-md-flex w-75">
                    <div className="ms-5 me-5 mt-3 d-none d-md-flex flex-column w-75 shadow p-2">
                        {!selectedConv ? <h3 className="align-self-center mt-auto mb-auto w-75">Choose a conversation to display messages</h3> :
                        <>
                            <div className="d-flex flex-column w-100 message-area">  
                                {allMessages}
                                {messages[messages.length - 1]?.sender === userInfo.username && conversations.find((c) => c.id === selectedConv).update_from === '' ?
                                    <div className="card ms-auto me-2">
                                        <div className="card-body fw-light fst-italic p-2 text-secondary">
                                            Seen by recipient
                                        </div>
                                    </div>
                                : 
                                    null}
                                <hr ref={largeScrollRef}/>
                            </div>
                            <div className="card card-body d-flex no-border">
                                <textarea style={{borderRadius:"5px"}} placeholder="Type here..." value={reply} onChange={(e) => setReply(e.target.value)} />
                                <div className="d-flex">
                                    <button className="btn btn-outline-primary ms-auto me-2 mt-2" onClick={() => handleMessage()}>Send</button>
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

