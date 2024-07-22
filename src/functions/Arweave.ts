
// ** Third Party Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'

export async function GetArWalletAllTxs (Address: string) {
    const query = "query getTransactions($ids: [ID!], $owners: [String!], $recipients: [String!], $tags: [TagFilter!], $bundledIn: [ID!], $block: BlockFilter, $first: Int = 10, $after: String, $sort: SortOrder = HEIGHT_DESC) {\n  transactions(\n    ids: $ids\n    owners: $owners\n    recipients: $recipients\n    tags: $tags\n    bundledIn: $bundledIn\n    block: $block\n    first: $first\n    after: $after\n    sort: $sort\n  ) {\n    pageInfo {\n      hasNextPage\n    }\n    edges {\n      cursor\n      node {\n        id\n        block {\n          height\n          id\n          timestamp\n        }\n        recipient\n        owner {\n          address\n          key\n        }\n        fee {\n          winston\n          ar\n        }\n        quantity {\n          winston\n          ar\n        }\n        tags {\n          name\n          value\n        }\n        data {\n          size\n          type\n        }\n        bundledIn {\n          id\n        }\n      }\n    }\n  }\n}\n"
    try {
        const res = await axios.post(authConfig.backEndApiAr + '/graphql', { query, operationName: "getTransactions", variables: {owners: [Address]} }).then(res=>res.data);
        if(res && res.data && res.data.transactions) {
            return res.data.transactions
        }
    } 
    catch (error) {
        console.error("Error fetching transactions:", error);
    }
}

export function urlToSettings (url: string) {
    const obj = new URL(url)
    const protocol = obj.protocol.replace(':', '')
    const host = obj.hostname
    const port = obj.port ? parseInt(obj.port) : protocol === 'https' ? 443 : 80
    
    return { protocol, host, port }
};