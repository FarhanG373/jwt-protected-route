import logo from "./logo.svg";
import "./App.scss";
import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [post, setPost] = useState("");
  const [login, setLogin] = useState(true);
  const submit = async (e) => {
    e.preventDefault();
    const loginData = await axios.post("http://localhost:9090/login", {
      email,
      password,
    });
    console.log(loginData.status);
    if (loginData.status === 200) {
      localStorage.setItem(
        "loginData",
        JSON.stringify({
          login: login,
          token: loginData.data.token,
        })
      );
    } else if (loginData.status === 401) {
      alert("Invalid Credentials");
    }
  };
  const getLogin = () => {
    let log = JSON.parse(localStorage.getItem("loginData"));
    if (log && log.login) {
      setLogin(false);
    }
  };
  const createPost = async (e) => {
    e.preventDefault();
    let log = JSON.parse(localStorage.getItem("loginData"));
    const tocken = "Bearer " + log.token;
    let config = {
      headers: { Authorization: tocken },
    };
    axios
      .post(`http://localhost:9090/posts`, post, config)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };
  const logOut = () => {
    localStorage.removeItem("loginData");
    setLogin(true);
    setEmail('');
    setPassword('');
    setPost('');
  };
  useEffect(() => {
    getLogin();
  }, []);
  return (
    <div className="App">
      {login && (
        <form onSubmit={submit}>
          <div className="row">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />{" "}
          </div>
          <div className="row">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />{" "}
          </div>

          <div className="row">
            <input type="submit" className="form-control" value="login" />{" "}
          </div>
        </form>
      )}
      <form onSubmit={createPost}>
        <div className="row">
          <textarea onChange={(e) => setPost(e.target.value)}></textarea>
        </div>
        <div className="row">
          <input type="submit" className="form-control" value="Create Post" />{" "}
        </div>
      </form>
      {!login && <button onClick={logOut}>Log Out</button>}
    </div>
  );
}

export default App;
