'use client'
import { Button, Space, Popconfirm } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import hash from 'object-hash'
import { useStore, useWishesStore } from '@/lib/store/zustand'
import styles from './wishes-list.module.css'

function log () {
  console.log('[ WishesList ]', ...arguments)
}

export default function WishesList ({ onEdit, emptyText = 'Hey! Lets start wishing! 😉' }) {
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
    <p>{emptyText}</p>
  )

  function onRemove (index) {
    remove(index)
  }

  // List.
  return (
    <ul className={styles.list}>
      {wishes?.map((wish, index) => (
        <li key={index}>
          <Space>
            <span>{wish.title}</span>
            <Button shape='circle' size='small' type='primary' onClick={() => onEdit(index)}>
              <EditOutlined />
            </Button>
            <Popconfirm
              title='Continue?'
              description={`"${wish.title}" will be deleted.`}
              onConfirm={() => onRemove(index)}
            >
              <Button shape='circle' size='small' type='primary' danger>
                <DeleteOutlined />
              </Button>
            </Popconfirm>
          </Space>
        </li>
      ))}
    </ul>
  )
}
