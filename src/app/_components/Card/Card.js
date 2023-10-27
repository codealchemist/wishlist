import { useEffect } from 'react'
import { Card } from 'antd'

function log () {
  console.log('[ CustomCard ]', ...arguments)
}

export default function CustomCard ({ title, children }) {
  return (
    <Card title={title}>{children}</Card>
  )
}
