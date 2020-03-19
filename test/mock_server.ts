import http from 'http'

http
  .createServer((req, res) => {
    res.end('html page')
  })
  .listen(8080)
