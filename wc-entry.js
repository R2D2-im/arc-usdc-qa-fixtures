import SignClient from '@walletconnect/sign-client'
import QRCode from 'qrcode'

const PROJECT_ID = '62d7353db5ad5bc95ae39dcb752630f5'
const CHAIN = 'eip155:5042'
let client
let session

const qrContainer = () => document.querySelector('#wcQr')

function adapter() {
  const accountEntry = session.namespaces.eip155.accounts.find(value => value.startsWith(`${CHAIN}:`))
  if (!accountEntry) throw new Error('WalletConnect 会话没有 Arc Mainnet 账户')
  const account = accountEntry.split(':')[2]
  return {
    request: async ({ method, params = [] }) => {
      if (method === 'eth_chainId') return '0x13b2'
      if (method === 'eth_accounts' || method === 'eth_requestAccounts') return [account]
      if (method === 'wallet_switchEthereumChain') return null
      return client.request({ topic: session.topic, chainId: CHAIN, request: { method, params } })
    }
  }
}

window.connectWalletConnect = async () => {
  client ||= await SignClient.init({
    projectId: PROJECT_ID,
    metadata: {
      name: 'Arc USDC QA Fixtures',
      description: 'Arc native/ERC-20 decimals manual test DApp',
      url: window.location.origin,
      icons: []
    }
  })
  const { uri, approval } = await client.connect({
    requiredNamespaces: {
      eip155: {
        methods: ['eth_sendTransaction', 'eth_call', 'eth_signTypedData_v4'],
        chains: [CHAIN],
        events: ['accountsChanged', 'chainChanged']
      }
    }
  })
  qrContainer().innerHTML = ''
  if (uri) await QRCode.toCanvas(qrContainer().appendChild(document.createElement('canvas')), uri, { width: 280, margin: 1 })
  session = await approval()
  qrContainer().innerHTML = ''
  await window.setExternalProvider(adapter())
}
