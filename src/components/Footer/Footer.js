import { Row, Col } from 'antd'
import styles from './footer.module.css'
import mediaQueries from '@/app/media-queries.module.css'
import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig() || {}
const { version } = publicRuntimeConfig || {}

export default function Footer () {
  return (
    <footer className={styles.footer}>
      <Row>
        <Col md={11} sm={24} xs={24}>
          <p className={styles.textRight}>
            By <a href="https://albertomiranda.com.ar" target="_blank" className={styles.link}>
              Alberto Miranda
            </a>
          </p>
        </Col>
        
        <Col md={2} className={mediaQueries.hideOnSmallScreens}>
          <p>|</p>
        </Col>

        <Col md={11} sm={24} xs={24}>
          <p className={styles.textLeft}>v{version}</p>
        </Col>
      </Row>
    </footer>
  )
}
