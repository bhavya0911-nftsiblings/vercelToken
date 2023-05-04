import { useEffect, useState, useContext } from 'react'
import Head from 'next/head'
import CollectionList from '../components/_CollectionList'
import { CollectionContext } from '../components/_DataContext'
import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'
import Collection from '../styles/collection.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWallet, faCircleExclamation} from '@fortawesome/free-solid-svg-icons'

export default function CollectionTab() {
  
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
        <div className={blur ? Collection.blur : Collection.main}>
          <ul className={Collection.tabs}>
            <li onClick={() => setSelection(0)} className={Collection.selectedTab}><h4>Old Contract</h4></li>
            <li onClick={() => setSelection(1)} className={Collection.unSelectedTabRight}><h4>New Contract</h4></li>
          </ul>
          <div className={Collection.TokensListTwo}>
            <CollectionList collection={newCollection} type='collection' />
          </div>
        </div>
        <button onClick={() => (router.push('/migrate'))} className={Collection.migrate}><h5 className={Collection.migrateText}>MIGRATE</h5></button>
      </>
      )
      const dialogBox = (
        <div className={Collection.dialogBoxButtons}>
          <div className={Collection.simpleBox}>
            <p className={Collection.dialogTitle}>No Wallet Connected</p>
            <FontAwesomeIcon icon={faWallet} style={{"height": "27px",}} />
          </div>
          <div className={Collection.singleButton}>
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
                <div className={blur ? Collection.blur : Collection.main}>
                  <ul className={Collection.tabs}>
                    <li onClick={() => setSelection(0)} className={selection === 0 ? Collection.selectedTab : Collection.unSelectedTabLeft}><h4>Old Contract</h4></li>
                    <li onClick={() => setSelection(1)} className={selection === 1 ? Collection.selectedTab : Collection.unSelectedTabRight}><h4>New Contract</h4></li>
                  </ul>
                  <div className={Collection.TokensListTwo}>
                    <CollectionList collection={selection === 0 ? oldCollection : newCollection} update={() => {}} type='collection' />
                  </div>
                </div>
                <button onClick={() => (router.push('/migrate'))} className={Collection.migrate}><h5 className={Collection.migrateText}>MIGRATE</h5></button>
              </>
            )
            setBody(body)
          }
          else {
            const body = (
              <div className={blur ? Collection.blur : Collection.main}>
                <h4 className={Collection.singleTitle}>New Contract</h4>
                <div className={Collection.TokensListSingle}>
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
              <div className={blur ? Collection.blur : Collection.main}>
                <h4 className={Collection.singleTitle}>Old Contract</h4>
                <div className={Collection.TokensListSingle}>
                  <CollectionList collection={oldCollection} update={() => {}} type='collection' />
                </div>
              </div>
              <button onClick={() => (router.push('/migrate'))} className={Collection.migrate}><h5 className={Collection.migrateText}>MIGRATE</h5></button>
            </>
          )
          setBody(body)
        }
        else {
          const Body = (
            <>
            <div className={blur ? Collection.blur : Collection.main}>
              <ul className={Collection.tabs}>
                <li onClick={() => setSelection(0)} className={Collection.selectedTab}><h4>Old Contract</h4></li>
                <li onClick={() => setSelection(1)} className={Collection.unSelectedTabRight}><h4>New Contract</h4></li>
              </ul>
              <div className={Collection.TokensListTwo}>
                <CollectionList collection={newCollection} type='collection' />
              </div>
            </div>
            <button onClick={() => (router.push('/migrate'))} className={Collection.migrate}><h5 className={Collection.migrateText}>MIGRATE</h5></button>
          </>
          )
          const dialogBox = (
            <div className={Collection.dialogBoxButtons}>
              <div className={Collection.simpleBox}>
                <p className={Collection.dialogTitle}>You don`&apos;`t have any Y4si tokens</p>
                <FontAwesomeIcon icon={faCircleExclamation} style={{"height": "54px",}} />
              </div>
              <div className={Collection.singleButton}>
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
      <div className={blur ? Collection.collectionTabBlur : Collection.collectionTab}>
        <h3 className={Collection.title}>Your Tokens</h3>
        {body}
      </div>
      {dialogBox}
    </>
  );
}