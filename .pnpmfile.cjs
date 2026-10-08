const path = require('path')
const fs = require('fs')
const kliFile = process.env.KLI_FILE || path.join(__dirname, '../development/workspaces/libs/kdk/dev/kdk-ekosystem.js')
const link = process.env.LINK
let workspace

async function loadWorkspace (kliFile) {
  if (!workspace) {
    // kli files usually locate the modules using this variable, when not defined (e.g. CI)
    // we assume all the modules are sibling directories as we already do for kli
    if (!process.env.KALISIO_DEVELOPMENT_DIR) process.env.KALISIO_DEVELOPMENT_DIR = path.resolve(__dirname, '..')
    const { Workspace } = await import('../kli/index.js')
    workspace = await Workspace.load(kliFile)
  }
  return workspace
}

function readPackageHook (kliFile) {
  return async function readPackage (pkg, context) {
    if (!link) return pkg

    const workspace = await loadWorkspace(kliFile)
    // Check which module the package belongs too (take care to application use case)
    const mod = workspace.modules.find(m => (m.package.name === pkg.name) || ((`${m.package.name}-api` === pkg.name) && m.options.application))
    if (!mod) return pkg
    context.log(`Linking dependencies for module ${mod.name}`)
    // The API of an application lives in a subdirectory of the module
    const isApi = (mod.package.name !== pkg.name)
    const pkgDir = (isApi ? path.join(mod.dir, 'api') : mod.dir)
    const dependencies = mod.options.dependencies || []
    for (const field of ['dependencies', 'devDependencies', 'optionalDependencies']) {
      if (!pkg[field]) continue
      dependencies.forEach(dependency => {
        if (dependency in pkg[field]) {
          // We either link with another module or a package
          const targetPackage = workspace.packageDirs[dependency]
          const targetModule = workspace.modules.find(m => m.package.name === dependency)
          let target = targetPackage || (targetModule && targetModule.dir)
          if (!target || !fs.existsSync(target)) {
            throw new Error(`Cannot link ${dependency} for ${pkg.name}: no module or package providing it found in workspace ${kliFile}`)
          }
          // Relative, POSIX-style path so the lockfile is machine independent
          target = path.relative(pkgDir, target).split(path.sep).join('/')
          context.log(`Linking ${dependency} for ${pkg.name} → ${target}`)
          pkg[field][dependency] = `link:${target}`
        }
      })
    }

    return pkg
  }
}

function updateConfig (config) {
  // This avoids updating lock file with link entries
  if (link) config.useLockfile = false
  return config
}

// Hooks to be used by modules relying on this file but with their own kli file
function createHooks (kliFile) {
  return {
    readPackage: readPackageHook(kliFile),
    updateConfig
  }
}

module.exports = {
  readPackageHook,
  createHooks,
  hooks: createHooks(kliFile)
}
