'use client'
import Link from 'next/link'
import { Button, Result, Typography } from 'antd'
import styles from './page.module.css'

export default function Error ({ error }) {
  return (
    <section className={styles.section}>
      <Result
        status="warning"
        title='Oops, we are sorry about that 😅'
        extra={
          <>
            <Typography.Paragraph>
              {error?.message}
            </Typography.Paragraph>
            <Link href='/'>
              <Button type="primary">
                Goto home
              </Button>
            </Link>
          </>
        }
      />
    </section>
  )
}
