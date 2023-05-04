import Head from 'next/head'
import { useAccount, useDisconnect, useSignMessage } from 'wagmi'
import { verifyMessage } from 'ethers/lib/utils.js'
import { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import { CollectionContext } from '../components/_DataContext'
import index from '../styles/index.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faCircleExclamation, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'

import {
  useConnectModal,
} from '@rainbow-me/rainbowkit';

export default function Index() {

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
            <div className={index.dialogBoxButtons}>
              <div className={index.tryAgain}>
                <p className={index.dialogTitle}>You don`&apos;`t have any Y4si tokens</p>
                <FontAwesomeIcon icon={faXmark} style={{color: "#ff0000", "height": "27px",}} />
              </div>
              <div className={index.sendButtons}>
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
        <div className={index.dialogBoxButtons}>
          <div className={index.tryAgain}>
            <p className={index.dialogTitle}>Try Again</p>
            <FontAwesomeIcon icon={faCircleExclamation} style={{"height": "27px",}} />
          </div>
          <div className={index.sendButtons}>
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
        <div className={index.dialogBox}>
          <p className={index.dialogTitle}>Waiting for user</p>
          <FontAwesomeIcon icon={faSpinner} spin style={{"--fa-primary-color": "#000000", "--fa-secondary-color": "#000000", "height": "27px",}} />
        </div>
      )
      setDialogBox(DialogBox)
    }
    if(isSuccess) {
      const DialogBox = (
        <div className={index.dialogBox}>
          <p className={index.dialogTitle}>Verified</p>
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
      <div className={blur ? index.blur : index.box}>
        <h1 className={index.title}>YUNIVERSE</h1>
        <h5 className={index.migrate}>migrate your y4si tokens to new contract</h5>
        {text === 'Connect Wallet' && <button className={index.connectButton} onClick={openConnectModal} type="button">
          <h3 className={index.connectText}>CONNECT WALLET</h3>
        </button>}
        {text === 'Verify' && <button className={index.connectButton} onClick={() => sign()}><h3 className={index.connectText}>Verify</h3></button>}
        {text === 'Migrate' && <button className={index.connectButton} onClick={() => router.push('/migrate')}><h3 className={index.connectText}>Migrate</h3></button>}
        {text === 'Collection' && <button className={index.connectButton} onClick={() => router.push('/collection')}><h3 className={index.connectText}>Collection</h3></button>}
      </div>
      {dialogBox}
    </>
  )
}