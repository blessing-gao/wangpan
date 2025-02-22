import { defineStore } from 'pinia'
const useSearchStore = defineStore('search', {
  state: () => {
    return {
      searchInput: '',
    }
  },
  actions: {
    setSearchInput(input) {
      this.searchInput = input
    },
  },
})

export default useSearchStore
