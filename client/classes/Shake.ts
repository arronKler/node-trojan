import { ShakeRequest, AuthMethodType } from "../interface/handshake";

class Shake implements ShakeRequest {
  VER: number = 0x05;
  NMETHODS: number = 0;
  METHODS: Array<AuthMethodType> = [];

  constructor(buff: Buffer) {
    this.resolveRequestBuff(buff);
  }

  resolveRequestBuff(buff: Buffer) {
    this.VER = buff[0];
    this.NMETHODS = buff[1];
    const methods = buff.slice(1);
    this.METHODS = [];
    for (let i = 0; i < methods.length; i++) {
      this.METHODS.push(methods[i]);
    }
  }

  isVersion5() {
    return this.VER === 0x05;
  }

  generateResponse() {
    let response = Buffer.alloc(2);
    response[0] = this.VER;
    response[1] = 0x00;
    return response;
  }
}

export default Shake;
