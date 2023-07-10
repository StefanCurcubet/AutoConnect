import Modal from 'react-modal';
import { newConversation, setMessageModalOpen } from '../Features/messagingSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function MessageModal({recipient}) {

    const {messageModalOpen, isLoading, messageSent} = useSelector((store) => store.messaging)
    const {isLogged} = useSelector((store) => store.user)
    const dispatch = useDispatch()
    const [newMessage, setNewMessage] = useState('')

    const customStyles = {
        content: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'transparent',
          border: 'none',
        },
    };

    function handleMessage() {
        dispatch(newConversation({recipient, newMessage}))
        setNewMessage('')
    }

    return (
        <Modal
            isOpen={messageModalOpen}
            style={customStyles}
        >
            {isLogged ?
                (messageSent ?
                    <div>
                    <div className="card">
                        <div className='card-title p-3'>
                            Message sent to <strong>{recipient}</strong>
                        </div>
                        <div className='card-footer d-flex justify-content-between align-items-center'>
                            <Link to={'/messaging'} className="btn btn-success" >
                                Messages
                            </Link>
                            <button className='btn btn-danger ms-2' onClick={() => {dispatch(setMessageModalOpen(false))}}>OK</button>
                        </div>
                    </div>
                </div>
                :
                <div>
                    <div className="card p-0">
                        <div className='card-header p-1'>
                            Message: {recipient}
                        </div>
                        <textarea className='no-border' placeholder='Type here...' onChange={(e) => setNewMessage(e.target.value)} value={newMessage}/>
                        <div className='card-footer d-flex mt-2'>
                            <button className='btn btn-success' onClick={() => handleMessage()}>Send Message</button>
                            <button className='btn btn-danger ms-2' onClick={() => {dispatch(setMessageModalOpen(false)); setNewMessage('')}}>Cancel</button>
                        </div>
                    </div>
                </div>
                )
            :
                <div className="card text-center">
                    <div className='card-body'>
                        <h5 className='card-title'>Hello, Guest</h5>
                        <div className='card-text'>
                            If you would like to message <strong>{recipient}</strong> please log in
                        </div>
                    </div>
                        <div className='card-footer'>
                            <Link to={'/login'} className="btn btn-primary" >
                                Log in
                            </Link>
                            <button className='btn btn-danger ms-3' onClick={() => {dispatch(setMessageModalOpen(false))}}>Close</button>
                        </div>
                </div>
            }
        </Modal>
    )
}