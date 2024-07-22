const config = {
  productName: 'AoWallet',
  tokenType: 'XWE', // AR or XWE
  tokenName: '',
  backEndApi: '',
  backEndApiChatBook: '',
  AoConnectWebSite: "https://www.ao.link",
  AoConnectAoLink: "https://www.ao.link/#",
  AoConnectGraphql: 'https://arweave-search.goldsky.com/graphql',
  AoConnectModule: 'JdN3ffZQaFE33-s20LSp2uLhm9Z94wnG59aLRnBAecU',
  AoConnectScheduler: 'fcoN_xJeisVsPXA-trzVAuIiqO3ydLQxM-L4XbrQKzY',
  AoConnectGithub: 'https://github.com/chives-network/AoConnect',
  AoConnectChatRoom: 'AoConnectChatRoom',
  AoConnectMyProcessTxIds: 'w6HQkGKz9VKszy1pT9JcqWUlElv5smxDI_Inv1OOeqc',
  AoConnectChivesServerData: '91uljP8YzSKu01C73xDJNlAs6jcZIboWbsgkPnB-Ks4',
  AoConnectChivesEmailServerData: 'XfYhx10ueGxMwMWyVKAH2O18LJisSkUQATrga9z9Ggs',
  chivesWallets: 'ChivesWallets',
  chivesCurrentWallet: 'ChivesCurrentWallet',
  chivesWalletNickname: 'ChivesWalletNickname',
  chivesDriveActions: 'ChivesDriveActions',
  chivesTxStatus: 'ChivesTxStatus',
  chivesLanguage: 'ChivesLanguage',
  chivesProfile: 'ChivesProfile',
  chivesReferee: 'ChivesReferee',
  'App-Name': 'AoWallet',
  'App-Version': '0.1',
  'App-Instance': '',
  AoConnectBlockTxIds: ['tXnvoxbygi1OIgYzcFC1Qjgrf2Sq9MHgoYBKJkXMV2E']
}

config.backEndApi = config.tokenType === 'AR' ? 'https://arweave.net' : 'https://api.chivesweave.org:1986';
config.tokenName = config.tokenType === 'AR' ? 'AR' : 'XWE';

export default config;