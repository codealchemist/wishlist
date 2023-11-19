'use client'
import { Space, Modal } from 'antd'
import listStyles from '@/components/WishesList/wishes-list.module.css'
import styles from './participants-list.module.css'

function log () {
  console.log('[ ParticipantsList ]', ...arguments)
}

export default function ParticipantsList ({ participants, emptyText='No participants yet.' }) {
  log({ participants })

  // Empty.
  if (!participants?.length) return (
    <p>{emptyText}</p>
  )

  // List.
  return (
    <>
      <ul className={listStyles.list}>
        {participants?.map((participant, index) => (
          <li key={index}>
            <Space>
              <span className={styles.name}>{participant.name}</span>
              <span className={styles.email}>{participant.email}</span>
            </Space>
          </li>
        ))}
      </ul>
    </>
  )
}
