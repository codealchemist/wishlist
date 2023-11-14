'use client'
import { useState } from 'react'
import { Button, Space, Modal } from 'antd'
import { useStore, useSharedStore } from '@/lib/store/zustand'
import WishDetails from '@/components/WishDetails'
import mediaQueries from '@/app/media-queries.module.css'

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
      <ul>
        {wishes?.map((wish, index) => (
          <li key={index}>
            <Space>
              <span>{wish.title}</span>
              <Button
                size='small'
                type='primary'
                onClick={() => viewDesktop(index)}
                className={mediaQueries.hideOnSmallScreens}
              >
                View
              </Button>

              <Button
                size='small'
                type='primary'
                onClick={() => viewMobile(index)}
                style={{ display: 'none' }}
                className={mediaQueries.showOnSmallScreens}
              >
                View
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
