import net from 'net'
import tls from 'tls'
import fs from 'fs'
import crypto from 'crypto'
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
      let resp = Buffer.alloc(buff.length)
      buff.copy(resp)
      resp[1] = 0x00
      socket.write(resp)

      createServerConn(socket, port, address)
      /* let proxy = net.createConnection(port, address, () => {
        

        proxy.pipe(socket)
        socket.pipe(proxy)
      })
      proxy.on('timeout', () => {
        console.log('time outed')
        socket.destroy()
        proxy.destroy()
      }) */
    } else {
      console.log('not tcp')
      socket.end(buff)
    }
  })
}

const options: tls.ConnectionOptions = {
  ca: fs.readFileSync('./cert/server-cert.pem'),
  host: 'localhost',
  port: 8000
}

function createServerConn(
  _socket: net.Socket,
  _port: number,
  _address: string
) {
  const socket = tls.connect(options, () => {
    const hash = crypto.createHash('sha224')
    hash.update('arronkler', 'utf8')
    let passwd = Buffer.from(hash.digest('hex'))

    let startBuff = Buffer.from([0x0d, 0x0a])
    let endBuff = Buffer.from([0x0d, 0x0a])

    let cmd = Buffer.from([0x01])
    let atyp = Buffer.from([0x03])
    let dst = Buffer.from(_address)

    let port = Buffer.alloc(2)
    port.writeInt16BE(_port, 0)
    let requestBuff = Buffer.concat([cmd, atyp, dst, port])

    let payload = Buffer.from('AAAAA')

    let totalBuff = Buffer.concat([
      passwd,
      startBuff,
      requestBuff,
      endBuff,
      payload
    ])

    console.log(totalBuff.byteLength, startBuff.byteLength, cmd.byteLength)
    console.log(port.toString(), port.byteLength)

    socket.write(totalBuff)
    // socket.write(Buffer.from('gjoshg'))
    socket.once('data', chunk => {
      console.log('first chunk:', chunk.toString('utf8'))
      if (chunk.toString('utf8') == 'confirm') {
        // process.stdin.pipe(socket)
        socket.pipe(_socket)
        _socket.pipe(socket)

        socket.on('data', chunk => {
          console.log('get chunk', chunk.toString('utf8'))
        })

        socket.on('error', err => {
          console.error(err)
        })
      }
    })
  })
}
