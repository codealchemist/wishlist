import { Realtime } from 'ably'
import { AblyProvider } from 'ably/react'
import isClient from '@/util/is-client'

function log () {
  console.log('[ lib/Messages ]', ...arguments)
}

const baseUrl = isClient()
  ? window.location.origin
  : ''
const client = new Realtime({
  authUrl: `${baseUrl}/.netlify/functions/ably-token-request`,
  echoMessages: false
})

class Messages {
  allChannels = new Set()

  publish (channelUuid, message) {
    log('publish', { channelUuid, message })
    const channel = client.channels.get(channelUuid)
    channel.publish(channelUuid, message)
  }

  subscribe (channelUuid, callback) {
    log('subscribe', { channelUuid })

    // Keep track of all channels we subscribe to.
    this.allChannels.add(channelUuid)

    const channel = client.channels.get(channelUuid)
    channel.subscribe(message => {
      // log('got message!', { message })
      callback(message)
    })
  }

  unsubscribe (channelUuid) {
    log('unsubscribe', { channelUuid })
    const channel = client.channels.get(channelUuid)
    channel.unsubscribe()
    channel.detach()
  }

  unsubscribeAll () {
    log('unsubscribeAll')
    this.allChannels.forEach(channelUuid => {
      this.unsubscribe(channelUuid)
    })
  }

  onEnter (channelUuid, callback) {
    log('onEnter', { channelUuid })
    const channel = client.channels.get(channelUuid)
    channel.presence.subscribe('enter', (member) => {
      log('member entered', { member })
      callback(member)
    })
  }

  onLeave (channelUuid, callback) {
    log('onLeave', { channelUuid })
    const channel = client.channels.get(channelUuid)
    channel.presence.subscribe('leave', (member) => {
      log('member left', { member })
      callback(member)
    })
  }

  onGetWishes (channelUuid, callback) {
    log('onGetWishes', { channelUuid })
    this.subscribe(channelUuid, message => {
      if (message?.data?.type === 'get-wishes') {
        callback(message)
      }
    })
  }

  getWishes ({ clientUuid }) {
    // We only send wishes to private channels.
    log('getWishes', { clientUuid })
    this.publish(clientUuid, {
      type: 'get-wishes'
    })
  }

  sendWishes ({ clientUuid, wishes, details }) {
    // We only send wishes to private channels.
    log('sendWishes', { clientUuid, wishes })
    this.publish(clientUuid, {
      type: 'get-wishes-response',
      wishes,
      details
    })
  }

  onGetWishesResponse (clientUuid, callback) {
    log('onGetWishesResponse', { clientUuid })
    this.subscribe(clientUuid, message => {
      if (message?.data?.type === 'get-wishes-response') {
        callback(message)
      }
    })
  }

  onNewClient (channelUuid, callback) {
    log('onNewClient', { channelUuid })
    this.subscribe(channelUuid, message => {
      if (message?.data?.type === 'new-client') {
        callback(message)
      }
    })
  }

  newClient({ channelUuid, clientUuid }) {
    log('newClient', { channelUuid, clientUuid })
    this.publish(channelUuid, {
      type: 'new-client',
      clientUuid
    })
  }

  newClientResponse({ clientUuid }) {
    log('newClientResponse', { clientUuid })
    this.publish(clientUuid, {
      type: 'new-client-response',
      clientUuid
    })
  }

  onNewClientResponse (clientUuid, callback) {
    log('onNewClientResponse', { clientUuid })
    this.subscribe(clientUuid, message => {
      if (message?.data?.type === 'new-client-response') {
        callback(message)
      }
    })
  }
}

const messages = new Messages()
export default messages
