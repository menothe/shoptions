import React, { useState } from 'react'
const loginState = {
    email: '',
    password: ''
}
const Login = () => {

    const [loginInfo, setLoginInfo] = useState(loginState)

    const handleChange = (e) => {
        const { name, value } = e.target

        setLoginInfo({ ...loginInfo, [name]: value })

    }

    const handleSubmit = (e) => {

        e.preventDefault();

        const { email, password } = loginInfo;

        fetch("http://localhost:8080/login", {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "email": email,
                "password": password,
            }),
        })
            .then(res => {
                console.log('hello ', res);
            })
    }

    return (
        <div className="signup-page">
            <form onSubmit={handleSubmit}>
                <label>Login
                    <input
                        name="email"
                        placeholder='Email'
                        value={loginInfo.email}
                        onChange={handleChange}
                        type="text" />
                    <input
                        name="password"
                        placeholder='Password'
                        value={loginInfo.password}
                        onChange={handleChange}
                        type="text" />
                </label>
                <button type="submit" >LOGIN</button>
            </form>
        </div>
    )
}

export default Login;