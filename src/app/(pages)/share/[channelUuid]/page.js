'use client'
import { useState, useEffect } from 'react'
import { Row, Col, Button } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import { v4 as uuid } from 'uuid'
import { useStore, useWishesStore, useSharedStore, useSharingStore } from '@/lib/store/zustand'
import { ViewWishesList } from '@/components/WishesList'
import Card from '@/components/Card'
import messages from '@/lib/messages/Messages'
import WishDetails from '@/components/WishDetails'
import styles from '@/app/page.module.css'
import mediaQueries from '@/app/media-queries.module.css'

function log () {
  console.log('[ SharedWishes ]', ...arguments)
}

export default function SharedWishes ({ params }) {
  log({ params })
  const { channelUuid } = params
  const { sharing, setClientUuid, getSelectedWish } = useSharingStore()
  const [subscriptionsInitialized, setSubscriptionsInitialized] = useState(false)
  // Use `useStore` to avoid hydration errors (it uses `useEffect` internally).
  const { shared, selectedWishInfo, addSharedWishes, addParticipant, removeParticipant } = useStore(useSharedStore)
  const userName = shared?.[channelUuid]?.details?.userName
  const wishes = shared?.[channelUuid]?.wishes
  const selectedWish = selectedWishInfo
    ? {
        ...wishes?.[selectedWishInfo?.wishIndex],
        index: selectedWishInfo?.wishIndex
      }
    : null

  log({ channelUuid, shared })

  // Init message subscriptions once.
  // Add and remove participants to reflect other participant actions.
  function initSubscriptions(clientUuid) {
    if (!channelUuid) return
    if (!shared) return
    setSubscriptionsInitialized(true)
    if (subscriptionsInitialized) {
      log('Subscriptions already initialized')
      return
    }

    log('Init subscriptions', { channelUuid, clientUuid })
    // Let host know about us so we can communicate on our exclusive channel.
    messages.newClient({ channelUuid, clientUuid })

    // Know when the host added us.
    messages.onNewClientResponse(clientUuid, message => {
      log('Got new client response!', { message })

      // Request wishes on our exclusive channel.
      messages.getWishes({ clientUuid })
    })

    // Receive wishes from host.
    messages.onGetWishesResponse(clientUuid, message => {
      log('Got wishes response!', { message })
      const { data: { wishes, details } } = message
      log('Adding shared wishes', { addSharedWishes })
      addSharedWishes({ channelUuid, wishes, details })
    })

    messages.onNewParticipant(channelUuid, message => {
      log('Got new participant', { message })
      const { data } = message
      log({ data })
      const {
        channelUuid,
        clientUuid,
        participant,
        wishIndex
      } = data
      addParticipant({ channelUuid, wishIndex, participant })
    })

    messages.onRemovedParticipant(channelUuid, message => {
      log('Removed participant', { message })
      const { data } = message
      log({ data })
      const {
        channelUuid,
        clientUuid,
        participant,
        wishIndex
      } = data
      removeParticipant({ channelUuid, wishIndex, participant })
    })
  }

  useEffect(() => {
    if (!sharing) return
    if (!shared) return
    log('Got sharing data', { sharing })
    const clientUuid = sharing?.clientUuid || uuid()
    initSubscriptions(clientUuid)
      
    if (!sharing?.clientUuid) {
      log('Set clientUuid', { clientUuid })
      setClientUuid(clientUuid)
    }

    return () => {
      log('Unsubscribing from client channel', { clientUuid })
      messages.unsubscribe(clientUuid)
    }
  }, [sharing, shared])

  return (
    <Row className={styles.row} gutter={16} justify='center'>
      <Col span={12} className={mediaQueries.hideOnSmallScreens}>
        <Card title='Wish details'>
          <WishDetails channelUuid={channelUuid} wish={selectedWish} />
        </Card>
      </Col>

      <Col md={12} sm={24} xs={24}>
        <Button
          type='secondary'
          shape='circle'
          size='large'
          className={styles.refreshButton}
          onClick={() => window.location.reload()}
        >
          <ReloadOutlined />
        </Button>

        <Card title={userName || 'NA'}>
          <ViewWishesList
            channelUuid={channelUuid}
            wishes={wishes}
            emptyText='No wishes yet'
          />
        </Card>
      </Col>
    </Row>
  )
}
