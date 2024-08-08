# **AoWallet**

## 简介
AoWallet是基于AO和Arweave的钱包应用程序，主要功能有: Wallet， Token， Faucet， Lottery， Apps等功能。

## **安全性**
1. 使用AES-256-GCM对用户私钥进行加密，并且只把密文存储在用户本地。 
2. 用户每次打开应用的时候，需要较验密码是否正确。 如果用户忘记密码，则无法恢复出私钥，只能通过备份的私钥来导入系统进行恢复。 
3. 没有使用私有服务器提供后端API，所有业务数据均存储在AO链上。 

## **代码审计**
1. 本项目开放源代码，授权协议为: GPL-2.0。 
2. 会定期请第三方机构做代码安全审计。 

## **支持平台**
1. IOS (Waiting for prepare account)
2. Android (Waiting for prepare account)
3. [Chrome Extension](https://chromewebstore.google.com/detail/aowallet-arweave-wallet/dcgmbfihnfgaaokeogiadpgllidjnkgm?hl=en-US)
4. [Web](https://web.aowallet.org)

## **Wallet**

提供Arweave & Ao基础的钱包功能：

1. 钱包管理: 生成新的钱包，导入钱包，导出钱包，设置密码等。    
2. 钱包使用: 发送，接收，查询余额等。 
3. 资产管理: 在线添加Token，删除Token，查询Token余额等。    
4. 联系人管理: 支持添加常用联系人。 

## **Token**

Token是基于AO开发的管理TOKEN的工具，具有以下主要功能：

1. 发行TOKEN：支持设置TOKEN的标志、名称、总量等信息。   
2. 铸造TOKEN：为现有TOKEN铸造一定数量的TOKEN。   
3. 空投TOKEN：支持一次性向多个地址和金额发送TOKEN。   
4. 所有TOKEN交易记录：查看整个TOKEN的所有发送和接收记录。   
5. 我的交易记录：当前用户的所有交易记录。   
6. 发送记录。   
7. 接收记录。   
8. 所有持有者：列出所有持有当前TOKEN的地址和金额。   
9. 发送TOKEN：将TOKEN发送到外部。

## **Faucet**

Faucet是针对Token开发的Faucet聚合功能，可以让用户在这个地方找到所有想给用户分发奖励的Token列表：

1. 用户只需要点击某一个Token，就可以获取到一定数量的Token。 
2. 用户可以一次性或是每天获得到一定数量的Token。 
3. 用户在领取Token的时候，可能会要求用户的账户里面，必须有一定量的AR或是AO，用于避免恶意脚本的大量领取。 
4. 如果你是项目方，你还可以对某一个Token进行充值，用于延长Faucet的使用时间。 如果Faucet余额不足，Faucet则会自动隐藏。 

## **Lottery**

Lottery是仿照Solana中Lottery项目的规则， 基于AO的， 目前还在开发中的一款Lottery产品

## **Apps**

Apps用于集成其它第三方的AO应用程序.

## 要求
- [NodeJS](https://nodejs.org) 版本 18.17+

## 安装
```bash
开发:
git clone https://github.com/chives-network/AoWallet
cd AoWallet
npm run dev

构建:
npm run build
```

## 联系方式

Discord：https://discord.gg/aAkMH9Q3AY
Email: chivescoin@gmail.com
Twitter: http://twitter.com/chivesweave