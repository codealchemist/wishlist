'use client'
import { useEffect, useState } from 'react'
import { Form, Button, Input, Space, Typography, notification } from 'antd'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useStore, useSharingStore } from '@/lib/store/zustand'

const { TextArea } = Input

function log () {
  console.log('[ ShareForm ]', ...arguments)
}

export default function ShareForm ({ onCancel }) {
  const { sharing, setDetails } = useSharingStore()
  const [sharingUrl, setSharingUrl] = useState()
  const [isFormValid, setIsFormValid] = useState(false)
  const [form] = Form.useForm()
  const formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 22, offset: 2, sm: 24, xs: 24 },
  }
  const formValues = Form.useWatch(['userName'], form)

  async function validateForm () {
    try {
      await form.validateFields({ validateOnly: true })
      setIsFormValid(true)
    } catch (error) {
      setIsFormValid(false)
    }
  }

  function onFinish (values) {
    log('onFinish', values)
    setDetails(values)
  }

  function onCopiedToClipboard () {
    log('Copied to clipboard!', { sharingUrl })
    notification.success({
      message: 'Link copied to clipboard!'
    })
  }

  useState(() => {
    if (!sharing) return
    log('Got sharing data', { sharing })
    setSharingUrl(`${window.location.origin}/share/${sharing?.channelUuid}`)
  }, [sharing])

  useEffect(() => {
    log('form values changed', { formValues })
    validateForm()
  }, [formValues])

  return (
    <Form form={form} onFinish={onFinish} initialValues={sharing?.details}>
      <Form.Item
        {...formLayout}
        label='Your name'
        name='userName'
        rules={[{ required: true, message: 'Your friends will need it to identify you 😁' }]}
      >
        <Input
          placeholder='Type your name or alias.'
        />
      </Form.Item>

      <Form.Item label='Description' name='description' {...formLayout}>
        <TextArea rows={4}
          placeholder='Type a description for your wishlist. Birthdays, Christmas, etc.'
        />
      </Form.Item>

      <div style={{ textAlign: 'right' }}>
        <Space>
          { onCancel && (
            <Button style={{ textAlign: 'right' }} onClick={onCancel}>
              Cancel
            </Button>
          )}

          <Button type='primary' htmlType='submit' disabled={!isFormValid}>
            <CopyToClipboard
              text={sharingUrl}
              onCopy={onCopiedToClipboard}
            >
              <span>Get link</span>
            </CopyToClipboard>
          </Button>
        </Space>
      </div>
    </Form>
  )
}
