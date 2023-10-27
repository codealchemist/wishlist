'use client'
import { useState, useRef, useEffect } from 'react'
import { Row, Col, Button, Modal } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useWishesStore } from '@/lib/store/zustand'
import WishForm from '@/app/_components/WishForm'
import WishesList from '@/app/_components/WishesList/WishesList'
import Card from '@/app/_components/Card'
import styles from './page.module.css'
import mediaQueries from '@/app/media-queries.module.css'

function log () {
  console.log('[ Home ]', ...arguments)
}

export default function Home() {
  const modalButtonRef = useRef(null)
  const { wishes, update } = useWishesStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [wishToEdit, setWishToEdit] = useState(null)

  function openModal () {
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

  return (
    <Row className={styles.row} gutter={16} justify='center'>
      <Col span={12} className={mediaQueries.hideOnSmallScreens}>
        <Card title='Add a wish'>
          <WishForm wishToEdit={wishToEdit} clearWishToEdit={clearWishToEdit} />
        </Card>
      </Col>

      <Col md={12} sm={24} xs={24}>
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
        className={`${mediaQueries.showOnSmallScreens} ${styles.button}`}
        onClick={openModal}
      >
        <PlusOutlined />
      </Button>

      <Modal
        title="Add a wish"
        open={isModalOpen}
        onOk={onModalOk}
        onCancel={onModalCancel}
        footer={null}
        centered
      >
        <WishForm onCancel={onModalCancel} wishToEdit={wishToEdit} clearWishToEdit={clearWishToEdit} />
      </Modal>
    </Row>
  )
}
