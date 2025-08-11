#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// 支持fetch polyfill
if (typeof fetch === 'undefined') {
  global.fetch = require('node-fetch')
}

class ComponentContributorsCollector {
  constructor(owner, repo, outputDir = './contributors') {
    this.owner = owner
    this.repo = repo
    this.outputDir = outputDir
    this.ensureOutputDir()
  }

  ensureOutputDir() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true })
    }
  }

  // 定义主要的组件目录
  getComponentDirectories() {
    const componentDirs = [
      { name: 'bubble', path: 'src/bubble' },
      { name: 'sender', path: 'src/sender' },
      { name: 'welcome', path: 'src/welcome' },
      { name: 'attachments', path: 'src/attachments' },
      { name: 'conversations', path: 'src/conversations' },
      { name: 'prompts', path: 'src/prompts' },
      { name: 'suggestion', path: 'src/suggestion' },
      { name: 'thought-chain', path: 'src/thought-chain' },
      { name: 'x-provider', path: 'src/x-provider' },
      { name: 'x-request', path: 'src/x-request' },
      { name: 'x-stream', path: 'src/x-stream' },
      { name: 'use-x-agent', path: 'src/use-x-agent' },
      { name: 'use-x-chat', path: 'src/use-x-chat' }
    ]

    // 过滤出实际存在的目录
    return componentDirs.filter(comp => fs.existsSync(comp.path))
  }

  // 获取指定目录的所有文件
  getDirectoryFiles(dirPath) {
    try {
      const command = `find ${dirPath} -name "*.vue" -o -name "*.ts" -o -name "*.tsx" | head -20`
      const files = execSync(command, { encoding: 'utf8' }).trim().split('\n').filter(Boolean)
      return files
    } catch (error) {
      console.warn(`Could not get files for ${dirPath}:`, error.message)
      return []
    }
  }

  // 为单个组件目录收集贡献者
  getComponentContributors(componentDir) {
    console.log(`\n📁 Analyzing component: ${componentDir.name}`)
    
    try {
      // 使用 git log 直接分析整个目录
      const gitCommand = `git log --pretty=format:"%ae|%an|%cn" --follow -- "${componentDir.path}"`
      
      let gitLogOutput
      try {
        gitLogOutput = execSync(gitCommand, { encoding: 'utf8', cwd: process.cwd() })
      } catch (e) {
        // 尝试不使用 --follow
        const fallbackCommand = `git log --pretty=format:"%ae|%an" -- "${componentDir.path}"`
        try {
          gitLogOutput = execSync(fallbackCommand, { encoding: 'utf8', cwd: process.cwd() })
        } catch (e2) {
          console.warn(`Could not get git log for ${componentDir.path}`)
          return null
        }
      }

      if (!gitLogOutput.trim()) {
        console.warn(`No git history found for ${componentDir.path}`)
        return null
      }

      // 解析贡献者数据
      const authorData = gitLogOutput.split('\n').filter(Boolean)
      const authorStats = {}

      authorData.forEach(line => {
        const parts = line.split('|')
        const email = parts[0]
        const authorName = parts[1]
        const committerName = parts[2] || authorName

        const name = authorName || committerName
        if (email && name) {
          const key = email.toLowerCase()
          if (!authorStats[key]) {
            authorStats[key] = { 
              name: name.trim(), 
              email: email.trim(),
              commits: 0 
            }
          }
          authorStats[key].commits++
        }
      })

      // 转换为标准格式
      const contributors = Object.entries(authorStats)
        .map(([email, data]) => ({
          login: data.name,
          id: this.hashCode(email),
          avatar_url: `https://github.com/${data.name}.png`,
          html_url: `https://github.com/${data.name}`,
          contributions: data.commits,
          type: 'User',
          email: data.email
        }))
        .sort((a, b) => b.contributions - a.contributions)
        .slice(0, 50) // 每个组件最多50位贡献者

      if (contributors.length > 0) {
        console.log(`  ✅ Found ${contributors.length} contributors for ${componentDir.name}`)
        return {
          component: componentDir.name,
          path: componentDir.path,
          contributors: contributors,
          totalContributions: contributors.reduce((sum, c) => sum + c.contributions, 0)
        }
      } else {
        console.warn(`  ❌ No contributors found for ${componentDir.name}`)
        return null
      }

    } catch (error) {
      console.error(`Error analyzing ${componentDir.name}:`, error.message)
      return null
    }
  }

  // 获取GitHub总体贡献者
  async fetchGitHubContributors() {
    console.log('🔄 Fetching contributors from GitHub API...')
    
    try {
      const url = `https://api.github.com/repos/${this.owner}/${this.repo}/contributors`
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`GitHub API responded with ${response.status}`)
      }
      
      const contributors = await response.json()
      console.log(`✅ Found ${contributors.length} total contributors from GitHub`)
      return contributors
    } catch (error) {
      console.warn('GitHub API failed, using mock data:', error.message)
      return this.getMockContributors()
    }
  }

  // Mock数据
  getMockContributors() {
    return [
      {
        login: 'wzc520pyfm',
        id: 69044080,
        avatar_url: 'https://avatars.githubusercontent.com/u/69044080?v=4',
        html_url: 'https://github.com/wzc520pyfm',
        contributions: 127,
        type: 'User'
      },
      {
        login: 'contributor-1',
        id: 2,
        avatar_url: 'https://github.com/github.png',
        html_url: 'https://github.com/contributor-1',
        contributions: 45,
        type: 'User'
      }
    ]
  }

  // 简单的字符串哈希函数
  hashCode(str) {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // 转换为32位整数
    }
    return Math.abs(hash)
  }

  // 主收集函数
  async collect() {
    console.log(`🚀 Collecting contributors for ${this.owner}/${this.repo}...`)
    console.log('📋 Using component-directory-based collection strategy\n')

    try {
      // 1. 获取组件目录
      const componentDirs = this.getComponentDirectories()
      console.log(`📁 Found ${componentDirs.length} component directories:`)
      componentDirs.forEach(comp => console.log(`  - ${comp.name} (${comp.path})`))

      // 2. 获取GitHub总体贡献者
      const allContributors = await this.fetchGitHubContributors()

      // 3. 按组件目录收集贡献者
      const componentContributors = []
      
      for (const componentDir of componentDirs) {
        const componentData = this.getComponentContributors(componentDir)
        if (componentData) {
          componentContributors.push(componentData)
        }
      }

      console.log(`\n📊 Collection Summary:`)
      console.log(`  - Total components analyzed: ${componentContributors.length}`)
      console.log(`  - Total GitHub contributors: ${allContributors.length}`)

      // 4. 生成最终数据结构
      const finalData = {
        total: allContributors.length,
        repository: {
          owner: this.owner,
          repo: this.repo,
          url: `https://github.com/${this.owner}/${this.repo}`
        },
        lastUpdated: new Date().toISOString(),
        contributors: allContributors,
        componentContributors: componentContributors, // 新的结构
        // 保持向后兼容
        fileContributors: this.convertToFileContributors(componentContributors)
      }

      // 5. 保存数据
      await this.saveData(finalData)
      
      console.log('\n✅ Contributors collection completed successfully!')
      return finalData

    } catch (error) {
      console.error('❌ Error during collection:', error)
      throw error
    }
  }

  // 转换为文件级别的贡献者（向后兼容）
  convertToFileContributors(componentContributors) {
    const fileContributors = []
    
    componentContributors.forEach(comp => {
      // 为每个组件创建一个主文件条目
      const mainFile = `${comp.path}/${this.getMainFileName(comp.component)}`
      fileContributors.push({
        file: mainFile,
        contributors: comp.contributors
      })
    })
    
    return fileContributors
  }

  // 获取组件的主文件名
  getMainFileName(componentName) {
    const fileNameMap = {
      'bubble': 'Bubble.vue',
      'sender': 'Sender.vue',
      'welcome': 'Welcome.vue',
      'attachments': 'Attachments.vue',
      'conversations': 'Conversations.vue',
      'prompts': 'Prompts.vue',
      'suggestion': 'Suggestion.vue',
      'thought-chain': 'ThoughtChain.vue',
      'x-provider': 'index.vue',
      'x-request': 'x-request.ts',
      'x-stream': 'x-stream.ts',
      'use-x-agent': 'use-x-agent.ts',
      'use-x-chat': 'use-x-chat.ts'
    }
    
    return fileNameMap[componentName] || 'index.vue'
  }

  // 保存数据
  async saveData(data) {
    try {
      // 保存 JSON 文件
      const jsonPath = path.join(this.outputDir, 'contributors.json')
      fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2))

      // 保存 TypeScript 文件
      const tsContent = this.generateTSFile(data)
      const tsPath = path.join(this.outputDir, 'data.ts')
      fs.writeFileSync(tsPath, tsContent)

      console.log('\n💾 Contributors data saved to:')
      console.log(`  - ${jsonPath}`)
      console.log(`  - ${tsPath}`)

    } catch (error) {
      console.error('Error saving data:', error)
      throw error
    }
  }

  // 生成TypeScript文件内容
  generateTSFile(data) {
    return `// This file is auto-generated. Do not edit manually.
// Last updated: ${data.lastUpdated}

export interface Contributor {
  login: string
  id: number
  node_id?: string
  avatar_url: string
  gravatar_id?: string
  url?: string
  html_url: string
  followers_url?: string
  following_url?: string
  gists_url?: string
  starred_url?: string
  subscriptions_url?: string
  organizations_url?: string
  repos_url?: string
  events_url?: string
  received_events_url?: string
  type: string
  site_admin?: boolean
  contributions: number
  email?: string
}

export interface ComponentContributor {
  component: string
  path: string
  contributors: Contributor[]
  totalContributions: number
}

export interface FileContributor {
  file: string
  contributors: Contributor[]
}

export interface ContributorsData {
  total: number
  repository: {
    owner: string
    repo: string
    url: string
  }
  lastUpdated: string
  contributors: Contributor[]
  componentContributors: ComponentContributor[]
  fileContributors: FileContributor[]
}

export const contributorsData: ContributorsData = ${JSON.stringify(data, null, 2)}
`
  }
}

// 主函数
async function main() {
  const collector = new ComponentContributorsCollector('wzc520pyfm', 'ant-design-x-vue')
  await collector.collect()
}

if (require.main === module) {
  main().catch(console.error)
}

module.exports = { ComponentContributorsCollector } 