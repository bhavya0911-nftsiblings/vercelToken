import Head from 'next/head'
import { useAccount, useDisconnect, useSignMessage } from 'wagmi'
import { verifyMessage } from 'ethers/lib/utils.js'
import { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import { CollectionContext } from './components/_DataContext'
import Index from '../styles/index.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faCircleExclamation, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'

import {
  useConnectModal,
} from '@rainbow-me/rainbowkit';

export default function index() {

  const { oldCollection, newCollection, fetch, verified, setVerified, visitable, setVisitable } = useContext(CollectionContext)

  const router = useRouter()
  const [blur, setBlur] = useState(false)
  const [text, setText] = useState('Connect Wallet')
  const { openConnectModal } = useConnectModal()
  const { address, isConnected } = useAccount()
  const [ dialogBox, setDialogBox ] = useState(null)
  const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage({
    onSuccess(data, variables) {
      const connectedAddress = verifyMessage(variables.message, data)
      if(connectedAddress === address)
      setVerified(true)
    }
  })
  const { disconnect } = useDisconnect()

  const closeDialog = () => {
    setDialogBox(<></>)
    setBlur(false)
    setText('Verify')
  }

  const sign = async () => {
    setBlur(true)
    await signMessage({
      message: 'gm ser',
    })
  }

  const clear = () => {
    disconnect()
    setBlur(false)
  }

  useEffect(() => {
    if(isConnected) {
      if(oldCollection && newCollection) {
        if(Object.keys(oldCollection).length !== 0) {
          setText('Migrate')
          if(!visitable) {
            router.push('/migrate')
            setVisitable(true)
          }
        }
        else if(Object.keys(newCollection).length !== 0) {
          setText('Collection')
          if(!visitable) {
            router.push('/collection')
            setVisitable(true)
          }
        }
        else {
          const DialogBox = (
            <div className={Index.dialogBoxButtons}>
              <div className={Index.tryAgain}>
                <p className={Index.dialogTitle}>You don't have any Y4si tokens</p>
                <FontAwesomeIcon icon={faXmark} style={{color: "#ff0000", "height": "27px",}} />
              </div>
              <div className={Index.sendButtons}>
                <button><l><a href="https://rarible.com/vvoyage/items" target="_blank" rel="noopener noreferrer">Purchase</a></l></button>
                <button onClick={() => clear()}><l>Connect Another Wallet</l></button>
              </div>
            </div>
          )
          setBlur(true)
          setDialogBox(DialogBox)
        }
      }
    }
    else if(!isConnected) {
      setText('Connect Wallet')
      const DialogBox = (
        <></>
      )
      setDialogBox(DialogBox)
    }
  }, [isConnected, address, oldCollection, newCollection, verified])

  useEffect(() => {
    if(isConnected && !verified) {
      setDialogBox(
        <div className={Index.dialogBoxButtons}>
          <div className={Index.tryAgain}>
            <p className={Index.dialogTitle}>Try Again</p>
            <FontAwesomeIcon icon={faCircleExclamation} style={{"height": "27px",}} />
          </div>
          <div className={Index.sendButtons}>
            <button onClick={() => sign()}><l>Verify</l></button>
            <button onClick={() => closeDialog()}><l>Close</l></button>
          </div>
        </div>
      )
    }
  }, [isError])

  useEffect(() => {
    if(isConnected) {
      if(!verified) sign()
    }
    else {
      setVerified(false)
    }
  }, [isConnected, address])

  useEffect(() => {
    if(!verified) {
      setText('Connect Wallet')
    }
  }, [verified])

  useEffect(() => {
    if(isLoading) {
      const DialogBox = (
        <div className={Index.dialogBox}>
          <p className={Index.dialogTitle}>Waiting for user</p>
          <FontAwesomeIcon icon={faSpinner} spin style={{"--fa-primary-color": "#000000", "--fa-secondary-color": "#000000", "height": "27px",}} />
        </div>
      )
      setDialogBox(DialogBox)
    }
    if(isSuccess) {
      const DialogBox = (
        <div className={Index.dialogBox}>
          <p className={Index.dialogTitle}>Verified</p>
          <FontAwesomeIcon icon={faCheck} style={{"height": "27px",}} />
        </div>
      )
      setDialogBox(DialogBox)
    }
  }, [isLoading, isSuccess])

  return (
    <>
      <Head>
        <title>Token Wrapper App</title>
        <meta name="description" content="Created by Siblings Lab" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className={blur ? Index.blur : Index.box}>
        <h1 className={Index.title}>YUNIVERSE</h1>
        <h5 className={Index.migrate}>migrate your y4si tokens to new contract</h5>
        {text === 'Connect Wallet' && <button className={Index.connectButton} onClick={openConnectModal} type="button">
          <h3 className={Index.connectText}>CONNECT WALLET</h3>
        </button>}
        {text === 'Verify' && <button className={Index.connectButton} onClick={() => sign()}><h3 className={Index.connectText}>Verify</h3></button>}
        {text === 'Migrate' && <button className={Index.connectButton} onClick={() => router.push('/migrate')}><h3 className={Index.connectText}>Migrate</h3></button>}
        {text === 'Collection' && <button className={Index.connectButton} onClick={() => router.push('/collection')}><h3 className={Index.connectText}>Collection</h3></button>}
      </div>
      {dialogBox}
    </>
  )
}