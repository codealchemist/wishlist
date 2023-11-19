'use client'
import { useEffect, useState } from 'react'
import { Form, Button, Input, Space, Typography, notification } from 'antd'
import { useUserStore } from '@/lib/store/zustand'

const { TextArea } = Input

function log () {
  console.log('[ UserForm ]', ...arguments)
}

export default function UserForm ({ onCancel, onOk }) {
  const { user, setUser } = useUserStore()
  const [isFormValid, setIsFormValid] = useState(false)
  const [form] = Form.useForm()
  const formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 22, offset: 2, sm: 24, xs: 24 },
  }
  const formValues = Form.useWatch(['name'], form)

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
    setUser(values)
    onOk()
  }

  useEffect(() => {
    log('Form values changed', { formValues })
    validateForm()
  }, [formValues])

  return (
    <Form form={form} onFinish={onFinish} initialValues={user}>
      <Form.Item
        {...formLayout}
        label='Your name'
        name='name'
        rules={[{ required: true, message: 'Your friends will need it to identify you 😁' }]}
      >
        <Input
          placeholder='Type your name or alias.'
        />
      </Form.Item>

      <Form.Item label='Email' name='email' {...formLayout} rules={[{ type: 'email' }]}>
        <Input
          placeholder='Type email address (optional).'
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
            OK
          </Button>
        </Space>
      </div>
    </Form>
  )
}
