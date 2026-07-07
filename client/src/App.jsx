import './index.css'
import Mainlayout from './pages/Mainlayout.jsx';
import TeachersPage from './components/TeachersPage.jsx';
import PositionsPage from './components/PositionsPage.jsx';
import {Route, Routes} from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Mainlayout />}>
        <Route index element={<TeachersPage />} />
        <Route path="list-teacher-position" element={<PositionsPage />} />
      </Route>
    </Routes>
  )
}

export default App
