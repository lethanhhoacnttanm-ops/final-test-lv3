import './index.css'
import ListTeacher from './components/ListTeacher.jsx';
import NewTeacher from './components/NewTeacher.jsx';
import ListTeacherPosition from './components/ListTeacherPosition.jsx';
import NewPosition from './components/NewPosition.jsx';
import {Route, Routes} from 'react-router-dom'

function App() {
  return (
    <div style={{ padding: '20px'}}>
      <header style={{ marginBottom: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div>
          <p style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>Giao diện danh sách</p>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Quản lý giáo viên và vị trí công tác</h1>
        </div>
      </header>

      <main>
        <Routes>

           <Route path='/' element={<ListTeacher />}>
              <Route path='createteacher' element={<NewTeacher />}/>
           </Route> 
           
           <Route path='/ListTeacherPosition' element={<ListTeacherPosition />}>
              <Route path='createposition' element={<NewPosition />}/>
           </Route>

        </Routes>
      </main>
    </div>
  )
}

export default App
