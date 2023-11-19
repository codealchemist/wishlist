'use client'
import { useState } from 'react'
import { Button, Space, Modal, Popover } from 'antd'
import { EyeOutlined, UserOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { useStore, useSharedStore } from '@/lib/store/zustand'
import WishDetails from '@/components/WishDetails'
import ParticipantsList from '@/components/ParticipantsList'
import mediaQueries from '@/app/media-queries.module.css'
import styles from '@/components/WishesList/wishes-list.module.css'

function log () {
  console.log('[ ViewWishesList ]', ...arguments)
}

export default function ViewWishesList ({ channelUuid, wishes, emptyText = 'No wishes yet' }) {
  const { participating, setSelectedWishInfo, selectedWishInfo } = useSharedStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const selectedWish = selectedWishInfo
    ? {
        ...wishes?.[selectedWishInfo?.wishIndex],
        index: selectedWishInfo?.wishIndex
      }
    : null
  log({ wishes, selectedWishInfo, selectedWish })

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
    setSelectedWishInfo({ channelUuid, wishIndex: index })
  }

  function viewMobile (index) {
    log('View', { index })
    setSelectedWishInfo({ channelUuid, wishIndex: index })
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

              { wish?.participants?.length > 0 && (
                <Popover content={<ParticipantsList participants={wish?.participants} />} title='Participants' trigger='click'>
                  <Button size='small' type='default' shape='round'>
                    {wish?.participants?.length} <UserOutlined />
                  </Button>
                </Popover>
              )}

              { participating?.[channelUuid]?.[index] && (
                <CheckCircleOutlined title='You participate 🎉' />
              )}
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
