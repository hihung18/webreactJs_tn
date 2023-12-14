import React, { useRef, useState } from "react";
import "./Form.css";
import { Route, Routes } from "react-router-dom";
import { Form } from "react-bootstrap";


const Login = () => {
  const [tokenDevice] = React.useState(JSON.parse(localStorage.getItem("tokenDevice")));
  const hostLogin = process.env.REACT_APP_HOST_SIGN_IN;
  const hostUsers = process.env.REACT_APP_HOST_USERS;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  const UpdateUser = async (loginResponse, tokenDevice) => {
    const response = await fetch(hostUsers + loginResponse.id, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + loginResponse.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: loginResponse.id,
        email: loginResponse.email,
        username: loginResponse.username,
        password: "",
        fullName: loginResponse.fullName,
        phoneNumber: loginResponse.phoneNumber,
        address: loginResponse.address,
        tokeDevice: tokenDevice,
        roleName: "ROLE_QL",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update user");
    }
    const data = await response.json();
    console.log("ok "+data);
  }
  const HandleLogin = async () => {
    const credentials = {
      username: username,
      password: password,
    };
    console.log(username, password);
    console.log(hostLogin);
    const response = await fetch(hostLogin, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (response.ok) {
      const loginResponse = await response.json();
      localStorage.setItem("auth", JSON.stringify(loginResponse));
      if (loginResponse.roles[0] === "ROLE_QL") {
        if (loginResponse.tokenDevice !== tokenDevice) {
          UpdateUser(loginResponse, tokenDevice)
        }
        window.location = '/business-trip';
      }
      else {
        setStatus("user not found!");
      }
    } else {
      setStatus("user not found!");
    }
  };
  const LogonButton = useRef();
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      console.log(LogonButton);
      HandleLogin().catch((err) => console.log(err));
    }
  };
  return (
    <div className="form-container">
      <div className="form-content-left">
        <img style={{width: '500px'}} src="img/logoHQremovebg.png" alt="spaceship" className="form-img" />
      </div>
      <div className="form-content-right">
        <form className="form">
          <h1 style={{color: "#000"}}>Sign In</h1>
          <div className="form-inputs">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              id="email"
              type="text"
              name="email"
              className="form-input"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-inputs">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              className="form-input"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          {status && <div className="status">{status}</div>}

          <button
            ref={LogonButton}
            className="form-input-btn"
            type="button"
            onClick={() => {
              HandleLogin();
            }}
          >
            Submit
          </button>
          <Routes>
              <Route path="/signup" element={<Form/>}/>
          </Routes>
        </form>
      </div>
    </div>
  );
};

export default Login;
