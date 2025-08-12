#!/usr/bin/env node

const { execSync } = require('child_process')
const path = require('path')

console.log('🚀 开始更新贡献者数据...')

try {
  // 运行贡献者收集脚本
  console.log('📊 正在收集贡献者数据...')
  execSync('node scripts/collect-contributors.js', { 
    stdio: 'inherit',
    cwd: process.cwd()
  })
  
  console.log('✅ 贡献者数据更新完成！')
  console.log('📁 数据已保存到 contributors/ 目录')
} catch (error) {
  console.error('❌ 更新失败:', error.message)
  process.exit(1)
} 