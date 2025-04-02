/**
 * Utilitários para interação com Ethereum e MetaMask
 */

// Verifica se o MetaMask está instalado
export const isMetaMaskInstalled = (): boolean => {
  return typeof window !== "undefined" && typeof window.ethereum !== "undefined"
}

// Solicita acesso às contas do MetaMask
export const requestAccounts = async (): Promise<string[]> => {
  if (!isMetaMaskInstalled()) {
    throw new Error("MetaMask não está instalado")
  }

  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    })

    return accounts
  } catch (error) {
    console.error("Erro ao solicitar contas:", error)
    throw error
  }
}

// Envia uma transação usando o MetaMask
export const sendTransaction = async (toAddress: string, amountInEth: string): Promise<string> => {
  if (!isMetaMaskInstalled()) {
    throw new Error("MetaMask não está instalado")
  }

  try {
    // Solicitar contas ao MetaMask
    const accounts = await requestAccounts()

    if (!accounts || accounts.length === 0) {
      throw new Error("Nenhuma conta disponível")
    }

    // Converter ETH para Wei
    const amountInWei = ethToWei(amountInEth)

    // Preparar a transação
    const transactionParameters = {
      to: toAddress,
      from: accounts[0],
      value: amountInWei,
      gas: "0x5208", // 21000 gas (padrão para transferência simples)
    }

    // Enviar a transação
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    })

    return txHash
  } catch (error) {
    console.error("Erro ao enviar transação:", error)
    throw error
  }
}

// Verifica o status de uma transação
export const checkTransactionStatus = async (txHash: string): Promise<boolean> => {
  if (!isMetaMaskInstalled()) {
    throw new Error("MetaMask não está instalado")
  }

  try {
    const receipt = await window.ethereum.request({
      method: "eth_getTransactionReceipt",
      params: [txHash],
    })

    // Se o recibo ainda não estiver disponível, a transação ainda está pendente
    if (!receipt) {
      return false
    }

    // Verificar se a transação foi bem-sucedida (status = 0x1)
    return receipt.status === "0x1"
  } catch (error) {
    console.error("Erro ao verificar status da transação:", error)
    throw error
  }
}

// Converte ETH para Wei (1 ETH = 10^18 Wei)
export const ethToWei = (ethAmount: string): string => {
  try {
    // Converter para número
    const amount = Number.parseFloat(ethAmount)

    // Verificar se é um número válido
    if (isNaN(amount)) {
      throw new Error("Valor inválido")
    }

    // Converter para Wei (1 ETH = 10^18 Wei)
    const weiAmount = BigInt(Math.floor(amount * 1e18))

    // Converter para hexadecimal
    return "0x" + weiAmount.toString(16)
  } catch (error) {
    console.error("Erro ao converter ETH para Wei:", error)
    throw error
  }
}

// Adiciona listeners para eventos do MetaMask
export const addMetaMaskListeners = (
  onAccountsChanged: (accounts: string[]) => void,
  onChainChanged: (chainId: string) => void,
  onDisconnect: () => void,
): void => {
  if (!isMetaMaskInstalled()) {
    return
  }

  // Listener para mudança de contas
  window.ethereum.on("accountsChanged", onAccountsChanged)

  // Listener para mudança de rede
  window.ethereum.on("chainChanged", onChainChanged)

  // Listener para desconexão
  window.ethereum.on("disconnect", onDisconnect)
}

// Remove listeners de eventos do MetaMask
export const removeMetaMaskListeners = (
  onAccountsChanged: (accounts: string[]) => void,
  onChainChanged: (chainId: string) => void,
  onDisconnect: () => void,
): void => {
  if (!isMetaMaskInstalled()) {
    return
  }

  window.ethereum.removeListener("accountsChanged", onAccountsChanged)
  window.ethereum.removeListener("chainChanged", onChainChanged)
  window.ethereum.removeListener("disconnect", onDisconnect)
}

