import { useState } from 'react'
import { App as AntApp, Button, Card, Form, Image as AntdImage, Space, Typography, Upload } from 'antd'
import type { UploadFile, UploadProps } from 'antd'
import { InboxOutlined } from '@ant-design/icons'

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
  const [form] = Form.useForm()
  const { message } = AntApp.useApp()

  const imageBeforeUpload: UploadProps['beforeUpload'] = (file) => {
    const isImage = file.type.startsWith('image/')
    const isLt10M = file.size / 1024 / 1024 < 10
    if (!isImage) {
      message.error('Vui lòng chọn định dạng ảnh')
    }
    if (!isLt10M) {
      message.error('Kích thước ảnh phải nhỏ hơn 10MB')
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
      message.warning('Vui lòng tải lên cả 2 mặt giấy tờ.')
      return
    }
    setLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 600))
      message.success('Tải lên thành công (mô phỏng)')
    } catch (e) {
      message.error('Có lỗi xảy ra khi tải lên')
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

  return (
    <AntApp>
      <div className="container py-10">
        <Typography.Title level={3} className="text-center mb-6">Tải lên CMND/CCCD 2 mặt</Typography.Title>
        <Card className="max-w-2xl mx-auto">
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
                      width={280}
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
                      width={280}
                      src={(backFileList[0].thumbUrl || backFileList[0].url) as string}
                      alt="Mặt sau"
                    />
                  </div>
                ) : null}
              </div>

              <div className="flex justify-center">
                <Button type="primary" htmlType="submit" loading={loading}>
                  Tải lên
                </Button>
              </div>
            </Space>
          </Form>
        </Card>
      </div>
    </AntApp>
  )
} 