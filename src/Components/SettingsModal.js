import { useEffect } from "react";
import { useState } from "react";
import Modal from "react-modal"
import { useDispatch, useSelector } from "react-redux"
import { setSettingsModal, updateSettings } from "../Features/userSlice";
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

    const {settingsModalOpen, settings, isLoading} = useSelector((store) => store.user)
    const [modifiedSettings, setModifiedSettings] = useState({
        email : '',
        notify_by_mail_message: false,
        notify_by_mail_comment: false,
    })
    const [isModified, setIsModified] = useState(false)
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
        if (modifiedSettings.email != settings.email) {
            setIsModified(true)
        }
        if (modifiedSettings.notify_by_mail_message != settings.notify_by_mail_message) {
            setIsModified(true)
        }
        if (modifiedSettings.notify_by_mail_comment != settings.notify_by_mail_comment) {
            setIsModified(true)
        }
    },[modifiedSettings])

    return (
        <Modal
            isOpen={settingsModalOpen}
            style={customStyles}
            ariaHideApp={false}
        >
            <div className="card">
                <div className='card-header d-flex'>
                    <div>Settings</div>
                    <i className="bi bi-x-lg ms-auto" style={{cursor: 'pointer'}} onClick={() => (dispatch(setSettingsModal(false)), setUpdateSent(false))}></i>
                </div>
                <div className="card-body d-flex flex-column">
                    {updateSent ?
                        isLoading ? 
                            <FadeLoader loading={isLoading}/>
                        :
                            <h2 className="text-success">Settings Updated !</h2>
                    :
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
                            <button className="btn btn-success mt-2" disabled={!isModified} onClick={() => dispatch(updateSettings(modifiedSettings), setUpdateSent(true))}>Save Changes</button>
                        </>
                    }
                </div>
            </div>
        </Modal>
    )
}