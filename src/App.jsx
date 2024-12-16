import {Route, BrowserRouter as Router, Routes} from 'react-router-dom'
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Pnf from './pages/Pnf/Pnf';


function App() {


  return (
    <>
     <div className="">
      <Router>
        <Routes>
          <Route path="/dashboard" exact element={<Home />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/signup" exact element={<Signup />} />
          <Route path="/*" exact element={<Pnf />} />
        </Routes>
      </Router>
     </div>
    </>
  )
}

export default App
