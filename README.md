# React-Native WalletConnect Wallet

Library to connect React-Native mobile wallets to desktop Dapps using WalletConnect

You can read more about WalletConnect protocol here: http://walletconnect.org/

### Setup

1.  Install NPM Package

```bash
yarn add rn-walletconnect-wallet

# OR

npm install --save rn-walletconnect-wallet
```

2.  Nodify 'crypto' package for cryptography

```bash
# install "crypto" shims and run package-specific hacks
rn-nodeify --install "crypto" --hack
```

### Getting Started

```js
import RNWalletConnect from 'rn-walletconnect-wallet'


/**
 *  Scan QR code to get Session data
 */
onQRCodeScan(session => {
  // save session data
})


/**
 *  Create WalletConnector
 */
const walletConnector = new RNWalletConnect(
  'https://walletconnect.matic.network',
  {
    sessionId: session.sessionId,
    sharedKey: session.sharedKey,
    dappName: session.dappName
  }
)

/**
 *  Send session data
 */
walletConnector.sendSessionStatus({
  fcmToken: '12354...3adc',
  walletWebhook: 'https://walletconnect.matic.network/notification/new',  
  data: {
    accounts: [
      '0x0000000000000000000000000000000000000000'
    ]
  }
})

/**
 *  Handle push notification events & Get transaction data
 */
FCM.on(FCMEvent.Notification, event => {
  const { sessionId, transactionId } = event;

  const transactionData = await walletConnector.getTransactionRequest(transactionId);
});

/**
 *  Send transaction status
 */
walletConnector.sendTransactionStatus({
  success: true,
  txHash: '0xabcd...873'
})
```
