import { AuthMethods } from "../enums";

export type AuthMethodType = AuthMethods | number;

export interface ShakeRequest {
  VER: number;
  NMETHODS: number;
  METHODS: Array<AuthMethodType>;
}

export interface ShakeResponse {
  VER: number;
  METHOD: AuthMethodType;
}

export interface UserAuthRequest {
  VER: number;
  ULEN: number;
  UNAME: number[];
  PLEN: number;
  PASSWD: number[];
}

export interface UserAuthResponse {
  VER: number;
  STATUS: 0x00 | 0x01;
}
