import React from 'react'
import SearchIcon from '../Icons/SearchIcon'
import styles from './search-field.module.css'

const SearchField = () => {
  return (
    <button className={styles.searchField}>
      <span className={styles.searchFieldText}>Hledat</span>
      <div className={styles.searchFieldIcon}>
        <SearchIcon />
      </div>
    </button>
  )
}

export default SearchField
