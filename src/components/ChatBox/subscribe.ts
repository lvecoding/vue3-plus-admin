import { getToken } from '@/utils/auth'
import { Stomp } from '@stomp/stompjs'

// 配置参数
interface WebsocketOptions {
  url: string
  maxReconnectAttempts?: number // 最大重连次数
  reconnectDelay?: number // 重连间隔(ms)
  heartbeatIncoming?: number // 心跳接收间隔(ms)
  heartbeatOutgoing?: number // 心跳发送间隔(ms)
}

export const connectWebsocket = (options: WebsocketOptions) => {
  return new Promise(resolve => {
    const { url, reconnectDelay = 5000, heartbeatIncoming = 10000, heartbeatOutgoing = 10000 } = options

    let stompClient: any = null
    // let reconnectAttempts = 0
    // let heartbeatTimer: any = null
    let isManuallyClosed = false // 新增手动关闭标志

    // 连接逻辑
    const connect = () => {
      if (isManuallyClosed) return // 如果是手动关闭则不重连

      stompClient = Stomp.client(url)

      // 配置心跳
      stompClient.heartbeatIncoming = heartbeatIncoming
      stompClient.heartbeatOutgoing = heartbeatOutgoing
      stompClient.reconnectDelay = reconnectDelay

      const headers = {
        token: getToken()
      }

      stompClient.connect(
        headers,
        frame => {
          console.log('Connected:', frame)
          resolve({
            client: stompClient,
            close: closeConnection
          })
          // startHeartbeatCheck()
        },
        error => {
          console.error('STOMP error:', error)
          // handleReconnect(error)
        }
      )

      // 监听连接关闭
      stompClient.onStompError = (frame: any) => {
        console.error('Broker reported error:', frame.headers.message)
        // handleReconnect(new Error(frame.headers.message))
      }
    }

    // 心跳检查
    // const startHeartbeatCheck = () => {
    //   clearHeartbeatCheck() // 先清除已有检查

    //   heartbeatTimer = setInterval(() => {
    //     if (!stompClient || !stompClient.connected) {
    //       console.warn('Connection lost, attempting reconnect...')
    //       handleReconnect(new Error('Heartbeat check failed'))
    //       clearHeartbeatCheck()
    //     }
    //   }, heartbeatOutgoing * 1.5)
    // }

    // 清除心跳检查
    // const clearHeartbeatCheck = () => {
    //   if (heartbeatTimer) {
    //     clearInterval(heartbeatTimer)
    //     heartbeatTimer = null
    //   }
    // }

    // 处理重连
    // const handleReconnect = (error: Error) => {
    //   if (isManuallyClosed || reconnectAttempts >= maxReconnectAttempts) {
    //     console.error(isManuallyClosed ? 'Connection manually closed' : 'Max reconnection attempts reached')
    //     reject(error)
    //     return
    //   }

    //   reconnectAttempts++
    //   console.log(`Reconnect attempt ${reconnectAttempts}/${maxReconnectAttempts}`)

    //   setTimeout(() => {
    //     disconnectClient() // 先断开现有连接
    //     connect()
    //   }, reconnectDelay)
    // }

    // 断开客户端连接
    const disconnectClient = () => {
      if (stompClient && stompClient.connected) {
        try {
          stompClient.disconnect()
        } catch (e) {
          console.error('Disconnect error:', e)
        }
      }
    }

    // 重置重连计数器
    // const resetReconnect = () => {
    //   reconnectAttempts = 0
    // }

    // 公开的关闭方法
    const closeConnection = () => {
      // isManuallyClosed = true
      // clearHeartbeatCheck()
      disconnectClient()
    }

    // 初始连接
    connect()
  })
}
