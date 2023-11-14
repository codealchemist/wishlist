'use client'
import { useState } from 'react'
import { Button, Space, Modal } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import { useStore, useSharedStore } from '@/lib/store/zustand'
import WishDetails from '@/components/WishDetails'
import mediaQueries from '@/app/media-queries.module.css'
import styles from '@/components/WishesList/wishes-list.module.css'

function log () {
  console.log('[ ViewWishesList ]', ...arguments)
}

export default function ViewWishesList ({ channelUuid, wishes, emptyText = 'No wishes yet' }) {
  log({ wishes })
  const { setSelectedWish, selectedWish } = useSharedStore()
  const [isModalOpen, setIsModalOpen] = useState(false)

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

  function viewDesktop (index) {
    log('View', { index })
    setSelectedWish({ channelUuid, wishIndex: index })
  }

  function viewMobile (index) {
    log('View', { index })
    setSelectedWish({ channelUuid, wishIndex: index })
    setIsModalOpen(true)
  }

  function onModalCancel () {
    setIsModalOpen(false)
  }

  function onModalOk () {
    setIsModalOpen(false)
  }

  // List.
  return (
    <>
      <ul className={styles.list}>
        {wishes?.map((wish, index) => (
          <li key={index}>
            <Space>
              <span>{wish.title}</span>
              <Button
                shape='circle'
                size='small'
                type='primary'
                onClick={() => viewDesktop(index)}
                className={mediaQueries.hideOnSmallScreens}
              >
                <EyeOutlined />
              </Button>

              <Button
                shape='circle'
                size='small'
                type='primary'
                onClick={() => viewMobile(index)}
                style={{ display: 'none' }}
                className={mediaQueries.showOnSmallScreens}
              >
                <EyeOutlined />
              </Button>
            </Space>
          </li>
        ))}
      </ul>

      {/* Details modal. */}
      <Modal
        title='Wish details'
        open={isModalOpen}
        onOk={onModalOk}
        onCancel={onModalCancel}
        footer={null}
        centered
      >
        <WishDetails channelUuid={channelUuid} wish={selectedWish} />
      </Modal>
    </>
  )
}
