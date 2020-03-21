import tls, { checkServerIdentity } from 'tls'
import net from 'net'

import TrojanProtocol, { IHandshakeProtocol } from './TrojanProtocol'
import Auth from './Auth'

export default class SocketHandler {
  constructor(private socket: tls.TLSSocket) {
    socket.once('data', (buff: Buffer) => {
      try {
        let protocolObj = TrojanProtocol.parse(buff)
        if (!Auth.verifyPaswd(protocolObj.password as string)) {
          console.error('Password Error!')
          throw new Error('Password Error!')
        }
        this.buildTunnel(protocolObj)
      } catch (err) {
        this.toFakeSite()
      }
    })

    socket.on('end', () => {
      console.log('no more data transfering')
    })
  }

  buildTunnel(protocolObj: IHandshakeProtocol) {
    console.log('request', protocolObj)
    let client = net.createConnection(
      protocolObj.request.PORT,
      protocolObj.request.ADDR,
      () => {
        console.log('Builded Tunel')
      }
    )

    this.socket.on('data', chunk => {
      console.log('user send:', chunk.toString('utf8'))
    })

    this.socket.on('error', err => {
      console.error(err)
    })

    client.on('data', chunk => {
      console.log('server response:', chunk.toString('utf8'))
    })

    client.on('connect', () => {
      console.log('connnected')
      this.socket.write('confirm')
      client.pipe(this.socket)
      this.socket.pipe(client)
    })

    client.on('error', err => {
      console.log('client error: ', err)
    })
  }

  toFakeSite() {
    this.socket.end(`HTTP/1.1 200 OK
Connection: close

Site is Building! Please visite later.
`)
  }
}
