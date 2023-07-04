import { useState } from "react"
import Modal from "react-modal"

export default function PasswordResetModal({passwordResetModalOpen, setPasswordResetModalOpen}) {

    const [userIdentifier, setUserIdentifier] = useState('')
    const [statusMessage, setStatusMessage] = useState('')

    const customStyles = {
        content: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'transparent',
            border: 'none',
        }
    }

    async function createPasswordReset() {
        const response = await fetch('http://127.0.0.1:8000/createReset/', {
            method: 'POST',
            headers: {
            'Content-type' : 'application/json',
            },
            body: JSON.stringify(userIdentifier)
        })
        if (response.status === 200) {
            let data = await response.json()
            setStatusMessage(data.message)
        } else {
            setStatusMessage("Something went wrong")
        }
    }

    return (
        <Modal
            isOpen={passwordResetModalOpen}
            style={customStyles}
            ariaHideApp={false}
        >
            <div className="card">
                <div className='card-header d-flex'>
                    <div>Password reset</div>
                    <i className="bi bi-x-lg ms-auto" style={{cursor: 'pointer'}} onClick={() => (setPasswordResetModalOpen(false), setStatusMessage(''), setUserIdentifier(''))} ></i>
                </div>
                {statusMessage === "" ?
                    <div className="card-body d-flex flex-column">
                        <label htmlFor="userIdentifier">Email or Username</label>
                        <input type="text" id="userIdentifier" value={userIdentifier} onChange={(e) => setUserIdentifier(e.target.value)} />
                        <button className="btn btn-primary mt-2" onClick={() => createPasswordReset()} disabled={userIdentifier === ''} >Send reset email</button>
                    </div>

                :
                    <p className="text-center p-3">{statusMessage}</p>
                }
            </div>
        </Modal>
    )
}