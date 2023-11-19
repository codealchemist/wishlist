'use client'
import { useState, useEffect } from 'react'
import { Typography, Button, Row, notification, Modal, Space, Popconfirm, Popover } from 'antd'
import { useUserStore, useSharedStore, useSharingStore } from '@/lib/store/zustand'
import UserForm from '@/components/UserForm/UserForm'
import messages from '@/lib/messages/Messages'
import styles from './wish-details.module.css'

function log () {
  console.log('[ WishDetails ]', ...arguments)
}

export default function WishDetails ({ wish, channelUuid }) {
  const { user, setUser } = useUserStore()
  const { participating, setParticipation, addParticipant, removeParticipant } = useSharedStore()
  const { sharing } = useSharingStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const isParticipating = participating?.[channelUuid]?.[wish?.index]
  log({ wish, channelUuid, participating, isParticipating })

  function participate () {
    log('Participate', { wish, channelUuid })

    // Missing user data. Open modal to get it.
    if (!user.name) {
      setIsModalOpen(true)
      return
    }

    // Persist current user participation in the wish.
    log('Added user as participant', { wish, channelUuid, user })
    setParticipation({ channelUuid, wish, user, participating: true })
    addParticipant({ channelUuid, wishIndex: wish?.index, participant: user })

    // Notify the user who created it and any other participants.
    messages.newParticipant({
      channelUuid,
      clientUuid: sharing?.clientUuid,
      participant: user,
      wishIndex: wish?.index
    })
  }

  function unparticipate () {
    log('Unparticipate', { wish, channelUuid })

    // Persist current user participation in the wish.
    log('Removing user as participant', { wish, channelUuid, user })
    setParticipation({ channelUuid, wish, user, participating: false })
    removeParticipant({ channelUuid, wishIndex: wish?.index, participant: user })

    // Notify the user who created it and any other participants.
    messages.removeParticipant({
      channelUuid,
      clientUuid: sharing?.clientUuid,
      participant: user,
      wishIndex: wish?.index
    })
  }

  function onModalCancel () {
    setIsModalOpen(false)
  }

  function onModalOk () {
    setIsModalOpen(false)
  }

  useEffect(() => {
    if (!user?.name) return
    log('Got user, OK to participate', { user })
    participate()
  }, [user])

  return (
    <div className={styles.details}>
      <Typography.Title level={2}>{ wish?.title }</Typography.Title>
      <div className={styles.scrollableContent}>
        <Typography.Paragraph>{ wish?.description }</Typography.Paragraph>
      </div>

      {wish !== null && (
        <Row justify='end'>
          { isParticipating && (
            <Popconfirm
              title='Continue?'
              description={`You will UNPARTICIPATE in "${wish?.title}" and your friend will be notified.`}
              onConfirm={() => unparticipate()}
            >
              <Button size='small' type='default'>Participating</Button>
            </Popconfirm>
          )}

          { !isParticipating && (
            <Popconfirm
              title='Continue?'
              description={`You will participate in "${wish?.title}" and your friend will be notified.`}
              onConfirm={() => participate()}
            >
              <Button size='small' type='primary' danger>Participate</Button>
            </Popconfirm>
          )}
        </Row>
      )}

      {/* Participating user data modal. */}
      <Modal
        title='Who are you?'
        open={isModalOpen}
        onCancel={onModalCancel}
        footer={null}
        centered
      >
        <em className={styles.subtitle}>Let your friend know who you are.</em>
        <UserForm onCancel={onModalCancel} onOk={onModalOk} />
      </Modal>
    </div>
  )
}
