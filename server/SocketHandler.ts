import tls from 'tls'
import net from 'net'

import TrojanProtocol, { IHandshakeProtocol } from './TrojanProtocol'

export default class SocketHandler {
  constructor(private socket: tls.TLSSocket) {
    socket.once('data', (buff: Buffer) => {
      console.log('received buff:', buff)

      if (TrojanProtocol.verifyProtocol(buff)) {
        let protocolObj = TrojanProtocol.parse(buff)
        this.buildTunnel(protocolObj)
      } else {
        this.toFakeSite()
      }
    })

    socket.on('end', () => {
      console.log('no more data transfering')
    })
  }

  buildTunnel(protocolObj: IHandshakeProtocol) {
    console.log('request', protocolObj)
  }

  toFakeSite() {}
}
