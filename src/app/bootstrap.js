'use client'
import { Realtime } from 'ably'
import { AblyProvider } from 'ably/react'

function log () {
  console.log('[ Bootstrap ]', ...arguments)
}

const baseUrl = window.location.origin
const client = new Realtime({
  authUrl: `${baseUrl}/.netlify/functions/ably-token-request`,
  echoMessages: false
})

export default function Bootstrap ({ children }) {
  return (
    <AblyProvider client={client}>
      {children}
    </AblyProvider>
  )
}
