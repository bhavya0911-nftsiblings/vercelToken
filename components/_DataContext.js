import { createContext, useState, useEffect } from 'react'
import { ERC1155 } from './abi/ERC1155'
import { ERC721 } from './abi/ERC721'
import { ERC1155WrapperAbi } from './abi/ERC1155Wrapper'
import { ERC721WrapperAbi } from './abi/ERC721Wrapper'
import { LoveIsInTheAir } from './abi/LoveIsInTheAir'
import { useContractReads, useAccount } from 'wagmi'
import voyage1 from '../images/voyage1.png'
import voyage2 from '../images/voyage2.png'
import voyage3 from '../images/voyage3.png'
import voyage4 from '../images/voyage4.png'
import voyage5 from '../images/voyage5.png'
import voyage6 from '../images/voyage6.png'
import love1 from '../images/love1.png'
import love2 from '../images/love2.png'
import love3 from '../images/love3.png'
import love4 from '../images/love4.png'
import love5 from '../images/love5.png'
import lar1 from '../images/lar1.png'
import lar2 from '../images/lar2.png'
import lar3 from '../images/lar3.png'
import lar4 from '../images/lar4.png'
import lar5 from '../images/lar5.png'
import lar6 from '../images/lar6.png'
import lar7 from '../images/lar7.png'
import keys1 from '../images/keys1.png'
import keys2 from '../images/keys2.png'

const CollectionContext = createContext()

