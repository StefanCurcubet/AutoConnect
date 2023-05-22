import { useEffect, useState } from "react"
import { loginUser, createUser } from "../Features/userSlice"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

export default function AuthPage() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {isLogged} = useSelector((store) => store.user)
    const [hasAccount, setHasAccount] = useState(true)
    const [userData, setUserData] = useState({
        username : "",
        password : "",
        passwordConf : ""
    })

    useEffect(()=> {
        if(isLogged) {
            navigate('/')
        }
    }, [isLogged])

    return (
        <div className="container-fluid d-flex justify-content-center">
            <div className="card text-center mt-5" style={{width: "18rem"}}>
                <div className="card-header">
                    Do you have an account ?
                    <div className="btn-group mt-1" role="group">
                        <input type="radio" className="btn-check" name="authtype" id="btnlogin" autoComplete="off" checked={hasAccount} onChange={(e) => setHasAccount(true)}/>
                        <label className="btn btn-outline-success" htmlFor="btnlogin">Yes</label>
                        <input type="radio" className="btn-check" name="authtype" id="btncreate" autoComplete="off"/>
                        <label className="btn btn-outline-success" htmlFor="btncreate" onClick={(e) => setHasAccount(false)}>No</label>
                    </div>
                </div>
                <div className="card-body">
                    <label htmlFor="username-input">Username</label>
                    <input type="username" className="form-control" id="username-input" onChange={(e) => setUserData({...userData, username : e.target.value})}></input>
                    <label htmlFor="password-input">Password</label>
                    <input type="password" className="form-control" id="password-input" onChange={(e) => setUserData({...userData, password : e.target.value})}></input>
                    {hasAccount ?
                        null
                        :
                        <>
                            <label htmlFor="password-confirm">Confirm Password</label>
                            <input type="password" className="form-control" id="password-confirm" onChange={(e) => setUserData({...userData, passwordConf : e.target.value})}/>
                        </>
                    }
                </div>
                <div className="card-footer">
                    <button className="btn btn-secondary" onClick={() => hasAccount ? dispatch(loginUser({'username' : userData.username, 'password' : userData.password})) : userData.password === userData.passwordConf ? dispatch(createUser({'username' : userData.username, 'password' : userData.password})) : null}>{hasAccount ? "Log In" : "Create Account"}</button>
                    {!hasAccount && userData.password !== userData.passwordConf ? <p>Password confirmation does not match</p> : null}
                </div>
            </div>
        </div>
    )
}