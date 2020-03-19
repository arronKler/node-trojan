import net from 'net'
import { AuthMethods, CommandType, AddressType } from './enums'
import Shake from './classes/Shake'

export function handleShake(socket: net.Socket) {
  socket.once('data', function(buf: Buffer) {
    let shake = new Shake(buf)
    if (!shake.isVersion5()) {
      return socket.end(() => {
        console.log('end connection')
      })
    }

    socket.write(shake.generateResponse())

    handleRequest(socket)
  })
}

export function handleRequest(socket: net.Socket) {
  socket.once('data', function(buff: Buffer) {
    if (buff[0] !== 0x05) {
      buff[1] = 0x01
      socket.end(buff, () => {
        console.log('version not right')
      }) // wrong version
      return
    }

    let offset = 3
    let addressType = buff[offset]
    let address = ''
    if (addressType === AddressType.IPv4) {
      address =
        buff[offset + 1] +
        '.' +
        buff[offset + 2] +
        '.' +
        buff[offset + 3] +
        '.' +
        buff[offset + 4]
    } else if (addressType === AddressType.DomainName) {
      address = buff.toString('utf8', offset + 2, buff.length - 2)
    } else if (addressType === AddressType.IPv6) {
      address = buff.slice(offset + 1, buff.length - 2).toString('utf8')
      console.log('problem with ipv6')
    }

    let port = buff.readInt16BE(buff.length - 2)

    console.log('port: %j', port)
    console.log('address: %j', address)
    if (buff[1] === CommandType.TCPConnect) {
      let proxy = net.createConnection(port, address, () => {
        let resp = Buffer.alloc(buff.length)
        buff.copy(resp)
        resp[1] = 0x00
        socket.write(resp)

        proxy.pipe(socket)
        socket.pipe(proxy)
      })
      proxy.on('timeout', () => {
        console.log('time outed')
        socket.destroy()
        proxy.destroy()
      })
    } else {
      console.log('not tcp')
      socket.end(buff)
    }
  })
}
