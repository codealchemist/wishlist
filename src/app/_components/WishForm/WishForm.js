'use client'
import { useEffect } from 'react'
import { Form, Button, Input, Select, Space } from 'antd'
import { useWishesStore } from '@/lib/store/zustand'

const { TextArea } = Input

function log () {
  console.log('[ WishForm ]', ...arguments)
}

export default function WishForm ({ onCancel, clearWishToEdit, wishToEdit }) {
  const { add, update } = useWishesStore(state => state)
  const [form] = Form.useForm()
  const formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 22, offset: 2, sm: 24, xs: 24 },
  }

  log({ wishToEdit })

  function reset () {
    form.resetFields()
    clearWishToEdit()
  }

  const onFinish = (values) => {
    log('onFinish', values)
    
    if (wishToEdit) {
      // Edit.
      update(wishToEdit.index, values)
    } else {
      // Add.
      add(values)
    }

    reset()
  }

  useEffect(() => {
    if (!wishToEdit) {
      form.resetFields()
      return
    }

    log({ wishToEdit })
    form.setFieldsValue(wishToEdit)
  }, [form, wishToEdit])

  return (
    <Form form={form} onFinish={onFinish}>
      <Form.Item
        {...formLayout}
        label='Wish'
        name='title'
        rules={[{ required: true, message: 'We need a wish to proceed 😁' }]}
      >
        <Input
          placeholder='What do you wish?'
        />
      </Form.Item>

      <Form.Item label='Description' name='description' {...formLayout}>
        <TextArea rows={4}
          placeholder='Convince your friends. Why do you wish this?'
        />
      </Form.Item>

      <div style={{ textAlign: 'right' }}>
        <Space>
          { onCancel && (
            <Button style={{ textAlign: 'right' }} onClick={onCancel}>
              Cancel
            </Button>
          )}

          <Button type='primary' htmlType='submit'>
            Save
          </Button>
        </Space>
      </div>
    </Form>
  )
}
