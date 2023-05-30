import Modal from 'react-modal';
import { newConversation, setMessageModalOpen } from '../Features/messagingSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';

export default function MessageModal({recipient}) {

    const {messageModalOpen} = useSelector((store) => store.messaging)
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
        dispatch(setMessageModalOpen(false))
    }

    return (
        <Modal
            isOpen={messageModalOpen}
            style={customStyles}
            ariaHideApp={false}
        >
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
        </Modal>
    )
}