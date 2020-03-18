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
  let passwd = Buffer.from(hash.digest('hex'))
  console.log('passwd: ', passwd.byteLength)
  let startBufff = Buffer.from([[0x0d, 0x0a]])
  let endBuff = Buffer.from([[0x0d, 0x0a]])

  let cmd = Buffer.from([0x01])
  let atyp = Buffer.from([0x03])
  let dst = Buffer.from('www.playeruu.com')
  let port = Buffer.from([8080])
  let requestBuff = Buffer.concat([cmd, atyp, dst, port])

  let payload = Buffer.from('AAAAA')

  let totalBuff = Buffer.concat([
    passwd,
    startBufff,
    requestBuff,
    endBuff,
    payload
  ])

  console.log(
    totalBuff.byteLength,
    totalBuff.lastIndexOf(endBuff),
    startBufff.toString('hex')
  )
  console.log(Buffer.from([0x0d, 0x0a]).toString('hex'))

  socket.write(totalBuff)
})

socket.on('data', chunk => {
  console.log(chunk)
})
