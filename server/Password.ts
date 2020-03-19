import crypto, { Hash } from 'crypto'


let defaultPass = 'arronkler'

function generatePasswd(pass: string): Buffer {
  let hash = crypto.createHash('sha224')
  let genPasswd = hash.update(pass, 'utf8').digest('hex')
  return Buffer.from(genPasswd)
}

export function isValidPasswd(password: Buffer):boolean {
  return Buffer.compare(password, generatePasswd(defaultPass)) === 0
}