import {getCurrentInstance } from 'vue'

let globalId = 0

export default function useId(prefix = 'id') {
  const vm = getCurrentInstance()
  const uid = vm?.uid || globalId++
  return `${prefix}-${uid}`
}
