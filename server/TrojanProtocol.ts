enum E_CMD {
  CONNECT = 0x01,
  UDP = 0x03
}

enum E_ATYP {
  IP4 = 0x01,
  DOMAIN = 0x03,
  IP6 = 0x04
}

export interface ITrojanRequest {
  CMD: E_CMD
  ATYP: E_ATYP
  ADDR: string
  PORT: number
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

    let endTrojanRequstIdx = buff.lastIndexOf(Buffer.from([0x0d, 0x0a]))

    if (endTrojanRequstIdx < 0) {
      console.error('Not valid')
      throw Error('Not valid trojan protocol!')
    }

    let trojanRequestBuff = buff.slice(offset + 2, endTrojanRequstIdx)
    let payloadBuff = buff.slice(endTrojanRequstIdx + 2)

    let trojanRequest: ITrojanRequest = TrojanProtocol.parseTrojanRequest(
      trojanRequestBuff
    )

    let proto: IHandshakeProtocol = {
      password: passwordBuff.toString(),
      payload: payloadBuff.toString(),
      request: trojanRequest
    }

    return proto
  }

  // parse trojan request part
  static parseTrojanRequest(buff: Buffer): ITrojanRequest {
    let cmd = buff[0]
    let atyp = buff[1]

    let addr = buff.slice(2, -2)
    let port = buff.slice(-2)

    return {
      CMD: cmd,
      ATYP: atyp,
      ADDR: addr.toString('utf8'),
      PORT: port.readUInt16BE(0)
    }
  }
}
