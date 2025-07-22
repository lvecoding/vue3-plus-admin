import JSEncrypt from 'jsencrypt/bin/jsencrypt.min'

// 密钥对生成 http://web.chacuo.net/netrsakeypair

const publicKey = `MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAMmLvpH7IkEGEw1M9DwddQAC4h2p8T1D
blHQdUGd4YMWc9FSFJLvCukrmTnDyxr861tLGli6N9vtt/3bG2Qq3QECAwEAAQ==`

const privateKey = `MIIBVAIBADANBgkqhkiG9w0BAQEFAASCAT4wggE6AgEAAkEAyYu+kfsiQQYTDUz0
PB11AALiHanxPUNuUdB1QZ3hgxZz0VIUku8K6SuZOcPLGvzrW0saWLo32+23/dsb
ZCrdAQIDAQABAkANSQjm1ocLgjr/RXNUAx0TQx1kly8vuqIrAnK4QI/88//8IyDa
eP2dpxVDU0MN8FlU9EEUyCmuMUuPVoU5UruBAiEA5Cig226mVgvWtSORVZJmt/XR
xkne+sR8a1EHC9pjFVcCIQDiI8RdUEN8h7hGE8uuWez/4dMLdprbDkJDJ/bfMSGR
ZwIgdoCfo7khzblSaDy0BKUIku2rafj+RnL9SGQKa96e7fsCIA805oR73D3ohny3
4g90XpqKXf28WQd3+v63FkPF8wLrAiEA2e8RWvGAUWy0n1WHmQJb6ODveWpClzA/
jwP80GKdr14=`

// 加密
export function encrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对数据进行加密
}

// 解密
export function decrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPrivateKey(privateKey) // 设置私钥
  return encryptor.decrypt(txt) // 对数据进行解密
}
