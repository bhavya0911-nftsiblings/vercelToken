import { useState, useEffect } from 'react'
import CollectionList from 'styles/collectionList.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'

export default function Collection(props) {

  const title = props.title
  const tokenIds = props.tokenIds
  const tokenURIs= props.tokenURIs
  const numberOfTokenIds = tokenIds.length
  const type = props.type
  const tokensList = []
  const [selectedTokens, setSelectedTokens] = useState([])
  
  const addToken = (tokenId) => {
    setSelectedTokens((prevSelectedTokens) => {
      return [...prevSelectedTokens, tokenId]
    })
  }

  const removeToken = (tokenId) => {
    setSelectedTokens((prevSelectedTokens) => {
      let newSelectedTokens = []
      let removedToken = true
      for(let i = 0; i < prevSelectedTokens.length; i++) {
        if(prevSelectedTokens[i] === tokenId) {
          if(removedToken) {
            removedToken = false
          } else {
            newSelectedTokens.push(prevSelectedTokens[i])
          }
        } else {
          newSelectedTokens.push(prevSelectedTokens[i])
        }
      }
      return newSelectedTokens
    })
  }

  for(let i = 0; i < numberOfTokenIds; i++) {
    tokensList.push(<Token key={i} tokenId={tokenIds[i]} tokenURI={tokenURIs[i]} addToken={addToken} removeToken={removeToken} type={type} />)
  }

  useEffect(() => {
    setSelectedTokens(tokenIds)
  }, [])
  
  useEffect(() => {
    if(typeof props.update === 'function') {
      props.update(title, selectedTokens)
    }
  },[selectedTokens])

  return(
    <div className={CollectionList.collection}>
      <h4 className={CollectionList.collectionTitle}>{title}</h4>
      <ul className={CollectionList.tokens}>
        {tokensList}
      </ul>
    </div>
  )
}

function Token(props) {
  const tokenId = props.tokenId
  const tokenURI = props.tokenURI
  const check = props.type === 'Migrate' ? true : false
  const [localState, setLocalState] = useState(check)

  const handleClick = (tokenId) => {
    if(check) {
      if(localState) {
        props.removeToken(tokenId)
        setLocalState(false)
      } else {
        props.addToken(tokenId)
        setLocalState(true)
      }
    }
  }

  return (
    <li className={CollectionList.tokenCard}  onClick={() => handleClick(tokenId)} >
        <div className={CollectionList.token}>
          <Image src={tokenURI} className={CollectionList.tokenImg} width={100} height={100} alt={tokenId} />
            {localState && <span className={CollectionList.holder}>
              <FontAwesomeIcon icon={faCheck} style={{"--fa-primary-color": "#04020d", "--fa-secondary-color": "#04020d", "color": "#04020d", "height": "24px",}} />
            </span>}
        </div>
        <p className={CollectionList.tokenId}>#{tokenId}</p>
    </li>
  )
}