import './assets/App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Homepage from "./pages/Homepage";

function App() {
  return (
      <Router>
          <Routes>
              <Route path='/' element={<Homepage/>} />
              <Route path='/login' element={<Login/>} />
          </Routes>
      </Router>
  );
}

export default App;
