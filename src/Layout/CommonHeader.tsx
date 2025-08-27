import { Tabs, Typography } from 'antd'
import type { TabsProps } from 'antd'
import { IdcardOutlined, FileTextOutlined } from '@ant-design/icons'

interface CommonHeaderProps {
  activeKey: string
  onTabChange: (key: string) => void
}

export default function CommonHeader({ activeKey, onTabChange }: CommonHeaderProps) {
  const items: TabsProps['items'] = [
    {
      key: 'cmnd',
      label: (
        <span className="flex items-center gap-2">
          <IdcardOutlined />
          Upload CMND/CCCD
        </span>
      ),
    },
    {
      key: 'giayphep',
      label: (
        <span className="flex items-center gap-2">
          <FileTextOutlined />
          Upload Giấy phép
        </span>
      ),
    },
  ]

  return (
    <div className="mb-8">
      <Typography.Title level={2} className="text-center mb-6">
        Hệ thống Upload Giấy tờ
      </Typography.Title>
      <Tabs
        activeKey={activeKey}
        onChange={onTabChange}
        items={items}
        className="max-w-2xl mx-auto"
        centered
        size="large"
      />
    </div>
  )
} 