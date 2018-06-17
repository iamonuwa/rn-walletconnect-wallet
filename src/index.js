import { Connector, handleResponse } from 'js-walletconnect-core'

export default class WalletConnector extends Connector {
  //
  // send session status
  //
  async sendSessionStatus(sessionData = {}) {
    const { fcmToken, walletWebhook, data = {} } = sessionData
    if (!fcmToken || !walletWebhook) {
      throw new Error('fcmToken and walletWebhook are required')
    }

    // encrypt data
    const encryptedData = await this.encrypt(data)

    // store transaction info on bridge
    const res = await fetch(`${this.bridgeURL}/session/${this.sessionId}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fcmToken,
        walletWebhook,
        data: encryptedData
      })
    })
    handleResponse(res)
    return true
  }

  //
  // send transaction status
  //
  async sendTransactionStatus(transactionId, statusData = {}) {
    if (!transactionId) {
      throw new Error('`transactionId` is required')
    }

    // encrypt data
    const encryptedData = await this.encrypt(statusData)

    // store transaction info on bridge
    const res = await fetch(
      `${this.bridgeURL}/session/${
        this.sessionId
      }/transaction/${transactionId}/status/new`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: encryptedData
        })
      }
    )
    handleResponse(res)
    return true
  }

  //
  // get session request data
  //
  // async getSessionRequest() {
  //   return this._getEncryptedData(`/session/${this.sessionId}`)
  // }

  //
  // get transaction request data
  //
  async getTransactionRequest(transactionId) {
    if (!transactionId) {
      throw new Error('transactionId is required')
    }

    return this._getEncryptedData(
      `/session/${this.sessionId}/transaction/${transactionId}`
    )
  }
}
