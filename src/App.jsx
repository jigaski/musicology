import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './Landing'
import Upload from './Upload'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/upload" element={<Upload />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App