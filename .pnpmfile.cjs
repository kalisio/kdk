const path = require('path')
const kliFile = process.env.KLI_FILE || path.join(__dirname, '../development/workspaces/libs/kdk/dev/kdk-ekosystem.js')
const link = process.env.LINK
let workspace

function readPackageHook(kliFile) {
  return async function readPackage (pkg, context) {
    if (!link) return pkg

    if (!workspace) {
      const { Workspace } = await import('../kli/index.js')
      workspace = await Workspace.load(kliFile)
    }
    // Check which module the package belongs too (take care to application use case)
    const mod = workspace.modules.find(m => (m.package.name === pkg.name) || ((`${m.package.name}-api` === pkg.name) && m.options.application))
    if (!mod) return pkg
    context.log(`Linking dependencies for module ${mod.name}`)
    const dependencies = mod.options.dependencies || []
    for (const field of ['dependencies', 'devDependencies', 'optionalDependencies']) {
      if (!pkg[field]) continue
      dependencies.forEach(dependency => {
        if (dependency in pkg[field]) {
          // We either link with another module or a package
          const targetPackage = workspace.packageDirs[dependency]
          const targetModule = workspace.modules.find(m => m.package.name === dependency)
          let target = targetPackage || targetModule.dir
          // Relative, POSIX-style path so the lockfile is machine independent
          target = path.relative(mod.dir, target).split(path.sep).join('/')
          context.log(`Linking ${dependency} for ${pkg.name} → ${target}`)
          pkg[field][dependency] = `link:${target}`
        }
      })
    }

    return pkg
  }
}

module.exports = {
  readPackageHook,
  hooks: {
    readPackage: readPackageHook(kliFile),
    updateConfig (config) {
      // This avoids updating lock file with link entries
      if (link) config.useLockfile = false
      return config
    }
  }
}