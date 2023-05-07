import { useEffect, useState, useContext } from 'react'
import Head from 'next/head'
import CollectionList from '../components/_CollectionList'
import { CollectionContext } from '../components/_DataContext'
import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'
import collection from '../styles/collection.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWallet, faCircleExclamation} from '@fortawesome/free-solid-svg-icons'

export default function Collection() {
  
  const { oldCollection, newCollection, setVerified, fetch } = useContext(CollectionContext)
  const [blur, setBlur] = useState(false)
  const [body, setBody] = useState()
  const [dialogBox, setDialogBox] = useState()
  const router = useRouter()
  const [selection, setSelection] = useState(0)
  const { address, isConnected } = useAccount()

  useEffect(() => {
    if(isConnected) {
      fetch()
      check()
    }
    else if(!isConnected) {
      const Body = (
        <>
        <div className={blur ? collection.blur : collection.main}>
          <ul className={collection.tabs}>
            <li onClick={() => setSelection(0)} className={collection.selectedTab}><h4>Old Contract</h4></li>
            <li onClick={() => setSelection(1)} className={collection.unSelectedTabRight}><h4>New Contract</h4></li>
          </ul>
          <div className={collection.TokensListTwo}>
            <CollectionList collection={newCollection} type='collection' />
          </div>
        </div>
        <button onClick={() => (router.push('/migrate'))} className={collection.migrate}><h5 className={collection.migrateText}>MIGRATE</h5></button>
      </>
      )
      const dialogBox = (
        <div className={collection.dialogBoxButtons}>
          <div className={collection.simpleBox}>
            <p className={collection.dialogTitle}>No Wallet Connected</p>
            <FontAwesomeIcon icon={faWallet} style={{"height": "27px",}} />
          </div>
          <div className={collection.singleButton}>
            <button onClick={() => router.push('/')}><l>Connect Wallet</l></button>
          </div>
        </div>
      )
      setBlur(true)
      setBody(Body)
      setDialogBox(dialogBox)
      setVerified(false)
    }
  },[address, isConnected])

  useEffect(() => {
    check()
  }, [oldCollection, newCollection])

  useEffect(() => {
    check()
  }, [selection])

  const check = () => {
    if(newCollection && oldCollection){
      if(isConnected) {
        const newCollectionLength = Object.keys(newCollection).length
        const oldCollectionLength = Object.keys(oldCollection).length
        if(newCollectionLength !== 0) {
          if(oldCollectionLength !== 0) {
            const body = (
              <>
                <div className={blur ? collection.blur : collection.main}>
                  <ul className={collection.tabs}>
                    <li onClick={() => setSelection(0)} className={selection === 0 ? collection.selectedTab : collection.unSelectedTabLeft}><h4>Old Contract</h4></li>
                    <li onClick={() => setSelection(1)} className={selection === 1 ? collection.selectedTab : collection.unSelectedTabRight}><h4>New Contract</h4></li>
                  </ul>
                  <div className={collection.TokensListTwo}>
                    <CollectionList collection={selection === 0 ? oldCollection : newCollection} update={() => {}} type='collection' />
                  </div>
                </div>
                <button onClick={() => (router.push('/migrate'))} className={collection.migrate}><h5 className={collection.migrateText}>MIGRATE</h5></button>
              </>
            )
            setBody(body)
          }
          else {
            const body = (
              <div className={blur ? collection.blur : collection.main}>
                <h4 className={collection.singleTitle}>New Contract</h4>
                <div className={collection.TokensListSingle}>
                  <CollectionList collection={newCollection} update={() => {}} type='collection' />
                </div>
            </div>
            )
            setBody(body)
          }
        }
        else if(oldCollectionLength !== 0) {
          const body = (
            <>
              <div className={blur ? collection.blur : collection.main}>
                <h4 className={collection.singleTitle}>Old Contract</h4>
                <div className={collection.TokensListSingle}>
                  <CollectionList collection={oldCollection} update={() => {}} type='collection' />
                </div>
              </div>
              <button onClick={() => (router.push('/migrate'))} className={collection.migrate}><h5 className={collection.migrateText}>MIGRATE</h5></button>
            </>
          )
          setBody(body)
        }
        else {
          const Body = (
            <>
            <div className={blur ? collection.blur : collection.main}>
              <ul className={collection.tabs}>
                <li onClick={() => setSelection(0)} className={collection.selectedTab}><h4>Old Contract</h4></li>
                <li onClick={() => setSelection(1)} className={collection.unSelectedTabRight}><h4>New Contract</h4></li>
              </ul>
              <div className={collection.TokensListTwo}>
                <CollectionList collection={newCollection} type='collection' />
              </div>
            </div>
            <button onClick={() => (router.push('/migrate'))} className={collection.migrate}><h5 className={collection.migrateText}>MIGRATE</h5></button>
          </>
          )
          const dialogBox = (
            <div className={collection.dialogBoxButtons}>
              <div className={collection.simpleBox}>
                <p className={collection.dialogTitle}>You don`&apos;`t have any Y4si tokens</p>
                <FontAwesomeIcon icon={faCircleExclamation} style={{"height": "54px",}} />
              </div>
              <div className={collection.singleButton}>
                <button><l><a href="https://rarible.com/vvoyage/items" target="_blank" rel="noopener noreferrer">Purchase</a></l></button>
              </div>
          </div>
          )
          setBody(body)
          setBlur(true)
          setDialogBox(dialogBox)
          setBlur(true)
        }
      }
    }
  }

  return (
    <>
      <Head>
        <title>Token Wrapper App</title>
        <meta name="description" content="Created by Siblings Lab" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className={blur ? collection.collectionTabBlur : collection.collectionTab}>
        <h3 className={collection.title}>Your Tokens</h3>
        {body}
      </div>
      {dialogBox}
    </>
  );
}