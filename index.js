#!/usr/bin/env node

const program = require('commander')
const _ = require('lodash')
const path = require('path')
const makeDebug = require('debug')
const shell = require('shelljs')
const util = require('util')

const debug = makeDebug('kdk')

const exec = util.promisify(require('child_process').exec)
const wait = util.promisify(setTimeout)

async function runCommand (command) {
  if (program.debug) debug('Running command', command)
  const { stdout, stderr } = await exec(command)
  console.log(stdout)
  console.error(stderr)
  await wait(2000) // Wait a couple of seconds to ensure files are closed
}

async function run (workspace, branch) {
  console.log('Preparing workspace on branch', branch)
  // Process modules
  const modules = Object.keys(workspace)
  for (let i = 0; i < modules.length; i++) {
    const module = modules[i]
    options = workspace[module]
    if (program.modules && !program.modules.includes(module)) {
      continue
    }
    if (options.branches && !options.branches.includes(branch)) {
      continue
    }
    console.log(`Preparing module ${module}`)
    if (program.clone || program.pull) {
      const cwd = process.cwd()
      // Clone path can be relative to CWD when managing code for different organizations (eg kalisio/weacast)
      // CWD is the root path for the "main" organization usually owing the project
      if (options.path) shell.cd(path.join(cwd, options.path))
      const organization = options.organization || program.organization
      try {
        if (program.clone) await runCommand(`git clone https://github.com/${organization}/${module}.git`)
        else {
          shell.cd(`${module}`)
          await runCommand(`git pull`)
        }
      } catch (error) {
        console.log(error)
      }
      shell.cd(cwd)
    }
    const cwd = process.cwd()
    // Working path for module can be relative to CWD when managing code for different organizations (eg kalisio/weacast)
    // CWD is the root path for the "main" organization usually owing the project
    shell.cd(options.path ? path.join(cwd, options.path, `${module}`) : path.join(cwd, `${module}`))
    try {
      if (program.branch) {
        await runCommand(`git fetch origin ${branch}:${branch}`)
        await runCommand(`git checkout ${branch}`)
      }
      if (program.install) {
        await runCommand('yarn install')
      }
      if (!options.application && program.link) {
        await runCommand('yarn link')
      }
      if (options.application) {
        shell.cd('api')
        try {
          if (program.install) {
            await runCommand('yarn install')
          }
        } catch (error) {
          console.log(error)
        }
        shell.cd('..')
      }
    } catch (error) {
      console.log(error)
    }
    shell.cd(cwd)
  }
  // Now everything is installed process with links
  if (program.link || program.unlink) {
    for (let i = 0; i < modules.length; i++) {
      const module = modules[i]
      if (options.branches && !options.branches.includes(branch)) {
        continue
      }
      console.log(program.link ? `Linking module ${module}` : `Unlinking module ${module}`)
      options = workspace[module]
      const cwd = process.cwd()
      shell.cd(options.path ? path.join(cwd, options.path, `${module}`) : path.join(cwd, `${module}`))
      try {
        for (let i = 0; i < options.dependencies.length; i++) {
          const dependency = options.dependencies[i]
          await runCommand(program.link ? `yarn link ${dependency}` : `yarn unlink ${dependency}`)
        }
        if (options.application) {
          shell.cd('api')
          try {
            for (let i = 0; i < options.dependencies.length; i++) {
              const dependency = options.dependencies[i]
              await runCommand(program.link ? `yarn link ${dependency}` : `yarn unlink ${dependency}`)
            }
          } catch (error) {
            console.log(error)
          }
          shell.cd('..')
        }
        shell.cd(cwd)
      } catch (error) {
        console.log(error)
      }
    }
  }
}

function commaSeparatedList(values) {
  return values.split(',')
}

program
  .version(require('./package.json').version)
  .usage('<workspacefile> [options]')
  .option('-o, --organization [organization]', 'GitHub organization owing the project', 'kalisio')
  .option('-d, --debug', 'Verbose output for debugging')
  .option('-c, --clone', 'Clone git repositories')
  .option('-p, --pull', 'Pull git repositories')
  .option('-i, --install', 'Perform yarn install')
  .option('-l, --link', 'Perform yarn link')
  .option('-ul, --unlink', 'Perform yarn unlink')
  .option('-b, --branch [branch]', 'Switch git branch')
  .option('-m, --modules [modules]', 'Comma separated list of modules from the workspace to apply command on', commaSeparatedList)
  .parse(process.argv)

let workspace = program.args[0]
// When relative path is given assume it relative to working dir
if (!path.isAbsolute(workspace)) workspace = path.join(process.cwd(), workspace)
// Read workspace file
workspace = require(workspace)
run(workspace, program.branch || 'master')


