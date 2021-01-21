import "./App.css";
import {useState, useEffect} from "react";
import Axios from "axios";
function App() {
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [passwordList, setPasswordList] = useState([]);
  const [usernameReg, setUsernameReg] = useState("");
  const [passwordReg, setPasswordReg] = useState("");

  const [username, setUsername] = useState("");
  const [password2, setPassword2] = useState("");

  const [loginStatus, setLoginStatus] = useState("");

  const register = () => {
    Axios.post("http://localhost:3001/register", {
      username: usernameReg, 
      password: passwordReg,
    }).then((response) => {
      console.log(response);
    });
  };

  const login = () => {
    Axios.post("http://localhost:3001/login", {
      username: username, 
      password: password2,
    }).then((response) => {

      if (response.data.message) {
        setLoginStatus(response.data.message);
      } else {
        setLoginStatus("Welcome!");
      }
    });
  };

  useEffect(() =>{
    Axios.get("http://localhost:3001/showpasswords").then((response) => {
      setPasswordList(response.data);
    });
  }, []);
  const addPassword = () => {
    Axios.post("http://localhost:3001/addpassword", {
      password: password, 
      title: title,
    });
  };

  const decryptPassword = (encryption) => {
    Axios.post("http://localhost:3001/decryptpassword", {
      password: encryption.password, 
      iv: encryption.iv,
    }).then((response) => {
        setPasswordList(passwordList.map((val) => {
          return val.id === encryption.id ? {id: val.id, password: val.password, title: response.data, iv: val.iv} : val;
        }));
    });
  };

  return ( <div className="App">

    <div className="registration">
      <h1>Registration</h1>
      <label>Username</label>
      <input type="text" onChange={(e) => {setUsernameReg(e.target.value)}} />
      <label>Password</label>
      <input type="text" onChange={(e) => {setPasswordReg(e.target.value)}}/>
      <button onClick={register}>Register</button>
    </div>
    

    <div className="login">
      <h1>Login</h1>
      <label>Username</label>
      <input type="text" placeholder="Username..." onChange={(e) => {setUsername(e.target.value)}}/>
      <label>Password</label>
      <input type="password" placeholder="Password..." onChange={(e) => {setPassword2(e.target.value)}}/>
      <button onClick={login}>Login</button>
    </div>

<h1>{loginStatus}</h1>

    <div className="AddingPassword">
      <input 
      type="text" 
      placeholder="Ex. password1234" 
      onChange={(event) => {
        setPassword(event.target.value);
        }}
      />
      <input 
      type="text" 
      placeholder="Ex. Facebook" 
      onChange={(event) => {
        setTitle(event.target.value);
        }}
      />
      <button onClick={addPassword}>Add Password</button>
    </div>

    <div className="Passwords">
        {passwordList.map((val, key) => {
          return (
          <div className="password" 
          onClick={() => {
            decryptPassword({ password: val.password, iv: val.iv, id: val.id });
          }}
          key = {key}
          > 
          <h3>{val.title}</h3> 
          </div>
          );
        })}
    </div>
  </div>
  );
}

export default App;
