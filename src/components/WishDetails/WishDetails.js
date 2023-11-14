import { Typography, Button, Row, notification } from 'antd'
import styles from './wish-details.module.css'

function log () {
  console.log('[ WishDetails ]', ...arguments)
}

export default function WishDetails ({ wish, channelUuid }) {
  log({ wish, channelUuid })

  function participate () {
    log('Participate', { wish, channelUuid })
    notification.info({
      message: 'Participate',
      description: 'Coming soon!',
      duration: 500
    })
  }

  return (
    <div className={styles.details}>
      <Typography.Title level={2}>{ wish?.title }</Typography.Title>
      <div className={styles.scrollableContent}>
        <Typography.Paragraph>{ wish?.description }</Typography.Paragraph>
      </div>

      {wish !== null && (
        <Row justify='end'>
          <Button size='small' type='primary' danger onClick={() => participate()}>Participate</Button>
        </Row>
      )}
    </div>
  )
}
