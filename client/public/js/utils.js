
function testBase58toBytes32() {
    let hashbs58 = 'Qmf412jQZiuVUtdgnB36FXFX7xg5V6KEbSJ4dpQuhkLyfD'
            // let hashbs58 = 'QmNSUYVKDSvPUnRLKmuxk9diJ6yS96r1TrAXzjTiBcCLAL'
            console.log(hashbs58.length)
            const shorten = (hash) => '0x' + bs58.decode(hash).slice(2).toString('hex')
            const lengthen = (short) => bs58.encode(Buffer.from('1220' + short.slice(2), 'hex'))
            console.log(hashbs58)

            let a = toHexString(decode(hashbs58).slice(0, 2))
            console.log(a)
            // console.log(encode(hexStringToByteArray(a)))
            let b = toHexString(decode(hashbs58).slice(2))
            console.log(b)
            let c = a + b
            console.log(encode(hexStringToByteArray(c)))
}
// how to store ipfs hash to eth smart contract
// because param size exceed bytes32
// : https://ethereum.stackexchange.com/questions/17094/how-to-store-ipfs-hash-using-bytes32
var ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
var ALPHABET_MAP = {};
var BASE = 58;
for (var i = 0; i < ALPHABET.length; i++) {
  ALPHABET_MAP[ALPHABET.charAt(i)] = i;
}

function decode(string) {
	if (string.length === 0) return [];
	var i,
		j,
		bytes = [0];
	for (i = 0; i < string.length; i++) {
		var c = string[i];
        // c是不是ALPHABET_MAP的key 
		if (!(c in ALPHABET_MAP)) throw new Error('Non-base58 character');
		for (j = 0; j < bytes.length; j++) bytes[j] *= BASE;
		bytes[0] += ALPHABET_MAP[c];
		var carry = 0;
		for (j = 0; j < bytes.length; ++j) {
			bytes[j] += carry;
			carry = bytes[j] >> 8;
            // 0xff --> 11111111
			bytes[j] &= 0xff;
		}
		while (carry) {
			bytes.push(carry & 0xff);
			carry >>= 8;
		}
	}
	// deal with leading zeros
	for (i = 0; string[i] === '1' && i < string.length - 1; i++) bytes.push(0);
	return bytes.reverse();
}

function encode(buffer) {
	if (buffer.length === 0) return '';
	var i,
		j,
		digits = [0];
	for (i = 0; i < buffer.length; i++) {
		for (j = 0; j < digits.length; j++){
            // 將資料轉為二進位制，再位運算右邊添8個0，得到的數轉二進位制
            // 位運算-->相當於 digits[j].toString(2);parseInt(10011100000000,2)
            digits[j] <<= 8;
        }
		digits[0] += buffer[i];
		var carry = 0;
		for (j = 0; j < digits.length; ++j) {
			digits[j] += carry;
			carry = (digits[j] / BASE) | 0;
			digits[j] %= BASE;
		}
		while (carry) {
			digits.push(carry % BASE);
			carry = (carry / BASE) | 0;
		}
	}
	// deal with leading zeros
	for (i = 0; buffer[i] === 0 && i < buffer.length - 1; i++) digits.push(0);
	return digits
		.reverse()
		.map(function(digit) {
			return ALPHABET[digit];
		})
		.join('');
}

function getBytes32FromIpfsHash(ipfsListing) {
    return "0x"+toHexString(decode(ipfsListing).slice(2))
}
  
  // Return base58 encoded ipfs hash from bytes32 hex string,
  // E.g. "0x017dfd85d4f6cb4dcd715a88101f7b1f06cd1e009b2327a0809d01eb9c91f231"
  // --> "QmNSUYVKDSvPUnRLKmuxk9diJ6yS96r1TrAXzjTiBcCLAL"
  
function getIpfsHashFromBytes32(bytes32Hex) {
    // Add our default ipfs values for first 2 bytes:
    // function:0x12=sha2, size:0x20=256 bits
    // and cut off leading "0x"
    const hashHex = "1220" + toHexString(bytes32Hex.slice(2))
    const hashStr = encode(hashBytes)
    return hashStr
}

function toHexString(byteArray) {
    return Array.from(byteArray, function(byte) {
      return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
}

function hexStringToByteArray(hexString) {
    if (hexString.length % 2 !== 0) {
        throw "Must have an even number of hex digits to convert to bytes";
    }/* w w w.  jav  a2 s .  c o  m*/
    var numBytes = hexString.length / 2;
    var byteArray = new Uint8Array(numBytes);
    for (var i=0; i<numBytes; i++) {
        byteArray[i] = parseInt(hexString.substr(i*2, 2), 16);
    }
    return byteArray;
}

function downloadBlob(blob, name = 'file.txt') {
    // Convert your blob into a Blob URL (a special url that points to an object in the browser's memory)
    const blobUrl = URL.createObjectURL(blob);
  
    // Create a link element
    const link = document.createElement("a");
  
    // Set link's href to point to the Blob URL
    link.href = blobUrl;
    link.download = name;
  
    // Append link to the body
    document.body.appendChild(link);
  
    // Dispatch click event on the link
    // This is necessary as link.click() does not work on the latest firefox
    link.dispatchEvent(
      new MouseEvent('click', { 
        bubbles: true, 
        cancelable: true, 
        view: window 
      })
    );
  
    // Remove link from body
    document.body.removeChild(link);
  }