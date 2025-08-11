import type { Component } from 'vue'
import VPDemo from './components/vp-demo.vue'
import VPSemantic from './components/vp-semantic.vue'
import DocContributors from './components/DocContributors.vue'

export const globals: [string, Component][] = [
  ['Demo', VPDemo],
  ['VpSemantic', VPSemantic],
  ['DocContributors', DocContributors],
]
