'use client'
import { useState, useRef, useEffect } from 'react'
import { Row, Col, Button, Modal } from 'antd'
// import { useChannel } from 'ably/react'
import { v4 as uuid } from 'uuid'
import { PlusOutlined, ShareAltOutlined } from '@ant-design/icons'
import { useStore, useWishesStore, useSharingStore } from '@/lib/store/zustand'
import ShareForm from '@/components/ShareForm/ShareForm'
import WishForm from '@/components/WishForm'
import WishesList from '@/components/WishesList'
import Card from '@/components/Card'
import messages from '@/lib/messages'
import styles from './page.module.css'
import mediaQueries from '@/app/media-queries.module.css'
import isClient from '@/util/is-client'

function log () {
  console.log('[ Home ]', ...arguments)
}

// Get or create a new channelUuid.
// We can't use the store because it's async.
// TODO: Look for better solutions, pay attention to Zustand persist lib updates.
const storedChannelUuid = isClient()
  ? JSON.parse(window.localStorage.getItem('sharing-store') || {})
    ?.state?.sharing?.channelUuid || uuid()
  : null

export default function Home() {
  const { wishes } = useWishesStore()
  const { sharing, setChannelUuid, setUserName } = useSharingStore()
  const channelUuid = storedChannelUuid
  // const { channel } = useChannel(channelUuid, message => {
  //   log('got message!', { message })
  // })
  const modalButtonRef = useRef(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [wishToEdit, setWishToEdit] = useState(null)

  // channel.presence.subscribe('enter', (member) => {
  //   log('member entered', { member })
  // })
  log({ channelUuid, sharing, wishes })

  function openShareModal () {
    // TODO
    log('Open share modal')
  }

  //------------------------------------------
  // Share modal methods.
  function openShareModal () {
    setIsShareModalOpen(true)
  }

  function onShareModalOk () {
    setIsShareModalOpen(false)
  }

  function onShareModalCancel () {
    setIsShareModalOpen(false)
  }
  //------------------------------------------

  //------------------------------------------
  // Add modal methods.
  function openAddModal () {
    clearWishToEdit()
    setIsModalOpen(true)
  }

  function onModalOk () {
    setIsModalOpen(false)
  }

  function onModalCancel () {
    setIsModalOpen(false)
  }

  function onEdit (wishIndex) {
    log('onEdit', { wishIndex, wishes })
    setWishToEdit({
      index: wishIndex,
      ...wishes[wishIndex]
    })

    const modalButtonWidth = modalButtonRef.current?.offsetWidth
    if (modalButtonWidth !== 0) {
      setIsModalOpen(true)
    }
  }

  function clearWishToEdit () {
    setWishToEdit(null)
  }
  //------------------------------------------

  // Not working with usePresence either.
  // Try setting a clientId.
  useEffect(() => {
    if (!sharing) return
    if (!wishes) return

    if (sharing && !sharing?.channelUuid) {
      log('Set NEW channelUuid', { channelUuid })
      setChannelUuid(channelUuid)
    }

    // Subscribe to receive messages on our exclusive channel with the new client.
    messages.onNewClient(channelUuid, message => {
      log('Got new client message!', { message })
      const { data: { clientUuid } } = message

      // Cancel previous subscription if any.
      messages.unsubscribe(clientUuid)

      // Inform client we added it.
      messages.newClientResponse({ clientUuid })

      // Subscribe to receive get wishes requests on our exclusive channel.
      messages.onGetWishes(clientUuid, message => {
        // Send wishes.
        log(`Got wishes request from ${clientUuid}`, { message })
        const details = sharing?.details || {}
        messages.sendWishes({ clientUuid, wishes, details })
      })
    })

    return () => {
      // Unsubscribe from all channels.
      messages.unsubscribeAll()
    }
  }, [wishes, sharing])

  return (
    <Row className={styles.row} gutter={16} justify='center'>
      <Col span={12} className={mediaQueries.hideOnSmallScreens}>
        <Card title={wishToEdit ? 'Edit wish' : 'Add a wish'}>
          <WishForm
            wishToEdit={wishToEdit}
            clearWishToEdit={clearWishToEdit}
          />
        </Card>
      </Col>

      <Col md={12} sm={24} xs={24}>
        <Button
          type='secondary'
          shape='circle'
          size='large'
          className={styles.shareButton}
          onClick={openShareModal}
        >
          <ShareAltOutlined />
        </Button>

        <Card title='My wishes'>
          <WishesList onEdit={onEdit} />
        </Card>
      </Col>

      <Button
        ref={modalButtonRef}
        type='primary'
        shape='circle'
        size='large'
        style={{ display: 'none' }}
        className={`${mediaQueries.showOnSmallScreens} ${styles.addButton}`}
        onClick={openAddModal}
      >
        <PlusOutlined />
      </Button>

      {/* Share modal. */}
      <Modal
        title='Share your wishes!'
        open={isShareModalOpen}
        onOk={onShareModalOk}
        onCancel={onShareModalCancel}
        footer={null}
        centered
      >
        <ShareForm onCancel={onShareModalCancel} />
      </Modal>

      {/* Add modal. */}
      <Modal
        title={wishToEdit ? 'Edit wish' : 'Add a wish'}
        open={isModalOpen}
        onOk={onModalOk}
        onCancel={onModalCancel}
        footer={null}
        centered
      >
        <WishForm
          onCancel={onModalCancel}
          wishToEdit={wishToEdit}
          clearWishToEdit={clearWishToEdit}
        />
      </Modal>
    </Row>
  )
}
