'use client'
import { useStore, useWishesStore } from '@/lib/store/zustand'
import { Card, Typography, Button } from 'antd'
import Link from 'next/link'
import styles from './wish-details.module.css'

function log () {
  console.log('[ WishDetails ]', ...arguments)
}

export default function WishDetails ({ params }) {
  log({ params })
  const { wishes } = useStore(useWishesStore)

  // Loading.
  if (!wishes) {
    return (
      <p>Loading...</p>
    )
  }

  const { index } = params
  const wish = wishes[index]

  // Not found.
  if (!wish) {
    return (
      <p>Wish not found</p>
    )
  }

  return (
    <section className={styles.section}>
      <div>
        <Link href='/'>
          <Button type='primary' className={styles.button}>Back</Button>
        </Link>
      </div>

      <div>
        <Card title={wish.title} className={styles.card}>
          <Typography.Paragraph>
            {wish.description}
          </Typography.Paragraph>
        </Card>
      </div>

      <div></div>
    </section>
  )
}
