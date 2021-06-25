class FastExponationAlgorithms {

  fromRightToLeft = (a, b, n) => {
    const reversedBinaryB = this._reverseString(b.toString(2));
    let z = 1;
    for (let i = 0; i < reversedBinaryB.length; i++) {
      if (reversedBinaryB[i] == '1') {
        z = (z * a) % n;
      }
      a = Math.pow(a, 2) % n;
    }
    return z;
  } 

  fromLeftToRight = (a, b, n) => {
    const binaryB = b.toString(2);
    let z = 1;
    for (let i = 0; i < binaryB.length; i++) {
      z = Math.pow(z, 2) % n;
      if (binaryB[i] === '1') {
        z = (z * a) % n;
      }
    }
    return z;
  }

  //I can't find the name of this algorithm :(
  fastExponationAlgorithm = (a, b, n) => {
    const binaryB = b.toString(2);
    const res = new Array(binaryB.length);
    res[0] = a;
    for (let i = 0; i < binaryB.length; i++) {
      res[i + 1] = binaryB[i + 1] === '0' ? (Math.pow(res[i], 2)) % n : (Math.pow(res[i], 2) * res[0]) % n
    }
    return res[binaryB.length - 1];
  }

  _reverseString = (str) => str.split('').reverse().join(''); 

}

class DiffieHellmanSystemMember extends FastExponationAlgorithms {
  
  constructor(privateKey) {
    super();
    this._privateKey = privateKey;
  }

  generatePublicKey = (p, g) => {
    this.publicKey = this.fromLeftToRight(g, this._privateKey, p);
  }

  getPrivateSystemKey = (anotherMemberPublicKey, p) => {
    return this.fromRightToLeft(anotherMemberPublicKey, this._privateKey, p);
  }

  showKeys = (name) => {
    console.log(`${name} keys : public = ${this.publicKey} | private = ${this._privateKey}`);
  }
}

class DiffieHellmanSystem {

  constructor(p, g, AlicePrivateKey, BobPrivateKey) {
    this.p = p;
    this.g = g;
    this.Alice = new DiffieHellmanSystemMember(AlicePrivateKey);
    this.Bob = new DiffieHellmanSystemMember(BobPrivateKey);
  }

  generatePublicKeys = () => {
    this.Alice.generatePublicKey(this.p, this.g);
    this.Bob.generatePublicKey(this.p, this.g);
  }

  generatePrivateKey = () => {
    this._privateKey = this.Alice.getPrivateSystemKey(this.Bob.publicKey, this.p);
  }

  getEncryptedMessage = (message) => {
    return this._getEncryptedOrDecryptedMessage(message, 1);
  }

  getDecryptedMessage = (message) => {
    return this._getEncryptedOrDecryptedMessage(message, -1);
  }

  _getEncryptedOrDecryptedMessage = (message, coefficient) => {
    const encryptedOrDecryptedMessage = message.split('').map(symbol => {
      return String.fromCharCode(symbol.charCodeAt(0) + this._privateKey * coefficient);
    });
    return encryptedOrDecryptedMessage.join('');
  }

  showSystemState = () => {
    console.log(`Special numbers : p = ${this.p} | g = ${this.g}`);
    this.Bob.showKeys('Bob');
    this.Alice.showKeys('Alice');
    console.log(`Private system key for encrypting/decrypting : ${this._privateKey}`);
    console.log('');
  }
}

class Hacker extends FastExponationAlgorithms {

  generatePrivateSystemKey = (p, g, publicMemberKey, anotherMemberPublicKey) => {
    const privateMemberKey = this._babyStepGiantStep(p, g, publicMemberKey); 
    this._privateSystemKey = this.fromLeftToRight(anotherMemberPublicKey, privateMemberKey, p);
  }

  getDecryptedMessage = (message) => {
    const decryptedMessage = message.split('').map(symbol => {
      return String.fromCharCode(symbol.charCodeAt(0) - this._privateSystemKey);
    });
    return decryptedMessage.join('');
  }

  _babyStepGiantStep = (p, g, publicMemberKey) => {
    const m = Math.floor(Math.sqrt(p)) + 1;
    const a = [];
    const b = [];

    for (let i = 0; i < m; i++) {
      a.push((Math.pow(g, i) * publicMemberKey) % p);
    }
    for (let i = 1; i < m + 1; i++) {
      b.push(this.fromRightToLeft(g, i * m, p));
    }

    const indexes = this._getIndexesOfEqualElements(a, b);
    return indexes.i * m - indexes.j;
  }

  _getIndexesOfEqualElements = (a, b) => {
    for (let j = 0; j < a.length; j++) {
      for (let i = 0; i < b.length; i++) {
        if (a[j] == b[i]) {
          return { j, i: ++i }
        }
      }
    }
  }

  showKey = () => {
    console.log(`Eve hacked system and private system key for encrypting is ${this._privateSystemKey}`);
  }
}

class OpenChannel {
  constructor(p, g, AlicePrivateKey, BobPrivateKey) {
    this.diffieHellmanSystem = new DiffieHellmanSystem(p, g, AlicePrivateKey, BobPrivateKey);
    this.Eve = new Hacker();
  }

  setEncyptedMessage = (message) => {
    this.encryptedMessage = this.diffieHellmanSystem.getEncryptedMessage(message);
  }

  showChannelState = (message) => {
    this.diffieHellmanSystem.showSystemState();
    console.log(`Message : ${message}`);
    console.log(`Encrypted message : '${this.encryptedMessage}'`);
  }
}

const openChannel = new OpenChannel(227, 117, 124, 127);
const message = 'Bob! It is a very secret message!';

openChannel.diffieHellmanSystem.generatePublicKeys();
openChannel.diffieHellmanSystem.generatePrivateKey();
openChannel.setEncyptedMessage(message);

const { p, g } = openChannel.diffieHellmanSystem;
const AlicePublicKey = openChannel.diffieHellmanSystem.Alice.publicKey;
const BobPublicKey = openChannel.diffieHellmanSystem.Bob.publicKey;

openChannel.Eve.generatePrivateSystemKey(p, g, AlicePublicKey, BobPublicKey);

openChannel.showChannelState(message);
console.log(`Decrypted by Alice/Bob message : '${openChannel.diffieHellmanSystem.getDecryptedMessage(openChannel.encryptedMessage)}'`);
console.log('');
openChannel.Eve.showKey();
console.log(`Decrypted by Eve message : '${openChannel.Eve.getDecryptedMessage(openChannel.encryptedMessage)}'`);