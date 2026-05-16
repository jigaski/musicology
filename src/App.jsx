import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './Landing'
import Upload from './Upload'
import HowItWorks from './HowItWorks'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App