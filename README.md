# $ANIRES Airdrop 🚀🐶

Este é o repositório oficial do sistema de airdrop do **$ANIRES** 🐾, uma plataforma de distribuição de tokens gratuita com suporte multi-chain e sistema de referral! 🎁💎

## Características ⚡

- Suporte para múltiplas redes blockchain (ERC20, BEP20, EVM) 🔗
- Sistema de referral com recompensas 🏆
- Interface responsiva e amigável 📱
- Integração com carteiras Web3 (MetaMask, etc.) 🔑
- Contrato inteligente em Solidity para gerenciamento do airdrop 📜

## Pré-requisitos 🛠️

- Node.js (v14 ou superior) 💻
- npm (v6 ou superior) 📦
- Git 🔧
- MetaMask ou outra carteira Web3 compatível 🦊

## Instalação e Configuração 🚀

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/anires-airdrop.git
cd anires-airdrop

# Instale as dependências
npm install --legacy-peer-deps
npm install --force

# Configure as variáveis de ambiente
cat <<EOF > .env.local
NEXT_PUBLIC_CONTRACT_ADDRESS_ETHEREUM=seu_endereco_contrato_ethereum
NEXT_PUBLIC_CONTRACT_ADDRESS_BSC=seu_endereco_contrato_bsc
NEXT_PUBLIC_CONTRACT_ADDRESS_POLYGON=seu_endereco_contrato_polygon
NEXT_PUBLIC_INFURA_ID=seu_id_infura
EOF

# Execute o projeto localmente
npm run dev
