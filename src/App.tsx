import { App as AntApp } from 'antd'
import { useState } from 'react'
import CommonHeader from './Layout/CommonHeader'
import IdCardUpload from './components/IdCardUpload'
import LicenseUpload from './components/LicenseUpload'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('cmnd')

  const renderContent = () => {
    switch (activeTab) {
      case 'cmnd':
        return <IdCardUpload />
      case 'giayphep':
        return <LicenseUpload />
      default:
        return <IdCardUpload />
    }
  }

  return (
    <AntApp>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <CommonHeader activeKey={activeTab} onTabChange={setActiveTab} />
          {renderContent()}
        </div>
      </div>
    </AntApp>
  )
}

export default App
