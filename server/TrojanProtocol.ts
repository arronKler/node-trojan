export interface ITrojanRequest {
  CMD: number
  ATYP: number
  ADDR: Buffer | string
  PORT: Buffer | string | number
}

export interface IHandshakeProtocol {
  password: Buffer | string
  request: ITrojanRequest
  payload: Buffer | string
}

export default class TrojanProtocol {
  constructor() {}
  static verifyProtocol(buff: Buffer) {
    return true
  }

  static parse(buff: Buffer): IHandshakeProtocol {
    let offset = 56
    let passwordBuff = buff.slice(0, offset)
    let endTrojanRequstIdx = buff.indexOf(Buffer.from([0x0d, 0x0a]))

    console.log('the buff', buff.slice(offset), Buffer.from([0x0d, 0x0a]))
    if (endTrojanRequstIdx < 0) {
      console.error('not good')
    }
    console.log('end', endTrojanRequstIdx)
    let trojanRequestBuff = buff.slice(offset + 2, endTrojanRequstIdx)
    let payloadBuff = buff.slice(endTrojanRequstIdx + 2)

    let trojanRequest: ITrojanRequest = TrojanProtocol.parseTrojanRequest(
      trojanRequestBuff
    )

    let proto: IHandshakeProtocol = {
      password: passwordBuff,
      payload: payloadBuff,
      request: trojanRequest
    }

    return proto
  }

  // parse trojan request part
  static parseTrojanRequest(buff: Buffer): ITrojanRequest {
    let cmd = buff[0]
    let atyp = buff[1]

    let addr = buff.slice(2)
    let port = buff.slice(-2)
    return {
      CMD: cmd,
      ATYP: atyp,
      ADDR: addr,
      PORT: port.toString('utf8')
    }
  }
}
