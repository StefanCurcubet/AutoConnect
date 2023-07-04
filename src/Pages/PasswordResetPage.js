import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

export default function PasswordResetPage() {

    const {resetCode} = useParams()
    const [isValidCode, setIsValidCode] = useState(true)
    const [resetData, setResetData] = useState({
        password: '',
        passwordConf: ''
    })
    const [statusMessage, setStatusMessage] = useState('')

    async function checkReset() {
        const response = await fetch(`http://127.0.0.1:8000/checkReset/${resetCode}`)
        const data = await response.json()
        setIsValidCode(data)
    }

    useEffect(() => {
        checkReset()
    },[])

    async function resetPassword() {
        if (resetData.password !== resetData.passwordConf) {
            setStatusMessage('Password confirmation did not match')
            return
        }
        const response = await fetch(`http://127.0.0.1:8000/resetPassword/${resetCode}`, {
            method: 'PUT',
            headers: {
            'Content-type' : 'application/json',
            },
            body: JSON.stringify(resetData.password)
        })
        if (response.status === 200) {
            let data = await response.json()
            setStatusMessage(data.message)
        } else {
            setStatusMessage("Something went wrong")
        }
    }

    return (
        <>
            {isValidCode ?
                <div className="container-fluid d-flex flex-column justify-content-center align-items-center">
                    <h3 className="mt-3">Password Reset</h3>
                    <div className="card p-2 mt-4 text-center">
                        <label htmlFor="password-input">New password</label>
                        <input type="password" className="form-control" id="password-input" onChange={(e) => setResetData({...resetData, password : e.target.value})}/>
                        <label htmlFor="password-confirm">Confirm new password</label>
                        <input type="password" className="form-control" id="password-confirm" onChange={(e) => setResetData({...resetData, passwordConf : e.target.value})}/>
                        <button className="btn btn-primary mt-2" disabled={resetData.password === ''} onClick={() => resetPassword()}>Reset</button>
                    </div>
                    {statusMessage}
                </div>
            :
                <h3 className="mt-3 ms-3">Invalid reset code.</h3>
            }
        </>
    )
}