import { useEffect } from "react";
import { useState } from "react";
import Modal from "react-modal"
import { useDispatch, useSelector } from "react-redux"
import { createPin, setSettingsModal, updateSettings, verifyPin } from "../Features/userSlice";
import { FadeLoader } from "react-spinners";

export default function SettingsModal() {

    const customStyles = {
        content: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'transparent',
          border: 'none',
        },
    };

    const {settingsModalOpen, settings, pinCorrect, isLoading} = useSelector((store) => store.user)
    const [modifiedSettings, setModifiedSettings] = useState({
        email : '',
        notify_by_mail_message: false,
        notify_by_mail_comment: false,
    })
    const [isModified, setIsModified] = useState(false)
    const [emailPinWindow, setEmailPinWindow] = useState(false)
    const [emailPin, setEmailPin] = useState('')
    const [updateSent, setUpdateSent] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        if (Object.keys(settings).length !== 0) {
            setModifiedSettings(settings)
        }
    }, [settings])

    useEffect(() => {
        if (!settings) {
            return
        }
        setIsModified(false)
        if (modifiedSettings.email !== settings.email) {
            setIsModified(true)
        }
        if (modifiedSettings.notify_by_mail_message !== settings.notify_by_mail_message) {
            setIsModified(true)
        }
        if (modifiedSettings.notify_by_mail_comment !== settings.notify_by_mail_comment) {
            setIsModified(true)
        }
    },[modifiedSettings])

    useEffect(() => {
        if (pinCorrect) {
            dispatch(updateSettings(modifiedSettings),
            setEmailPin(''),
            setUpdateSent(true))
        }
    }, [pinCorrect])

    function handleSave() {
        if (modifiedSettings.email !== settings.email || settings.email_confirmed === false) {
            dispatch(createPin())
            setEmailPinWindow(true)
            return
        }
        dispatch(updateSettings(modifiedSettings),
        setUpdateSent(true))
    }

    return (
        <Modal
            isOpen={settingsModalOpen}
            style={customStyles}
            ariaHideApp={false}
        >
            <div className="card">
                <div className='card-header d-flex justify-content-between'>
                    <div>Settings</div>
                    <i className="bi bi-x-lg ms-2" style={{cursor: 'pointer'}} onClick={() => (dispatch(setSettingsModal(false)), setUpdateSent(false), setEmailPinWindow(false))}></i>
                </div>
                <div className="card-body d-flex flex-column">
                    {updateSent ?
                        isLoading ? 
                            <FadeLoader loading={isLoading} cssOverride={{left: '36px'}} />
                        :
                            <h2 className="text-success text-center">Settings Updated !</h2>
                    :
                        <>
                            {emailPinWindow ?
                                <>
                                    <h6>Email sent to {modifiedSettings.email} containing the validation PIN</h6>
                                    <input type="text" className="form-control mt-1" id="pin" value={emailPin} placeholder="enter PIN here"  onChange={(e) => setEmailPin(e.target.value)} required/>
                                    <button className="btn btn-success mt-2" onClick={() => dispatch(verifyPin(emailPin))}>Confirm</button>
                                </>
                            :
                                <>
                                    {settings.email_confirmed ?
                                        <>
                                            <label htmlFor="email" className="form-label">Email adress:</label>
                                            <input type="text" className="form-control" id="email" value={modifiedSettings?.email} onChange={(e) => setModifiedSettings((prevSetting) => ({...prevSetting, email : e.target.value}))} required/>
                                            <h6 className="mt-2">Notify me by email for:</h6>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="messages" onChange={(e) => setModifiedSettings((prevSetting) => ({...prevSetting, notify_by_mail_message : e.target.checked}))} checked={modifiedSettings?.notify_by_mail_message}/>
                                                <label className="form-check-label" htmlFor="messages">
                                                    Messages received
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="comments" onChange={(e) => setModifiedSettings((prevSetting) => ({...prevSetting, notify_by_mail_comment : e.target.checked}))} checked={modifiedSettings?.notify_by_mail_comment}/>
                                                <label className="form-check-label" htmlFor="comments">
                                                    Comments on my listings
                                                </label>
                                            </div>
                                            <button className="btn btn-success mt-2" disabled={!isModified} onClick={() => handleSave()}>Save Changes</button>
                                        </>
                                    : 
                                        <>
                                            <h5>Please confirm your email</h5>
                                            <h4 className="bg-light p-1">{modifiedSettings?.email}</h4>
                                            <button className="btn btn-success mt-2" onClick={() => handleSave()}>Confirm</button>
                                        </>
                                    }
                                </>
                            }
                        </>
                    }
                </div>
            </div>
        </Modal>
    )
}