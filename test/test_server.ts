import tls from 'tls'
import fs from 'fs'
import crypto from 'crypto'

const options: tls.ConnectionOptions = {
  ca: fs.readFileSync('./cert/server-cert.pem'),
  host: 'localhost',
  port: 8000
}

let socket = tls.connect(options, () => {
  console.log('make connection')

  const hash = crypto.createHash('sha224')
  hash.update('arronkler', 'utf8')
  let passwd = Buffer.from(hash.digest('hex'))
  console.log('passwd: ', passwd.toString())
  let startBuff = Buffer.from([0x0d, 0x0a])
  let endBuff = Buffer.from([0x0d, 0x0a])

  let cmd = Buffer.from([0x01])
  let atyp = Buffer.from([0x03])
  let dst = Buffer.from('127.0.0.1')
  let port = Buffer.from('1f90', 'hex')
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

  // socket.write(totalBuff)
  socket.write(Buffer.from('gjoshg'))
  socket.once('data', chunk => {
    console.log('first chunk:', chunk.toString('utf8'))
    if (chunk.toString('utf8') == 'confirm') {
      // process.stdin.pipe(socket)
      socket.end('GET / HTTP/1.0\n\n')
      socket.on('data', chunk => {
        console.log('get chunk', chunk.toString('utf8'))
      })

      socket.on('error', err => {
        console.error(err)
      })
    }
  })
})

socket.on('data', chunk => {
  console.log(chunk)
})
