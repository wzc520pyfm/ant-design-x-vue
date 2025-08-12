#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

// 组件文档目录
const docsDir = path.join(__dirname, '../docs/component')

// 需要添加贡献者部分的组件列表
const components = [
  { file: 'attachments.md', name: 'attachments' },
  { file: 'conversations.md', name: 'conversations' },
  { file: 'prompts.md', name: 'prompts' },
  { file: 'suggestion.md', name: 'suggestion' },
  { file: 'thought-chain.md', name: 'thought-chain' },
  { file: 'use-x-agent.md', name: 'use-x-agent' },
  { file: 'use-x-chat.md', name: 'use-x-chat' },
  { file: 'x-provider.md', name: 'x-provider' },
  { file: 'x-request.md', name: 'x-request' },
  { file: 'x-stream.md', name: 'x-stream' }
]

// 贡献者部分的模板
const contributorsTemplate = (componentName) => `
## 贡献者

<doc-contributors component-name="${componentName}" :max-count="50" :show-view-all="true" />`

// 处理单个文件
function processFile(filename, componentName) {
  const filePath = path.join(docsDir, filename)
  
  try {
    // 读取文件内容
    let content = fs.readFileSync(filePath, 'utf8')
    
    // 检查是否已经有贡献者部分
    if (content.includes('## 贡献者') || content.includes('<doc-contributors')) {
      console.log(`⏭️  ${filename} already has contributors section`)
      return false
    }
    
    // 在文件末尾添加贡献者部分
    content = content.trimEnd() + contributorsTemplate(componentName) + '\n'
    
    // 写回文件
    fs.writeFileSync(filePath, content, 'utf8')
    console.log(`✅ Added contributors to ${filename}`)
    return true
    
  } catch (error) {
    console.error(`❌ Error processing ${filename}:`, error.message)
    return false
  }
}

// 主函数
function addContributorsToAllDocs() {
  console.log('🚀 Adding contributors section to component docs...\n')
  
  let processedCount = 0
  let skippedCount = 0
  
  components.forEach(component => {
    const success = processFile(component.file, component.name)
    if (success) {
      processedCount++
    } else {
      skippedCount++
    }
  })
  
  console.log('\n📊 Summary:')
  console.log(`✅ Processed: ${processedCount} files`)
  console.log(`⏭️  Skipped: ${skippedCount} files`)
  console.log(`📁 Total: ${components.length} files`)
  
  if (processedCount > 0) {
    console.log('\n🎉 Contributors sections added successfully!')
    console.log('💡 Remember to register the doc-contributors component in your VitePress theme.')
  }
}

// 运行脚本
if (require.main === module) {
  addContributorsToAllDocs()
}

module.exports = { addContributorsToAllDocs } 