# **AoWallet**

## Introduction
AoWallet is a wallet application based on AO and Arweave, featuring functionalities such as Wallet, Token, Faucet, Lottery, and Apps.

## **Security**
1. User private keys are encrypted using AES-256-GCM and only the ciphertext is stored locally.
2. Each time the application is opened, the password is verified for correctness. If the user forgets the password, the private key cannot be recovered, and can only be restored by importing the backed-up private key.
3. No private servers are used to provide backend APIs; all business data is stored on the AO chain.

## **Code Audit**
1. The project is open-source with the license: GPL-2.0.
2. Regular third-party code security audits are conducted.

## **Supported Platforms**
1. IOS (Waiting for account preparation)
2. Android (Waiting for account preparation)
3. Chrome Extension
4. Web

## **Wallet**

Provides basic wallet functionalities for Arweave & Ao:

1. Wallet Management: Generate new wallets, import wallets, export wallets, set passwords, etc.
2. Wallet Usage: Send, receive, query balances, etc.
3. Asset Management: Add Tokens online, delete Tokens, query Token balances, etc.
4. Contact Management: Support for adding frequently used contacts.

## **Token**

Token is a tool for managing Tokens developed based on AO, with the following main functionalities:

1. Issue Token: Support for setting Token's symbol, name, total supply, etc.
2. Mint Token: Mint a certain amount of Token for existing Tokens.
3. Airdrop Token: Support for sending Tokens to multiple addresses and amounts at once.
4. All Token Transaction Records: View all send and receive records for the entire Token.
5. My Transaction Records: All transaction records for the current user.
6. Send Records.
7. Receive Records.
8. All Holders: List all addresses and amounts holding the current Token.
9. Send Token: Send Tokens to external addresses.

## **Faucet**

Faucet is a Faucet aggregation feature developed for Token, allowing users to find all Token lists that want to distribute rewards to users in this place:

1. Users only need to click on a Token to receive a certain amount of Token.
2. Users can receive a certain amount of Token at once or daily.
3. When claiming Tokens, users may be required to have a certain amount of AR or AO in their account to avoid large-scale request by malicious scripts.
4. If you are a project owner, you can also recharge a Token to extend the usage time of the Faucet. If the Faucet balance is insufficient, the Faucet will automatically hide.

## **Lottery**

Lottery is a Lottery product under development, modeled after the rules of the Lottery project in Solana, based on AO.

## **Apps**

Apps are used to integrate other third-party AO applications.

## Requirements
- [NodeJS](https://nodejs.org) version 18.17+

## Installation
```bash
Development:
git clone https://github.com/chives-network/AoWallet
cd AoWallet
npm run dev

Build:
npm run build
```

## Contact

Discord: https://discord.gg/aAkMH9Q3AY
Email: chivescoin@gmail.com
Twitter: http://twitter.com/chivesweave