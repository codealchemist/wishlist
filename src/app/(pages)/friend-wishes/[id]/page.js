import Link from 'next/link'
import { Button, Space, Result } from 'antd'
import styles from './friend-wishes.module.css'

function log () {
  console.log('[ FriendWishes ]', ...arguments)
}

export default async function FriendWishes ({ params }) {
  log({ params })
  const { id } = params

  try {
    const res = await fetch(`http://localhost:5000/${id}.json`)

    log({ status: res?.status})
    if (res?.status === 404) {
      log('Friend not found', { id })
      return (
        <section className={styles.notFound}>
          <Result
            status="warning"
            title='Friend not found'
            extra={
              <p>Are you sure you got the right id?</p>
            }
          />
        </section>
      )
    }

    const data = await res.json()
    const { name, wishes } = data

    return (
      <section className={styles.section}>
        <h1>Wishes for {name}</h1>
        <ul>
        {wishes?.map(({ title, description }, index) => (
          <li key={index}>
            <Space>
              <label>{title}</label>
              <Button size='small'>View</Button>
            </Space>
          </li>
        ))}
        </ul>
      </section>
    )
  } catch (error) {
    log({ error })
    throw new Error('Failed to fetch friend wishes. Is the API running?')
  }
}
