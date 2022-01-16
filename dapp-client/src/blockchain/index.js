import React from 'react'
import { useState, useContext } from 'react'
import Web3 from 'web3'
import MemoryToken from "./contracts/MemoryToken.json"


// this is the equivalent to the createStore method of Redux
// https://redux.js.org/api/createstore

const BlockchainContext = React.createContext();

export default BlockchainContext;

export const BlockchainProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [account, setAccount] = useState()
    const [balance, setBalance]  = useState(0)
    const [myTokens, setMyTokens] = useState([])

    const [token, setToken] = useState();

    const loadWeb3 = async () => {

        try{
            if (window.ethereum) {
                window.web3 = new Web3(window.ethereum)
                await window.ethereum.enable()
                return true;
            } else if (window.web3) {
                window.web3 = new Web3(window.web3.currentProvider)
                return true
            } else {
                window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
                return false
            }
        } catch (err) {
            window.alert('Error on login into your Wallet', err);
            return false
        }
    }

    const geMyTokensFromBlockchain = async (token, account) =>{

        let balanceOf = await token.methods.balanceOf(account).call()

        const blockchainTokens = []
        for (let i = 0; i < balanceOf; i++) {
            const id = await token.methods.tokenOfOwnerByIndex(account, i).call()
            const tokenURI = await token.methods.tokenURI(id).call()

            blockchainTokens.push(tokenURI)
        }

        setMyTokens(blockchainTokens)
    }

    const loadBlockchainData = async () => {
        const web3 = window.web3
        const accounts = await web3.eth.getAccounts()

        setAccount(accounts[0]);                

        // Load smart contract
        const networkId = await web3.eth.net.getId()
        const networkData = MemoryToken.networks[networkId]
       
        if(networkData) {
            const abi = MemoryToken.abi
            const address = networkData.address

            const balance = web3.utils.fromWei(await web3.eth.getBalance(address), 'ether')
            const _token = new web3.eth.Contract(abi, address)           

            setToken(_token)
            setBalance(balance)
        
            await geMyTokensFromBlockchain(_token, accounts[0]);

        } else {
          alert('Smart contract not deployed to detected network.')
        }
        
      }  

    async function doLogin() {
        if (await loadWeb3()){
            await loadBlockchainData();
            setIsAuthenticated(true);
        }
    }

    const doMint = async (tokenURI, events) => {
        const web3 = window.web3

        const { onRegistered, onError , onReceipt, onConfirmation } = events
        
        token.methods.mint(account, tokenURI)
            .send({from: account})
            .on('transactionHash', async (hash) => {            
                console.log("Seu NFT's foi registrado")
                await onRegistered(hash)
            })
            .on('receipt', async (receipt) => {
                
                console.log("Seu NFT's foi mintado com sucesso")

                await onReceipt(receipt)
                await geMyTokensFromBlockchain(token, account)
            })
            .on('confirmation', async (confirmationNumber, receipt) => {                
                console.log("Confirmação registrada");

                await onConfirmation(confirmationNumber, receipt)
                await geMyTokensFromBlockchain(token, account)                            
            })
            .on('error', async (err) => {
                onError(err.message)
            })       
            
    }

    return (
        <BlockchainContext.Provider
            value={{
                isLoged: isAuthenticated,
                account,
                balance,
                myTokens,
                geMyTokensFromBlockchain,
                doLogin,
                doMint
            }}
        >
        {children}
        </BlockchainContext.Provider>
    );
}

export function useBlockchain() {
    const context = useContext(BlockchainContext);
  
    return context;
  }