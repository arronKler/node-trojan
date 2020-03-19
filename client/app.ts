import net from 'net'
import { handleShake } from './libs'

let server = net.createServer()
const PORT = 1081

server.listen(
  {
    port: PORT
  },
  function() {
    console.log('Server listenint to %j', server.address())
  }
)

server.on('connection', function(socket) {
  handleShake(socket)
  socket.on('close', () => {
    console.log('client closed socket')
    socket.destroy()
  })

  socket.on('error', e => {
    console.log('socket error: ', e.stack)
    socket.destroy()
  })
})

process.on('uncaughtException', function(err) {
  console.log(err.stack)
  console.log('NOT exit...')
})
