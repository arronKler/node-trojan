import https from 'https'
import tls from 'tls'
import fs from 'fs'

import SocketHandler from './SocketHandler'

const PORT = 8000
const options: tls.TlsOptions = {
  key: fs.readFileSync('./cert/server-key.pem'),
  cert: fs.readFileSync('./cert/server-cert.pem')
}

const server = tls.createServer(options, socket => {
  let handler = new SocketHandler(socket)
})

server.listen(PORT, () => {
  const address = server.address()
  let info = ''
  if (typeof address !== 'string')
    info = `${address?.address} : ${address?.port} / ${address?.family}`
  else info = address

  console.log(`server started ==> ${info}`)
})
