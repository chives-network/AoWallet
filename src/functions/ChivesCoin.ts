import { entropyToMnemonic, mnemonicToSeedSync, generateMnemonic } from "bip39";
import { Program } from '@rigidity/clvm'
import { AugSchemeMPL, JacobianPoint, PrivateKey, } from '@rigidity/bls-signatures'

import { bech32m } from 'bech32';

import { puzzles } from './Xcc/puzzles'

export interface AccountKey {
  compatibleMnemonic?: string;
  fingerprint: number;
  privateKey?: string;
  publicKey?: Hex0x;
}

export type Hex = string;

export type Hex0x = "()" | `0x${string}`;


export function generateSeed() {
  const array = new Uint8Array(16);
  self.crypto.getRandomValues(array);

  return entropyToMnemonic(new Buffer(array));
}

export async function getAccount() {

  const mnemonic12 = generateMnemonic()
  const seeds12 = mnemonicToSeedSync(mnemonic12, "");
  console.log("mnemonic12 ", mnemonic12)

  const mnemonic24 = entropyToMnemonic( new Buffer(seeds12.slice(0, 32)) );
  console.log("mnemonic24 ", mnemonic24)

  const seeds24 = mnemonicToSeedSync(mnemonic24);

  const privateKey = PrivateKey.fromSeed(seeds24)
  const publicKey = privateKey.getG1()
  const fingerprint = publicKey.getFingerprint()
  const privateKeyHex = privateKey.toHex()
  const publicKeyHex = publicKey.toHex()
  const address = seedToAddress(seeds24, 'xcc')
  const addressToPuzzleHashData = addressToPuzzleHash(address)
  const address2 = toAddress(addressToPuzzleHashData, 'xcc')

  const keyPairs: any[] = []
  for(let i=0; i<5; i++) {
    const getKeyPairsData = getKeyPairs(privateKey, i)
    keyPairs.push(getKeyPairsData)
  }

  console.log("address1 ", address)
  console.log("address2 ", address2)
  console.log("address2 addressToPuzzleHashData", addressToPuzzleHashData)
  console.log("address2 keyPairs", keyPairs)

  return {mnemonic12, mnemonic24, privateKey: privateKeyHex, publicKey: publicKeyHex, fingerprint, address}
}

export const getProgramBySeed = (seed: Uint8Array): Program => {
  const masterPrivateKey = PrivateKey.fromSeed(seed)
  const derivePrivateKeyData = derivePrivateKey(masterPrivateKey)
  const derivePublicKey = derivePrivateKeyData.getG1()
  const program = puzzles.wallet.curry([
      Program.fromBytes(
          syntheticPublicKey(
              derivePublicKey,
              Program.deserializeHex('ff0980').hash()
          ).toBytes()
      ),
  ])

  return program
}

export const getKeyPairs = (privateKey: PrivateKey, Index: number): any => {
  const derivePrivateKeyData = derivePrivateKeyPath(privateKey, [12381, 8444, 2, Index], true)
  const publicKey = derivePrivateKeyData.getG1()
  const puzzle = puzzles.wallet.curry([
      Program.fromBytes(
          syntheticPublicKey(
              publicKey,
              Program.deserializeHex('ff0980').hash()
          ).toBytes()
      ),
  ])
  const address = toAddress(puzzle.hash(), 'xcc')

  return {privateKey: derivePrivateKeyData.toHex(), publicKey: publicKey.toHex(), address}
}

export const seedToPuzzle = (seed: Uint8Array): Program => {
  return getProgramBySeed(seed)
}

export const seedToAddress = (seed: Uint8Array, prefix: string): string => {
  return toAddress(getProgramBySeed(seed).hash(), prefix)
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

export const derivePrivateKey = (masterPrivateKey: PrivateKey): PrivateKey => {
  return derivePrivateKeyPath(masterPrivateKey, [12381, 8444, 2, 0], true)
}

export const derivePublicKey = (masterPublicKey: JacobianPoint, index: number): JacobianPoint => {
  return derivePublicKeyPath(masterPublicKey, [12381, 8444, 2, index, ])
}

export const derivePrivateKeyPath = (privateKey: PrivateKey, path: number[], hardened: boolean ): PrivateKey => {
  for (const index of path) {
      privateKey = ( hardened ? AugSchemeMPL.deriveChildSk : AugSchemeMPL.deriveChildSkUnhardened ) (privateKey, index)
  }

  return privateKey
}

export const derivePublicKeyPath = (publicKey: JacobianPoint, path: number[] ): JacobianPoint => {
  for (const index of path) {
      publicKey = AugSchemeMPL.deriveChildPkUnhardened(publicKey, index)
  }

  return publicKey
}
