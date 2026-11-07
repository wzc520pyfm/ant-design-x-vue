#!/usr/bin/env node
'use strict'

const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')

const pkg = require('../package.json')
const PKG_ROOT = path.resolve(__dirname, '..')

function printHelp() {
  console.log(`@ant-design-x-vue/x-skill/${pkg.version}

Install Vue Agent skills into Cursor and/or Claude Code.
This copies skill folders from this package; it does not download @ant-design/x-skill.

Usage:
  npx @ant-design-x-vue/x-skill [options]
  x-skill-vue [options]

Options:
  --cursor            Install into .cursor/skills (project) or ~/.cursor/skills (--global)
  --claude            Install into .claude/skills (project) or ~/.claude/skills (--global)
  --global, -g        Install into the user home directories
  --lang <en|zh>      Skill locale (default: zh when LANG starts with zh, otherwise en)
  --force             Overwrite existing skill folders with the same name
  --help, -h          Show this help
  --version, -v, -V   Show installer version

If neither --cursor nor --claude is passed, both targets are installed.
`)
}

function parseArgs(argv) {
  const opts = {
    help: false,
    version: false,
    lang: null,
    global: false,
    force: false,
    targets: [],
  }

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    if (arg === '-h' || arg === '--help') {
      opts.help = true
    }
    else if (arg === '-v' || arg === '-V' || arg === '--version') {
      opts.version = true
    }
    else if (arg === '-g' || arg === '--global') {
      opts.global = true
    }
    else if (arg === '--force') {
      opts.force = true
    }
    else if (arg === '--cursor') {
      opts.targets.push('cursor')
    }
    else if (arg === '--claude') {
      opts.targets.push('claude')
    }
    else if (arg === '--lang' || arg === '-l') {
      opts.lang = argv[i + 1]
      i += 1
    }
    else if (arg.startsWith('--lang=')) {
      opts.lang = arg.slice('--lang='.length)
    }
    else {
      throw new Error(`Unknown option: ${arg}`)
    }
  }

  return opts
}

function detectLang(explicit) {
  if (explicit == null || explicit === '') {
    const lang = process.env.LC_ALL || process.env.LANG || ''
    return /^zh/i.test(lang) ? 'zh' : 'en'
  }
  if (explicit === 'en' || explicit === 'zh')
    return explicit
  throw new Error(`Invalid --lang value: ${explicit} (expected en or zh)`)
}

function skillSourceDir(lang) {
  const dirName = lang === 'zh' ? 'skills-zh' : 'skills'
  const src = path.join(PKG_ROOT, dirName)
  if (!fs.existsSync(src))
    throw new Error(`Skill directory not found: ${src}`)
  return src
}

function listSkillFolders(src) {
  return fs.readdirSync(src, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && !entry.name.startsWith('.'))
    .map(entry => entry.name)
    .sort()
}

function copySkill(srcSkill, destSkill, force) {
  if (fs.existsSync(destSkill)) {
    if (!force) {
      return 'skipped'
    }
    fs.rmSync(destSkill, { recursive: true, force: true })
  }
  fs.cpSync(srcSkill, destSkill, { recursive: true })
  return 'copied'
}

function resolveTargets(opts) {
  const names = opts.targets.length ? [...new Set(opts.targets)] : ['cursor', 'claude']
  const home = os.homedir()
  const cwd = process.cwd()
  return names.map((name) => {
    if (name === 'cursor') {
      return {
        name,
        dest: opts.global ? path.join(home, '.cursor', 'skills') : path.join(cwd, '.cursor', 'skills'),
      }
    }
    return {
      name,
      dest: opts.global ? path.join(home, '.claude', 'skills') : path.join(cwd, '.claude', 'skills'),
    }
  })
}

function main() {
  const opts = parseArgs(process.argv.slice(2))
  if (opts.help) {
    printHelp()
    return
  }
  if (opts.version) {
    console.log(pkg.version)
    return
  }

  const lang = detectLang(opts.lang)
  const src = skillSourceDir(lang)
  const skills = listSkillFolders(src)
  if (!skills.length)
    throw new Error(`No skill folders found in ${src}`)

  const targets = resolveTargets(opts)
  let copied = 0
  let skipped = 0

  for (const target of targets) {
    fs.mkdirSync(target.dest, { recursive: true })
    console.log(`Installing ${lang} skills into ${target.dest}`)
    for (const skill of skills) {
      const result = copySkill(path.join(src, skill), path.join(target.dest, skill), opts.force)
      if (result === 'copied') {
        copied += 1
        console.log(`  + ${skill}`)
      }
      else {
        skipped += 1
        console.log(`  ~ ${skill} (exists, pass --force to overwrite)`)
      }
    }
  }

  console.log(`Done. copied=${copied} skipped=${skipped}`)
}

try {
  main()
}
catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
}
