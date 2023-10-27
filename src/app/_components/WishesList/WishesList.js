'use client'
import { Button, Space } from 'antd'
import { useStore, useWishesStore } from '@/lib/store/zustand'

function log () {
  console.log('[ WishesList ]', ...arguments)
}

export default function WishesList ({ onEdit }) {
  const { wishes, remove } = useStore(useWishesStore)
  log({ wishes, remove })

  // Loading.
  if (!wishes) {
    return (
      <p>Loading...</p>
    )
  }

  // Empty.
  if (!wishes?.length) return (
    <p>Hey! Lets start wishing! 😉</p>
  )

  // List.
  return (
    <ul>
      {wishes?.map((wish, index) => (
        <li key={index}>
          <Space>
            <span>{wish.title}</span>
            <Button size='small' type='primary' onClick={() => onEdit(index)}>Edit</Button>
            <Button size='small' type='primary' danger onClick={() => remove(index)}>Remove</Button>
          </Space>
        </li>
      ))}
    </ul>
  )
}
