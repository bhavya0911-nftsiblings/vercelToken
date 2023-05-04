import CollectionList from '../components/_CollectionList'
import Head from 'next/head'
import { useAccount, usePrepareContractWrite, useContractWrite } from 'wagmi'
import { useEffect, useState, useContext } from 'react'
import { CollectionContext } from '../components/_DataContext'
import { useRouter } from 'next/router'
import { getContract, getProvider  } from '@wagmi/core'
import migrate from '../styles/migrate.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWallet, faTriangleExclamation, faSpinner, faArrowUpRight, faCircleExclamation, faCheck } from '@fortawesome/free-solid-svg-icons'

export default function Migrate() {

  const [tryAgain, setTryAgain] = useState(false)
  const [zero, setZero] = useState(false)
  const [voyageTokens, setVoyageTokens] = useState([])
  const [loveIsInTheAirTokens, setLoveIsInTheAirTokens] = useState([])
  const [larTokens, setLarTokens] = useState([])
  const [keysTokens, setKeysTokens] = useState([])
  const [dialogBox, setDialogBox] = useState([])
  const [abi, setAbi] = useState([])
  const [functionName, setFunctionName] = useState("")
  const [args, setArgs] = useState([])
  const [gasLimit, setGasLimit] = useState(0)
  const [toApprove, setToApprove] = useState(null)
  const [contractWrite, setContractWrite] = useState(false)
  const [wrap, setWrap] = useState(null)
  const [ERC1155Wrapper, setERC1155Wrapper] = useState(null)
  const [ERC721Wrapper, setERC721Wrapper] = useState(null)
  const [voyage, setVoyage] = useState(null)
  const [loveIsInTheAir, setLoveIsInTheAir] = useState(null)
  const [lar, setLar] = useState(null)
  const [keys, setKeys] = useState(null)
  const [blur, setBlur] = useState(false)

  const { address, isConnected } = useAccount()
  const router = useRouter();
  const { oldCollection, newCollection, collectionAddress, fetch, verified, setVerified } = useContext(CollectionContext)

  const updateTokens = (title, tokenIds) => {
    if (title === 'Voyage') {
      setVoyageTokens(tokenIds)
    }
    else if (title === 'Love Is In The Air') {
      setLoveIsInTheAirTokens(tokenIds)
    }
    else if (title === 'Lines and Ripples') {
      setLarTokens(tokenIds)
    }
    else if(title === 'Key') {
      setKeysTokens(tokenIds)
    }
  }

  const selectedTokens = () => {
    return [voyageTokens, loveIsInTheAirTokens, larTokens, keysTokens]
  }

  const checkForZero = () => {
    let numberOfZeroArray = 0
    let collectionArray = []
    for(let i = 0; i < 4; i++) {
      if(selectedTokens()[i].length === 0) {
        numberOfZeroArray++
      } else collectionArray.push(i)
    }
    if(numberOfZeroArray == 4) return [true, collectionArray]
    else return [false, collectionArray]
  }

  const proceed = () => {
    const [required, collectionArray] = checkForZero()
    let toApproveList = []
    if(!required) {
      for(let i = 0; i < collectionArray.length; i++) {
        const collectionId = collectionArray[i]
        let approved
        let title = ''
        if(collectionId === 0) {
          title = 'Voyage'
        }
        else if(collectionId === 1) {
          title = 'Love Is In The Air'
        }
        else if(collectionId === 2) {
          title = 'Lines and Ripples'
        }
        else if(collectionId === 3) {
          title = 'Key'
        }
        for(let j = 0; j < oldCollection.length; j++) {
          if(oldCollection[j].title === title) {
            approved = oldCollection[j].approved
          }
        }
        if(!approved) {
          toApproveList.push(collectionId)
        }
      }
      setToApprove(toApproveList)
    }
  }

  const { data, config } = usePrepareContractWrite({
    ...abi,
    functionName: functionName,
    args: args,
  })
  
  const { isLoading, isSuccess, write } = useContractWrite({
    ...config,
    onSettled(data, error) {
      async function waitForConfirmation() {
        let DialogBox = (
          <div className={migrate.dialogBoxButtons}>
            <div className={migrate.simpleBox}>
              <div className={migrate.dialogTitle}>
                <p>Awaiting Transaction Confirmation</p>
                <div className={migrate.awaitTrx}>
                  <p><a href={`https://goerli.etherscan.io/tx/${data.hash}`} style={{"color": "#4429F2",}} target="_blank" rel="noopener noreferrer" >Etherscan Link</a></p>
                  <FontAwesomeIcon icon={faTriangleExclamation} style={{"height": "27px",}} />
                </div>
              </div>
              <FontAwesomeIcon icon={faSpinner} spin style={{"--fa-primary-color": "#04020D", "--fa-secondary-color": "#04020D", "height": "54px",}} />
            </div>
          </div>
        )
        setBlur(true)
        setDialogBox(DialogBox)
        await data.wait()
        DialogBox = (
          <div className={migrate.dialogBoxButtons}>
            <div className={migrate.simpleBox}>
              <div className={migrate.dialogTitle}>
                <p>Transaction Confirmed</p>
                <div className={migrate.awaitTrx}>
                  <p><a href={`https://goerli.etherscan.io/tx/${data.hash}`} style={{"color": "#4429F2",}} target="_blank" rel="noopener noreferrer">Etherscan Link</a></p>
                  <FontAwesomeIcon icon={faTriangleExclamation} style={{"height": "27px",}} />
                </div>
              </div>
              <FontAwesomeIcon icon={faCheck} style={{"--fa-primary-color": "#04020D", "--fa-secondary-color": "#04020D", "height": "54px",}} />
            </div>
          </div>
        )
        setBlur(true)
        setDialogBox(DialogBox)
        fetch()
        if(functionName === 'setApprovalForAll') {
          setToApprove((prevToApprove) => {
            let newApprove = []
            for(let i = 1; i < prevToApprove?.length; i++) {
              newApprove.push(prevToApprove[i])
            }
            return newApprove
          })
        }
        if(abi === collectionAddress['ERC1155Wrapper']) {
          if(wrap[1]) {
            setWrap((prevWrap) => {
              const ERC721 = prevWrap[1]
              return [null, ERC721]
            })
          }
          else if(!wrap[1]) {
            router.push('/collection')
          }
        }
        if(abi === collectionAddress['ERC721Wrapper']) {
          if(!wrap[0]) {
            router.push('/collection')
          }
        }
      }
      if(data) {
        waitForConfirmation()
      }
      if(error) {
        const DialogBox = (
          <div className={migrate.dialogBoxButtons}>
            <div className={migrate.simpleBox}>
              <p className={migrate.dialogTitle}>Cancelled by User</p>
              <FontAwesomeIcon icon={faCircleExclamation} style={{"height": "27px",}} />
            </div>
            <div className={migrate.singleButton}>
              <button onClick={() => setContractWrite(true)}><l>Send</l></button>
            </div>
          </div>
        )
        setBlur(true)
        setDialogBox(DialogBox)
      }
    },
  })
  
  const updateApprove = () => {
    if(toApprove.length > 0) {
      const collectionId = toApprove[0]
      if(collectionId === 0) {
        async function approveVoyage() {
          const gas = await voyage.estimateGas.setApprovalForAll(ERC1155Wrapper.address, true)
          setGasLimit(parseInt(gas * 1.25))
          setAbi(collectionAddress['voyage'])
          setFunctionName('setApprovalForAll')
          setArgs([ERC1155Wrapper.address, true])
          setContractWrite(true)
        }
        approveVoyage()
      }
      else if(collectionId === 1) {
        async function approveLoveIsInTheAir() {
          const gas = await loveIsInTheAir.estimateGas.setApprovalForAll(ERC1155Wrapper.address, true)
          setGasLimit(parseInt(gas * 1.25))
          setAbi(collectionAddress['loveIsInTheAir'])
          setFunctionName('setApprovalForAll')
          setArgs([ERC1155Wrapper.address, true])
          setContractWrite(true)
        }
        approveLoveIsInTheAir()
      }
      else if(collectionId === 2) {
        async function approveLar() {
          const gas = await lar.estimateGas.setApprovalForAll(ERC721Wrapper.address, true)
          setGasLimit(parseInt(gas * 1.25))
          setAbi(collectionAddress['lar'])
          setFunctionName('setApprovalForAll')
          setArgs([ERC721Wrapper.address, true])
          setContractWrite(true)
        }
        approveLar()
      }
      else if(collectionId === 3) {
        async function approveKeys() {
          const gas = await keys.estimateGas.setApprovalForAll(ERC1155Wrapper.address, true)
          setGasLimit(parseInt(gas * 1.25))
          setAbi(collectionAddress['keys'])
          setFunctionName('setApprovalForAll')
          setArgs([ERC1155Wrapper.address, true])
          setContractWrite(true)
        }
        approveKeys()
      }
    }
    else {
      migrateTokens()
    }
  }

  const migrateTokens = () => {
    const ERC1155Args = []
    const ERC721Args = []
    let funcERC721 = ''
    let funcERC1155 = ''
    let erc1155Number = []
    let erc721Number = []
    if(voyageTokens.length !== 0) erc1155Number.push(1)
    if(loveIsInTheAirTokens.length !== 0) erc1155Number.push(2)
    if(larTokens.length !== 0) erc721Number.push(3)
    if(keysTokens.length !== 0) erc1155Number.push(4)
    if(erc1155Number.length !== 0) {
      if(erc1155Number.length > 1) {
        let addresses = []
        let tokenIds = []
        let quantity = []
        for(let i = 0; i < erc1155Number.length; i++) {
          const erc1155Collection = getTokens(erc1155Number[i])
          addresses.push(erc1155Collection[0])
          tokenIds.push(erc1155Collection[1])
          quantity.push(erc1155Collection[2])
        }
        ERC1155Args.address = addresses
        ERC1155Args.tokenIds = tokenIds
        ERC1155Args.quantity = quantity
        funcERC1155 = 'batchWrap'
      }
      else {
        let addresses = []
        let tokenIds = []
        let quantity = []
        const erc1155Collection = getTokens(erc1155Number[0])
        addresses.push(erc1155Collection[0])
        tokenIds.push(erc1155Collection[1])
        quantity.push(erc1155Collection[2])
        ERC1155Args.address = addresses[0]
        ERC1155Args.tokenIds = tokenIds
        ERC1155Args.quantity = quantity
        funcERC1155 = 'wrap'
      }
    }
    if(erc721Number.length !== 0) {
      ERC721Args.address = collectionAddress['lar'].address
      ERC721Args.tokenIds = larTokens
      funcERC721 = 'wrap'
    }   
    if(erc1155Number.length !== 0  && erc721Number.length !== 0) {
      const DialogBox = (
        <div className={migrate.dialogBoxButtons}>
          <div className={migrate.simpleBox}>
            <p className={migrate.dialogTitle}>2 transactions required for ERC1155 and ERC721 tokens</p>
            <FontAwesomeIcon icon={faCircleExclamation} style={{"height": "54px",}} />
          </div>
          <div className={migrate.singleButton}>
            <button onClick={() => setWrap([[funcERC1155, ERC1155Args], [funcERC721, ERC721Args]])}><l>Continue</l></button>
          </div>
        </div>
      )
      setBlur(true)
      setDialogBox(DialogBox)
    }
    else if(erc1155Number.length !== 0) {
      setWrap([[funcERC1155, ERC1155Args], null])
    }
    else if(erc721Number.length !== 0) {
      setWrap([null, [funcERC721, ERC721Args]])
    }
  }

  const getTokens = (collectionId) => {
    let contractAddress
    let quantity = []
    let tokenIds = []
    let tokens = []
    if (collectionId === 1) {
      contractAddress = collectionAddress['voyage'].address
      tokens = voyageTokens
    }
    else if(collectionId === 2) {
      contractAddress = collectionAddress['loveIsInTheAir'].address
      tokens = loveIsInTheAirTokens
    }
    else if(collectionId === 4) {
      contractAddress = collectionAddress['keys'].address
      tokens = keysTokens
    }
    for(let i = 0; i < tokens.length; i++) {
      const current = tokens[i]
      let position
      let alreadyAdded = false
      if(tokenIds.length != 0) {
        for(let j = 0; j < tokenIds.length; j++) {
          if(current === tokenIds[j]) {
            position = j
            alreadyAdded = true
            break
          }
        }
        if(alreadyAdded) {
          quantity[position]++
        }
        else {
          tokenIds.push(current)
          quantity.push(1)
        }
      }
      else {
        tokenIds.push(current)
        quantity.push(1)
      }
    }
    return [contractAddress, tokenIds, quantity]
  }

  useEffect(() => {
    if(wrap) {
      const ERC1155 = wrap[0]
      const ERC721 = wrap[1]
      if(ERC1155) {
        async function wrapERC1155() {
          let gas
          // if(ERC1155[0] === 'wrap') gas = await ERC1155Wrapper.estimateGas.wrap(ERC1155[1].address, ERC1155[1].tokenIds, ERC1155[1].quantity)
          // else if(ERC1155[0] === 'batchWrap') gas = await ERC1155Wrapper.estimateGas.batchWrap(ERC1155[1].address, ERC1155[1].tokenIds, ERC1155[1].quantity)
          setGasLimit(parseInt(2000000 * 1.25))
          setAbi(collectionAddress['ERC1155Wrapper'])
          setFunctionName(ERC1155[0])
          setArgs([ERC1155[1].address, ERC1155[1].tokenIds, ERC1155[1].quantity])
        }
        wrapERC1155()
        const DialogBox = (
          <div className={migrate.dialogBoxButtons}>
            <div className={migrate.simpleBox}>
              <p className={migrate.dialogTitle}>migrate all ERC1155 tokens</p>
              <FontAwesomeIcon icon={faCircleExclamation} style={{"height": "27px",}} />
            </div>
            <div className={migrate.singleButton}>
              <button onClick={() => setContractWrite(true)}><l>Continue</l></button>
            </div>
          </div>
        )
        setBlur(true)
        setDialogBox(DialogBox)
      }
      else if(ERC721) {
        async function wrapERC721() {
          // const gas = await ERC721Wrapper.estimateGas.wrap(ERC721[1].address, ERC721[1].tokenIds)
          setGasLimit(parseInt(2000000 * 1.25))
          setAbi(collectionAddress['ERC721Wrapper'])
          setFunctionName(ERC721[0])
          setArgs([ERC721[1].address, ERC721[1].tokenIds])
        }
        wrapERC721()
        const DialogBox = (
          <div className={migrate.dialogBoxButtons}>
            <div className={migrate.simpleBox}>
              <p className={migrate.dialogTitle}>migrate all ERC721 tokens</p>
              <FontAwesomeIcon icon={faCircleExclamation} style={{"height": "27px",}} />
            </div>
            <div className={migrate.singleButton}>
              <button onClick={() => setContractWrite(true)}><l>Continue</l></button>
            </div>
          </div>
        )
        setBlur(true)
        setDialogBox(DialogBox)
      }
    }
  }, [wrap])

  useEffect(() => {
    if(contractWrite) {
      if(typeof write === 'function') {
        write()
        const DialogBox = (
          <div className={migrate.dialogBox}>
            <p className={migrate.dialogTitle}>Waiting for user confirmation</p>
            <FontAwesomeIcon icon={faSpinner} spin style={{"--fa-primary-color": "#000000", "--fa-secondary-color": "#000000", "height": "27px",}} />
          </div>
        )
        setBlur(true)
        setDialogBox(DialogBox)
        setContractWrite(false)
      }
      setContractWrite(false)
      setTryAgain(true)
    }
  }, [contractWrite])

  useEffect(() => {
    setContractWrite(true)
  }, [tryAgain])

  useEffect(() => {
    if(toApprove) {
      if(toApprove.length === 0) {
        migrateTokens()
      }
      else {
        const DialogBox = (
          <div className={migrate.dialogBoxButtons}>
            <div className={migrate.simpleBox}>
              <p className={migrate.dialogTitle}>You need to approve {toApprove.length} contracts to migrate your tokens</p>
              <FontAwesomeIcon icon={faCircleExclamation} style={{"height": "54px",}} />
            </div>
            <div className={migrate.singleButton}>
            <button onClick={() => updateApprove()}>Approve</button>
            </div>
          </div>
        )
        setBlur(true)
        setDialogBox(DialogBox)
      }
    }
  }, [toApprove])

  useEffect(() => {
    if(isLoading) {
      if(isLoading === true) {
        const DialogBox = (
          <div className={migrate.dialogBox}>
            <p className={migrate.dialogTitle}>Waiting for user confirmation</p>
            <FontAwesomeIcon icon={faSpinner} spin style={{"--fa-primary-color": "#000000", "--fa-secondary-color": "#000000", "height": "27px",}} />
          </div>
        )
        setBlur(true)
        setDialogBox(DialogBox)
      }
    }
  }, [isLoading])

  useEffect(() => {
    if(isConnected) {
      fetch()
      if(Object.keys(oldCollection).length === 0 ) {
        if(Object.keys(newCollection).length !== 0) {
          const DialogBox = (
            <div className={migrate.dialogBoxButtons}>
              <div className={migrate.simpleBox}>
                <p className={migrate.dialogTitle}>No tokens to migrate, view collection</p>
                <FontAwesomeIcon icon={faTriangleExclamation} style={{"height": "27px",}} />
              </div>
              <div className={migrate.singleButton}>
                <button onClick={() => router.push('/collection')}>Continue</button>
              </div>
            </div>
          )
          setBlur(true)
          setDialogBox(DialogBox)
        }
        else {
          const DialogBox = (
            <div className={migrate.dialogBoxButtons}>
            <div className={migrate.simpleBox}>
              <p className={migrate.dialogTitle}>You don`&apos;`t have any Y4si tokens</p>
              <FontAwesomeIcon icon={faCircleExclamation} style={{"height": "54px",}} />
            </div>
            <div className={migrate.singleButton}>
              <button><l><a href="https://rarible.com/vvoyage/items" target="_blank" rel="noopener noreferrer">Purchase</a></l></button>
            </div>
          </div>
          )
          setBlur(true)
          setDialogBox(DialogBox)
        }
      }
    }
    else if(!isConnected) {
      const DialogBox = (
        <div className={migrate.dialogBoxButtons}>
          <div className={migrate.simpleBox}>
            <p className={migrate.dialogTitle}>No Wallet Connected</p>
            <FontAwesomeIcon icon={faWallet} style={{"height": "27px",}} />
          </div>
          <div className={migrate.singleButton}>
            <button onClick={() => router.push('/')}><l>Connect Wallet</l></button>
          </div>
        </div>
      )
      setBlur(true)
      setDialogBox(DialogBox)
      setVerified(false)
    }
    if(isConnected) {
      setERC1155Wrapper(getContract({
        ...collectionAddress['ERC1155Wrapper'],
        signerOrProvider: getProvider(),
      }))
      setERC721Wrapper(getContract({
        ...collectionAddress['ERC721Wrapper'],
        signerOrProvider: getProvider(),
      }))
      setVoyage(getContract({
        ...collectionAddress['voyage'],
        signerOrProvider: getProvider(),
      }))
      setLoveIsInTheAir(getContract({
        ...collectionAddress['loveIsInTheAir'],
        signerOrProvider: getProvider(),
      }))
      setLar(getContract({
        ...collectionAddress['lar'],
        signerOrProvider: getProvider(),
      }))
      setKeys(getContract({
        ...collectionAddress['keys'],
        signerOrProvider: getProvider(),
      }))
    }
  }, [address, isConnected])

  useEffect(() => {
      const [required, tokens] = checkForZero()
      if(required) {
        setZero(true)
      }
      else if(!required) {
        setZero(false)
      }
  }, [voyageTokens, loveIsInTheAirTokens, larTokens, keysTokens])

  return(
    <>
      <Head>
        <title>Token Wrapper App</title>
        <meta name="description" content="Created by Siblings Lab" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className={blur ? migrate.blur : migrate.main}>
        <h3 className={migrate.title}>Eligible Tokens</h3>
        <div className={migrate.TokensList}>
          <CollectionList collection={oldCollection} update={updateTokens} type='migrate' />
        </div>
        <button className={zero ? migrate.proceedZero : migrate.proceed} onClick={() => proceed()}><h5 className={zero ? migrate.proceedZeroText : migrate.proceedText}>PROCEED</h5></button>
        {zero && 
        <span className={migrate.zero}>
          <FontAwesomeIcon icon={faTriangleExclamation} style={{color: "#ffffff", height: '15px'}} />
          <l className={migrate.zeroText}>Select a Token</l>
        </span>}
      </div>
      {dialogBox}
    </>
  );
}