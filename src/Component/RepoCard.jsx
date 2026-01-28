import React from 'react'

const RepoCard = ({name, url, desc, language}) => {
  return (
    <div className='card'>
        <a href={url}><h2>{name}</h2></a>
        <p>{desc === null? "Null": desc }</p>
        <p>{language}</p>
    </div>
  )
}

export default RepoCard