import crypto from 'crypto'

export default class Auth {
  static verifyPaswd(userPass: string): boolean {
    let hash = crypto.createHash('sha224')
    hash.update('arronkler', 'utf8')
    let truePasswd = hash.digest('hex')

    return truePasswd === userPass
  }
}
