import { entropyToMnemonic, mnemonicToSeedSync, generateMnemonic, validateMnemonic } from "bip39";
import { Program } from '@rigidity/clvm'
import { AugSchemeMPL, JacobianPoint, PrivateKey, } from '@rigidity/bls-signatures'

import { bech32m } from 'bech32';

import { puzzles } from './Xcc/puzzles'

export async function getAccountByRandom() {

  const mnemonic12 = generateMnemonic()
  const seeds12 = mnemonicToSeedSync(mnemonic12, "");
  console.log("mnemonic12 ", mnemonic12)

  const mnemonic24 = entropyToMnemonic( new Buffer(seeds12.slice(0, 32)) );
  console.log("mnemonic24 ", mnemonic24)

  return {mnemonic12, mnemonic24}
}

export async function getAccountByMnemonic24(mnemonic24: string) {

  console.log("mnemonic24 ", mnemonic24)

  if(validateMnemonic(mnemonic24)==false)  {

    return
  }

  const seeds24 = mnemonicToSeedSync(mnemonic24);

  const privateKey = PrivateKey.fromSeed(seeds24)
  const publicKey = privateKey.getG1()
  const fingerprint = publicKey.getFingerprint()
  const privateKeyHex = privateKey.toHex()
  const publicKeyHex = publicKey.toHex()

  const keyPairs: any[] = []
  const addressList : string[] = []
  for(let i=0; i<5; i++) {
    const getKeyPairsData = getKeyPairs(privateKey, 2, i)
    keyPairs.push(getKeyPairsData)
    addressList.push(getKeyPairsData.address)
  }

  return {mnemonic24, MasterPrivateKey: privateKeyHex, MasterPublicKey: publicKeyHex, fingerprint, keyPairs, addressList}
}

/*
Fingerprint: 781749357
Master private key (m): 2a0f20cf205820e35dcc740569847cf9c37943d7d87ca97169f2d8cce11d4ff8
Master public key (m): 89964d71b047be065801d56d7a1272a57d9eb12ac21150feca7f21a5558d95943a7918c08114ab8f7512a91e4c7a85e5
First wallet secret key (m/12381/9699/2/0): <PrivateKey 6c2feaaf5957cff828b2abbd0c4ac96977ae9465474c655d5ed42985be6749fd>
First wallet puzzlehash: 46d465ada36734054e5f0ec8c6518e3ad86530201ca6e5a3d227d61188819e2a
First wallet address: xcc1gm2xttdrvu6q2njlpmyvv5vw8tvx2vpqrjnwtg7jyltprzypnc4q46mzur

Master public key (m): 89964d71b047be065801d56d7a1272a57d9eb12ac21150feca7f21a5558d95943a7918c08114ab8f7512a91e4c7a85e5
First wallet address (non-observer): xcc19wcdxyl36ksddas4kss6dtkgdznj60xsjcpr4een7p3hsyujph2sstqalp
First wallet puzzlehash (non-observer): 2bb0d313f1d5a0d6f615b421a6aec868a72d3cd096023ae733f0637813920dd5

*/

export const getKeyPairs = (privateKey: PrivateKey, Observer: number, Index: number): any => {
  const derivePrivateKeyData = derivePrivateKeyPath(privateKey, [12381, 9699, Observer, Index], false)
  const publicKey = derivePrivateKeyData.getG1()
  const puzzle = puzzles.wallet.curry([
      Program.fromBytes(
          syntheticPublicKey(
              publicKey,
              Program.deserializeHex('ff0980').hash()
          ).toBytes()
      ),
  ])
  const words = bech32m.toWords(puzzle.hash());
  const address = bech32m.encode('xcc', words);

  return {privateKey: derivePrivateKeyData.toHex(), publicKey: publicKey.toHex(), address, puzzleHash: puzzle.hashHex()}
}

export const addressToPuzzleHash = (address: string): Buffer => {
  const decoded = bech32m.decode(address);
  const bytes = bech32m.fromWords(decoded.words);
  const buffer = Buffer.from(bytes);

  return buffer;
}

export const toAddress = (hash: Buffer | Uint8Array, prefix: string): string => {
  const words = bech32m.toWords(hash);
  const address = bech32m.encode(prefix, words);

  return address;
}

export const syntheticPublicKey = (publicKey: JacobianPoint, hiddenPuzzleHash: Uint8Array): JacobianPoint => {
  return JacobianPoint.fromBytes(
    puzzles.syntheticPublicKey.run(
        Program.fromList([
            Program.fromBytes(publicKey.toBytes()),
            Program.fromBytes(hiddenPuzzleHash),
        ])
    ).value.atom,
    false
  )
}

export const derivePrivateKeyPath = (privateKey: PrivateKey, path: number[], hardened: boolean ): PrivateKey => {
  for (const index of path) {
      privateKey = ( hardened ? AugSchemeMPL.deriveChildSk : AugSchemeMPL.deriveChildSkUnhardened ) (privateKey, index)
  }

  return privateKey
}
