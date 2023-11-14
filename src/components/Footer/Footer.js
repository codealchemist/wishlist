'use client'
import { Row, Col } from 'antd'
import styles from './footer.module.css'
import mediaQueries from '@/app/media-queries.module.css'

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
          <p className={styles.textLeft}>Last updated <i>Oct 2023</i></p>
        </Col>
      </Row>
    </footer>
  )
}
