'use client'
import { useState, useRef, useEffect } from 'react'
import { Row, Col, Button, Modal } from 'antd'
import { v4 as uuid } from 'uuid'
import { useWishesStore, useSharedStore, useSharingStore } from '@/lib/store/zustand'
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
  const { shared, selectedWish, addSharedWishes } = useSharedStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const userName = shared?.[channelUuid]?.details?.userName
  const wishes = shared?.[channelUuid]?.wishes

  log({ channelUuid, shared })

  useEffect(() => {
    if (!sharing) return
    log('Got sharing data', { sharing })
    const clientUuid = sharing?.clientUuid || uuid()

    // Subscribe to receive messages on our exclusive channel.
    messages.subscribe(clientUuid, message => {
      log('Got message on client channel!', { message })
    })

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
      addSharedWishes({ channelUuid, wishes, details })
    })
      

    if (!sharing?.clientUuid) {
      log('Set clientUuid', { clientUuid })
      setClientUuid(clientUuid)
    }
  }, [sharing])

  return (
    <Row className={styles.row} gutter={16} justify='center'>
      <Col span={12} className={mediaQueries.hideOnSmallScreens}>
        <Card title='Wish details'>
          <WishDetails channelUuid={channelUuid} wish={selectedWish} />
        </Card>
      </Col>

      <Col md={12} sm={24} xs={24}>
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