function CreateCollection({ children }) {

    const ERC1155WrapperAddress = '0x766e3a0A1AE5fe4CAAFf6e75112aAdeC5C16e62D'
    const ERC721WrapperAddress = '0x54278a00966EE8F6EC0670C4d01D70A45B6201aF'

    const voyage = {
        address: '0x0799C00d237E1295Ef28b1e2BdFCc3005d05b367',
        abi: ERC1155,
    }
    
    const loveIsInTheAir = {
        address: '0x181CECfa1544E6C2a7f4Dd82BbB40840e7eD57D5',
        abi: LoveIsInTheAir,
    }
    
    const lar = {
        address: '0xb2553C14b39A524f1c47524f7582225f15BA8014',
        abi: ERC721,
    }
    
    const keys = {
        address: '0x593168A5Cf20D73754BfdA2cE2898302E254CacE',
        abi: ERC1155,
    }

    const ERC1155Wrapper = {
        address: ERC1155WrapperAddress,
        abi: ERC1155WrapperAbi
    }

    const ERC721Wrapper = {
        address: ERC721WrapperAddress,
        abi: ERC721WrapperAbi
    }

    const [oldCollection, setOldCollection] = useState()
    const [newCollection, setNewCollection] = useState()
    const [collectionAddress, setCollectionAddress] = useState()
    const {address, isConnected } = useAccount()
    const [verified, setVerified] = useState(false)
    const [visitable, setVisitable] = useState(false)

    const { data, isError, isLoading } = useContractReads({
      contracts: [
        {
            ...voyage,
            functionName: 'balanceOfBatch',
            args: [[address, address, address, address, address, address], [1, 2, 3, 4, 5, 6]],
        },
        {
            ...loveIsInTheAir,
            functionName: 'balanceOfBatch',
            args: [[address, address, address, address, address], [1, 2, 3, 4, 5]]
        },
        {
            ...lar,
            functionName: 'balanceOf',
            args: [address]
        },
        {
            ...keys,
            functionName: 'balanceOfBatch',
            args: [[address, address], [1, 2]]
        },
        {
            ...lar,
            functionName: 'ownerOf',
            args: [1]
        },
        {
            ...lar,
            functionName: 'ownerOf',
            args: [2]
        },
        {
            ...lar,
            functionName: 'ownerOf',
            args: [3]
        },
        {
            ...lar,
            functionName: 'ownerOf',
            args: [4]
        },
        {
            ...lar,
            functionName: 'ownerOf',
            args: [5]
        },
        {
            ...lar,
            functionName: 'ownerOf',
            args: [6]
        },
        {
            ...lar,
            functionName: 'ownerOf',
            args: [7]
        },
        {
            ...voyage,
            functionName: 'isApprovedForAll',
            args: [address, ERC1155WrapperAddress]
        },
        {
            ...loveIsInTheAir,
            functionName: 'isApprovedForAll',
            args: [address, ERC1155WrapperAddress]
        },
        {
            ...lar,
            functionName: 'isApprovedForAll',
            args: [address, ERC721WrapperAddress]
        },
        {
            ...keys,
            functionName: 'isApprovedForAll',
            args: [address, ERC1155WrapperAddress]
        },
        {
            ...ERC1155Wrapper,
            functionName: 'balanceOfBatch',
            args: [[address, address, address, address, address, address, address, address, address, address, address, address, address], [1000001, 1000002, 1000003, 1000004, 1000005, 1000006, 2000001, 2000002, 3000001, 3000002, 3000003, 3000004, 3000005]]
        },
        {
            ...ERC721Wrapper,
            functionName: 'balanceOf',
            args: [address]
        },
        {
            ...ERC721Wrapper,
            functionName: 'ownerOf',
            args: [1000001]
        },
        {
            ...ERC721Wrapper,
            functionName: 'ownerOf',
            args: [1000002]
        },
        {
            ...ERC721Wrapper,
            functionName: 'ownerOf',
            args: [1000003]
        },
        {
            ...ERC721Wrapper,
            functionName: 'ownerOf',
            args: [1000004]
        },
        {
            ...ERC721Wrapper,
            functionName: 'ownerOf',
            args: [1000005]
        },
        {
            ...ERC721Wrapper,
            functionName: 'ownerOf',
            args: [1000006]
        },
        {
            ...ERC721Wrapper,
            functionName: 'ownerOf',
            args: [1000007]
        },
      ],
      watch: true,
    })

    const voyageURI = [
      voyage1,
      voyage2,
      voyage3,
      voyage4,
      voyage5,
      voyage6
    ]

    const loveIsInTheAirURI = [
      love1,
      love2,
      love3,
      love4,
      love5
    ]

    const larURI = [
      lar1,
      lar2,
      lar3,
      lar4,
      lar5,
      lar6,
      lar7
    ]

    const keysURI = [
      keys1,
      keys2
    ]

    const calVoyage = () => {
      let tokenIds = []
      let tokenURIs = []
      const initData = data[0]
      initData.map((value, index) => {
        if(value !== 0){
          for(let i = 0; i < value; i++) {
            tokenURIs.push(voyageURI[index])
            tokenIds.push(parseInt(index + 1))
          }
        }
      })
      return [tokenIds, tokenURIs]
    }

    const calLoveIsInTheAir = () => {
      let tokenIds = []
      let tokenURIs = []
      const initData = data[1]
      initData.map((value, index) => {
        if(value !== 0) {
          for(let i = 0; i < value; i++) {
            tokenURIs.push(loveIsInTheAirURI[index])
            tokenIds.push(parseInt(index + 1))
          }
        }
      })
      return [tokenIds, tokenURIs]
    }

    const calLar = () => {
      let tokenIds = []
      let tokenURIs = []
      const initData = data[2]
      if(initData !== 0 ) {
        for(let i = 4; i < 11; i++) {
          if(data[i] === address) {
            tokenURIs.push(larURI[i - 4])
            tokenIds.push(parseInt(i - 3))
          }
        }
      }
      return [tokenIds, tokenURIs]
    }

    const calKeys = () => {
      let tokenIds = []
      let tokenURIs = []
      const initData = data[3]
      initData.map((value, index) => {
        if(value !== 0) {
          for(let i = 0; i < value; i++) {
            tokenURIs.push(keysURI[index])
            tokenIds.push(parseInt(index + 1))
          }
        }
      })
      return [tokenIds, tokenURIs]
    }

    const newCalVoyage = () => {
      let tokenIds = []
      let tokenURIs = []
      const initData = data[15]
      let voyageTokens = []
      for(let i = 0; i < 6; i++) {
        voyageTokens.push(initData[i])
      }
      voyageTokens.map((value, index) => {
        if(value !== 0) {
          for(let i = 0; i < value; i++) {
            tokenURIs.push(voyageURI[index])
            tokenIds.push(parseInt(index + 1))
          }
        }
      })
      return [tokenIds, tokenURIs]
    }

    const newCalLoveIsInTheAir = () => {
      let tokenIds = []
      let tokenURIs = []
      const initData = data[15]
      let loveIsInTheAirTokens = []
      for(let i = 8; i < 13; i++) {
        loveIsInTheAirTokens.push(initData[i])
      }
      loveIsInTheAirTokens.map((value, index) => {
        if(value !== 0) {
          for(let i = 0; i < value; i++) {
            tokenURIs.push(loveIsInTheAirURI[index])
            tokenIds.push(parseInt(index + 1))
          }
        }
      })
      return [tokenIds, tokenURIs]
    }

    const newCalLar = () => {
      let tokenIds = []
      let tokenURIs = []
      const initData = data[16]
      if(initData !== 0) {
        for(let i = 17; i < 24; i++) {
          if(data[i] === address) {
            tokenURIs.push(larURI[i - 17])
            tokenIds.push(parseInt(i - 16))
          }
        }
      }
      return [tokenIds, tokenURIs]
    }

    const newCalKeys = () => {
      let tokenIds = []
      let tokenURIs = []
      const initData = data[15]
      let keysTokens = []
      for(let i = 6; i < 8; i++) {
        keysTokens.push(initData[i])
      }
      keysTokens.map((value, index) => {
        if(value !== 0) {
          for(let i = 0; i < value; i++) {
            tokenURIs.push(keysURI[index])
            tokenIds.push(parseInt(index + 1))
          }
        }
      })
      return [tokenIds, tokenURIs]
    }

    const makeOldCollection = () => {
      let oldCollection = []
      const [voyageIds, voyageURIs] = calVoyage()
      const [loveIsInTheAirIds, loveIsInTheAirURIs] = calLoveIsInTheAir()
      const [larIds, larURIs] = calLar()
      const [keysIds, keyURIs] = calKeys()
      if(voyageIds.length !== 0 ) {
        oldCollection.push({
          title: 'Voyage',
          tokenIds: voyageIds,
          tokenURIs: voyageURIs,
          approved: data[11],
        })
      }
      if(loveIsInTheAirIds.length !== 0) {
        oldCollection.push({
          title: 'Love Is In The Air',
          tokenIds: loveIsInTheAirIds,
          tokenURIs: loveIsInTheAirURIs,
          approved: data[12],
        })
      }
      if(larIds.length !== 0) {
        oldCollection.push({
          title: 'Lines and Ripples',
          tokenIds: larIds,
          tokenURIs: larURIs,
          approved: data[13],
        })
      }
      if(keysIds.length !== 0) {
        oldCollection.push({
          title: 'Key',
          tokenIds: keysIds,
          tokenURIs: keyURIs,
          approved: data[14],
        })
      }
      return oldCollection
    }

    const makeNewCollection = () => {
      let newCollection = []
      const [voyageIds, voyageURIs] = newCalVoyage()
      const [loveIsInTheAirIds, loveIsInTheAirURIs] = newCalLoveIsInTheAir()
      const [larIds, larURIs] = newCalLar()
      const [keysIds, keyURIs] = newCalKeys()
      if(voyageIds.length !== 0 ) {
        newCollection.push({
          title: 'Voyage',
          tokenIds: voyageIds,
          tokenURIs: voyageURIs,
        })
      }
      if(loveIsInTheAirIds.length !== 0) {
        newCollection.push({
          title: 'Love Is In The Air',
          tokenIds: loveIsInTheAirIds,
          tokenURIs: loveIsInTheAirURIs,
        })
      }
      if(larIds.length !== 0) {
        newCollection.push({
          title: 'Lines and Ripples',
          tokenIds: larIds,
          tokenURIs: larURIs,
        })
      }
      if(keysIds.length !== 0) {
        newCollection.push({
          title: 'Key',
          tokenIds: keysIds,
          tokenURIs: keyURIs,
        })
      }
      return newCollection
    }

    const makeCollectionAddress = () => {
      const collectionAddress = {
        voyage,
        loveIsInTheAir,
        lar,
        keys,
        ERC1155Wrapper,
        ERC721Wrapper
      }
      return collectionAddress
    }

    const fetch = () => {
      setOldCollection(makeOldCollection())
      setNewCollection(makeNewCollection())
      setCollectionAddress(makeCollectionAddress())
    }

    useEffect(() => {
      if(isConnected && verified) {
        fetch()
      }
    }, [isConnected, verified, data])

    return (
        <CollectionContext.Provider value={{ oldCollection, newCollection, collectionAddress, fetch, verified, setVerified, visitable, setVisitable }}>
            {children}
        </CollectionContext.Provider>
    )
}

export { CollectionContext, CreateCollection }