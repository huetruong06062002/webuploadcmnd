import { useState } from 'react'
import { Button, Card, Form, Image as AntdImage, Space, Typography, Upload, Divider, Tag, Row, Col, Select, Input } from 'antd'
import type { UploadFile, UploadProps } from 'antd'
import { FileTextOutlined, CheckCircleOutlined, ClockCircleOutlined, FileImageOutlined } from '@ant-design/icons'

const { Option } = Select
const { TextArea } = Input

function getBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = (error) => reject(error)
  })
}

export default function LicenseUpload() {
  const [fileList, setFileList] = useState<UploadFile<any>[]>([])
  const [loading, setLoading] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const [form] = Form.useForm()

  const imageBeforeUpload: UploadProps['beforeUpload'] = (file) => {
    const isImage = file.type.startsWith('image/') || file.type === 'application/pdf'
    const isLt20M = file.size / 1024 / 1024 < 20
    if (!isImage) {
      console.error('Vui lòng chọn định dạng ảnh hoặc PDF')
    }
    if (!isLt20M) {
      console.error('Kích thước file phải nhỏ hơn 20MB')
    }
    return false
  }

  const handlePreview = async (file: UploadFile<any>) => {
    if (!file.url && !file.preview && file.originFileObj) {
      file.preview = await getBase64(file.originFileObj)
    }
    const src = (file.url || file.preview) as string
    if (!src) return
    if (file.type === 'application/pdf') {
      window.open(src)
    } else {
      const ImgCtor = window.Image
      const image = new ImgCtor()
      image.src = src
      const imgWindow = window.open(src)
      imgWindow?.document.write(image.outerHTML)
    }
  }

  const onSubmit = async (values: any) => {
    if (fileList.length === 0) {
      console.warn('Vui lòng tải lên ít nhất một file.')
      return
    }
    setLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 1200))
      setUploaded(true)
      console.log('Tải lên giấy phép thành công')
    } catch (e) {
      console.error('Có lỗi xảy ra khi tải lên')
    } finally {
      setLoading(false)
    }
  }

  const commonUploadProps: UploadProps = {
    accept: 'image/*,.pdf,.jpg,.jpeg,.png,.gif',
    multiple: true,
    listType: 'picture',
    maxCount: 10,
    beforeUpload: imageBeforeUpload,
    onPreview: handlePreview,
  }

  const getFileIcon = (file: UploadFile<any>) => {
    if (file.type === 'application/pdf') {
      return <FileTextOutlined className="text-4xl text-red-500" />
    }
    return <FileImageOutlined className="text-4xl text-blue-500" />
  }

  const getFileTypeTag = (file: UploadFile<any>) => {
    if (file.type === 'application/pdf') {
      return <Tag color="red">PDF</Tag>
    }
    return <Tag color="blue">Ảnh</Tag>
  }

  const renderUploadSection = () => (
    <Card title="Upload Giấy phép" className="h-full">
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Space direction="vertical" size="large" className="w-full">
          <div>
            <Typography.Text strong>Loại giấy phép</Typography.Text>
            <Form.Item name="licenseType" rules={[{ required: true, message: 'Vui lòng chọn loại giấy phép' }]}>
              <Select placeholder="Chọn loại giấy phép" className="mt-2">
                <Option value="driving">Giấy phép lái xe</Option>
                <Option value="business">Giấy phép kinh doanh</Option>
                <Option value="construction">Giấy phép xây dựng</Option>
                <Option value="health">Giấy phép y tế</Option>
                <Option value="education">Giấy phép giáo dục</Option>
                <Option value="other">Khác</Option>
              </Select>
            </Form.Item>
          </div>

          <div>
            <Typography.Text strong>Mô tả</Typography.Text>
            <Form.Item name="description">
              <TextArea 
                rows={3} 
                placeholder="Mô tả chi tiết về giấy phép (nếu có)"
                className="mt-2"
              />
            </Form.Item>
          </div>

          <div>
            <Typography.Text strong>Upload file</Typography.Text>
            <Upload.Dragger
              {...commonUploadProps}
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              className="mt-2"
            >
              <p className="ant-upload-drag-icon"><FileTextOutlined /></p>
              <p className="ant-upload-text">Kéo thả file vào đây hoặc bấm để chọn</p>
              <p className="ant-upload-hint">Chấp nhận ảnh (JPG, JPEG, PNG, GIF) và PDF, tối đa 20MB mỗi file</p>
            </Upload.Dragger>
          </div>

          {fileList.length > 0 && (
            <div>
              <Typography.Text strong>Danh sách file đã chọn ({fileList.length}):</Typography.Text>
              <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                {fileList.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded bg-gray-50">
                    <div className="flex items-center gap-2">
                      {getFileIcon(file)}
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                                                 <p className="text-xs text-gray-500">
                           {file.size ? (file.size / 1024 / 1024).toFixed(2) : 'N/A'} MB
                         </p>
                      </div>
                    </div>
                    {getFileTypeTag(file)}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-center">
            <Button type="primary" htmlType="submit" loading={loading} size="large">
              Tải lên Giấy phép
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
            Vui lòng tải lên giấy phép để xem kết quả
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
              <Typography.Text strong>Loại giấy phép:</Typography.Text>
              <div className="mt-1">
                <Tag color="purple">
                  {form.getFieldValue('licenseType') === 'driving' && 'Giấy phép lái xe'}
                  {form.getFieldValue('licenseType') === 'business' && 'Giấy phép kinh doanh'}
                  {form.getFieldValue('licenseType') === 'construction' && 'Giấy phép xây dựng'}
                  {form.getFieldValue('licenseType') === 'health' && 'Giấy phép y tế'}
                  {form.getFieldValue('licenseType') === 'education' && 'Giấy phép giáo dục'}
                  {form.getFieldValue('licenseType') === 'other' && 'Khác'}
                </Tag>
              </div>
            </div>

            <div>
              <Typography.Text strong>Thông tin file:</Typography.Text>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tổng số file:</span>
                  <Tag color="blue">{fileList.length} file</Tag>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tổng dung lượng:</span>
                  <span>
                    {(fileList.reduce((acc, file) => acc + (file.size ?? 0), 0) / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              </div>
            </div>

            <div>
              <Typography.Text strong>Chi tiết file:</Typography.Text>
              <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                {fileList.map((file, index) => (
                  <div key={index} className="flex justify-between items-center p-2 border rounded bg-gray-50">
                    <span className="text-sm text-gray-600 truncate flex-1 mr-2">{file.name}</span>
                    <div className="flex gap-1">
                      {getFileTypeTag(file)}
                                           <span className="text-xs text-gray-500">
                       {file.size ? (file.size / 1024 / 1024).toFixed(2) : 'N/A'} MB
                     </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Divider />

          <div className="text-center">
            <Button 
              type="default" 
              onClick={() => {
                setUploaded(false)
                setFileList([])
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