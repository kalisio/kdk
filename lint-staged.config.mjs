import path from 'node:path'

// Lint only the staged files that live in core/ or map/
export default {
  '*.{js,cjs,mjs,vue}': (files) => {
    const staged = files
      .map(f => path.relative(process.cwd(), f))
      .filter(f => /^(core|map)\//.test(f))
    if (staged.length === 0) return []
    return `standard --fix ${staged.join(' ')}`
  }
}
