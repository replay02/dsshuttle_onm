import React from "react";
// import ReactDOM from 'react-dom';
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import { Router, Route } from "react-router-dom";
import Dashboard from "./DashBoard/Dashboard";
import { signIn } from './Login/Auth';

// function handleClick() {
//   return (
//     <Router>
//       <Route exact path="/dashboard" component={Dashboard} />
//     </Router>
//   );
// }

function App() {
  const [user, setUser] = useState(null);
  const authenticated = user != null;

  const login = ({ email, password }) => setUser(signIn({ email, password }));
  const logout = () => setUser(null);

  return (

  )
}

// ReactDOM.render(<App />, document.querySelector('#app'));

export default App;

// const AppBarExampleIcon = () => (
//   <AppBar
//     title="Title"
//     iconClassNameRight="muidocs-icon-navigation-expand-more"
//   />
// );

// export default AppBarExampleIcon;
