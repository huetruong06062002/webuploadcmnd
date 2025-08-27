import { useState } from 'react'
import { Button, Card, Form, Image as AntdImage, Space, Typography, Upload, Divider, Tag, Row, Col } from 'antd'
import type { UploadFile, UploadProps } from 'antd'
import { InboxOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons'

function getBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = (error) => reject(error)
  })
}

export default function IdCardUpload() {
  const [frontFileList, setFrontFileList] = useState<UploadFile<any>[]>([])
  const [backFileList, setBackFileList] = useState<UploadFile<any>[]>([])
  const [loading, setLoading] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const [form] = Form.useForm()

  const imageBeforeUpload: UploadProps['beforeUpload'] = (file) => {
    const isImage = file.type.startsWith('image/')
    const isLt10M = file.size / 1024 / 1024 < 10
    if (!isImage) {
      console.error('Vui lòng chọn định dạng ảnh')
    }
    if (!isLt10M) {
      console.error('Kích thước ảnh phải nhỏ hơn 10MB')
    }
    return false
  }

  const handlePreview = async (file: UploadFile<any>) => {
    if (!file.url && !file.preview && file.originFileObj) {
      file.preview = await getBase64(file.originFileObj)
    }
    const src = (file.url || file.preview) as string
    if (!src) return
    const ImgCtor = window.Image
    const image = new ImgCtor()
    image.src = src
    const imgWindow = window.open(src)
    imgWindow?.document.write(image.outerHTML)
  }

  const onSubmit = async () => {
    if (frontFileList.length === 0 || backFileList.length === 0) {
      console.warn('Vui lòng tải lên cả 2 mặt giấy tờ.')
      return
    }
    setLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 1500))
      setUploaded(true)
      console.log('Tải lên thành công')
    } catch (e) {
      console.error('Có lỗi xảy ra khi tải lên')
    } finally {
      setLoading(false)
    }
  }

  const commonUploadProps: UploadProps = {
    accept: 'image/*',
    multiple: false,
    listType: 'picture',
    maxCount: 1,
    beforeUpload: imageBeforeUpload,
    onPreview: handlePreview,
  }

  const renderUploadSection = () => (
    <Card title="Upload CMND/CCCD" className="h-full">
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Space direction="vertical" size="large" className="w-full">
          <div>
            <Typography.Text strong>Mặt trước</Typography.Text>
            <Upload.Dragger
              {...commonUploadProps}
              fileList={frontFileList}
              onChange={({ fileList }) => setFrontFileList(fileList)}
              className="mt-2"
            >
              <p className="ant-upload-drag-icon"><InboxOutlined /></p>
              <p className="ant-upload-text">Kéo thả ảnh vào đây hoặc bấm để chọn</p>
              <p className="ant-upload-hint">Chỉ nhận ảnh, tối đa 10MB</p>
            </Upload.Dragger>
            {frontFileList[0]?.thumbUrl || frontFileList[0]?.url ? (
              <div className="mt-3">
                <AntdImage
                  width={200}
                  src={(frontFileList[0].thumbUrl || frontFileList[0].url) as string}
                  alt="Mặt trước"
                />
              </div>
            ) : null}
          </div>

          <div>
            <Typography.Text strong>Mặt sau</Typography.Text>
            <Upload.Dragger
              {...commonUploadProps}
              fileList={backFileList}
              onChange={({ fileList }) => setBackFileList(fileList)}
              className="mt-2"
            >
              <p className="ant-upload-drag-icon"><InboxOutlined /></p>
              <p className="ant-upload-text">Kéo thả ảnh vào đây hoặc bấm để chọn</p>
              <p className="ant-upload-hint">Chỉ nhận ảnh, tối đa 10MB</p>
            </Upload.Dragger>
            {backFileList[0]?.thumbUrl || backFileList[0]?.url ? (
              <div className="mt-3">
                <AntdImage
                  width={200}
                  src={(backFileList[0].thumbUrl || backFileList[0].url) as string}
                  alt="Mặt sau"
                />
              </div>
            ) : null}
          </div>

          <div className="flex justify-center">
            <Button type="primary" htmlType="submit" loading={loading} size="large">
              Tải lên
            </Button>
          </div>
        </Space>
      </Form>
    </Card>
  )

  const renderResultsSection = () => (
    <Card title="Kết quả xử lý" className="h-full">
      {!uploaded ? (
        <div className="text-center py-20">
          <ClockCircleOutlined className="text-6xl text-gray-300 mb-4" />
          <Typography.Text type="secondary" className="text-lg">
            Chưa có dữ liệu upload
          </Typography.Text>
          <p className="text-sm text-gray-400 mt-2">
            Vui lòng tải lên CMND/CCCD để xem kết quả
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-center">
            <CheckCircleOutlined className="text-6xl text-green-500 mb-4" />
            <Typography.Title level={4} className="text-green-600">
              Upload thành công!
            </Typography.Title>
          </div>

          <Divider />

          <div className="space-y-4">
            <div>
              <Typography.Text strong>Trạng thái:</Typography.Text>
              <div className="mt-1">
                <Tag color="green" icon={<CheckCircleOutlined />}>
                  Đã xử lý
                </Tag>
              </div>
            </div>

            <div>
              <Typography.Text strong>Thời gian upload:</Typography.Text>
              <p className="text-gray-600 mt-1">
                {new Date().toLocaleString('vi-VN')}
              </p>
            </div>

            <div>
              <Typography.Text strong>Thông tin CMND/CCCD:</Typography.Text>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mặt trước:</span>
                  <Tag color="blue">Đã tải</Tag>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mặt sau:</span>
                  <Tag color="blue">Đã tải</Tag>
                </div>
              </div>
            </div>

            <div>
              <Typography.Text strong>Kích thước file:</Typography.Text>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mặt trước:</span>
                  <span>{frontFileList[0]?.size ? `${(frontFileList[0].size / 1024 / 1024).toFixed(2)} MB` : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mặt sau:</span>
                  <span>{backFileList[0]?.size ? `${(backFileList[0].size / 1024 / 1024).toFixed(2)} MB` : 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          <Divider />

          <div className="text-center">
            <Button 
              type="default" 
              onClick={() => {
                setUploaded(false)
                setFrontFileList([])
                setBackFileList([])
                form.resetFields()
              }}
            >
              Upload mới
            </Button>
          </div>
        </div>
      )}
    </Card>
  )

  return (
    <Row gutter={24} className="w-full">
      <Col xs={24} lg={12}>
        {renderUploadSection()}
      </Col>
      <Col xs={24} lg={12}>
        {renderResultsSection()}
      </Col>
    </Row>
  )
} 