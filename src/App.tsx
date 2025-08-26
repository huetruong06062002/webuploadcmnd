import { App as AntApp, Typography } from 'antd'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import IdCardUpload from './components/IdCardUpload'
import './App.css'

function App() {
  return (
    <AntApp>
      <BrowserRouter>
        <div className="container py-10">
          <Typography.Title level={2} className="text-center mb-8">
            Upload CMND/CCCD
          </Typography.Title>
          <Routes>
            <Route path="/" element={<IdCardUpload />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AntApp>
  )
}

export default App
