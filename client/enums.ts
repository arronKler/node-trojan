export enum AuthMethods {
  NOAUTH = 0x00,
  GSSAPI = 0x01,
  USERPASS = 0x02,
  NOACCEPT = 0xff
}

export enum CommandType {
  TCPConnect = 1,
  TCPBind,
  UDPBind
}

export enum AddressType {
  IPv4 = 0x01,
  DomainName = 0x03,
  IPv6 = 0x04
}
