import React, {useState} from 'react'
const emptyInfo = {
    userName: '',
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

        const { firstName, lastName, email, password, userName } = userInfo;

        // fetch("http://localhost:8080/signup", {
        //     method: "POST", // *GET, POST, PUT, DELETE, etc.
        //     mode: "no-cors",
        //     headers: {
        //       "Content-Type": "application/json",
        //       // 'Content-Type': 'application/x-www-form-urlencoded',
        //     },
        //     body: JSON.stringify({
        //         "userName": userName,
        //         "first_name": firstName,
        //         "last_name": lastName,
        //         "email": email,
        //         "password": password,
        //     }), // body data type must match "Content-Type" header
        //   })


        fetch("http://localhost:8080/login", {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: "no-cors",
            headers: {
              "Content-Type": "application/json",
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({
                "email": "a@b.com",
                "password": "fuckPaul",
            }), // body data type must match "Content-Type" header
          })
            .then(res => {
        console.log('jhello ', res);
        })
    }

    return (
        <div className="signup-page">
            <form onSubmit={handleSubmit}>
                <label>Signup
                <input
                    name="userName"
                    placeholder = 'User Name'
                    value={userInfo.userName}
                    onChange={handleChange}
                    type="text"/>
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