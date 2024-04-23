import React, {useState} from 'react'
const emptyInfo = {
    firstName: '',
    lastName: '',
    email: '',
    password: ''
}
const Signup = () => {

    const [userInfo, setUserInfo] = useState(emptyInfo)

    const handleChange = (e) => {
        const { name, value } = e.target

        setUserInfo({...userInfo, [name]: value})

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("http://localhost:8080/signup")
            .then(res => {
        console.log('jhello ', res);
        })
    }

    return (
        <div className="signup-page">
            <form onSubmit={handleSubmit}>
                <label>Signup
                <input
                    name="firstName"
                    placeholder = 'First Name'
                    value={userInfo.firstName}
                    onChange={handleChange}
                    type="text"/>
                <input
                    name="lastName"
                    placeholder = 'Last Name'
                    value={userInfo.lastName}
                    onChange={handleChange}
                    type="text"/>
                <input
                    name="email"
                    placeholder = 'Email'
                    value={userInfo.email}
                    onChange={handleChange}
                    type="text"/>
                <input
                    name="password"
                    placeholder = 'Password'
                    value={userInfo.password}
                    onChange={handleChange}
                    type="text"/>
                </label>
                <button type="submit" >SIGN UP</button>
            </form>
        </div>
    )
}

export default Signup;