import Collection from './_Collection'

export default function CollectionList(props) {

  const collectionList = []
  const collection = props.collection

  if(collection) {
    const collectionKeys = Object.keys(collection)
    const numberOfCollection = collectionKeys.length
    for(let i = 0; i < numberOfCollection; i++) {
      collectionList.push(<Collection key={i} num={i} title={collection[collectionKeys[i]].title} tokenIds={collection[collectionKeys[i]].tokenIds} tokenURIs={collection[collectionKeys[i]].tokenURIs} update={props.update} type={props.type} />)
    }
  }

  return collectionList
}