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
    if (options.branches && !options.branches.includes(branch)) {
      continue
    }
    console.log(`Preparing module ${module}`)
    if (program.clone) {
      const organization = program.organization
      try {
        await runCommand(`git clone https://github.com/${organization}/${module}.git`)
      } catch (error) {
        console.log(error)
      }
    }
    const cwd = process.cwd()
    shell.cd(path.join(cwd, `${module}`))
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
      console.log(`Linking module ${module}`)
      options = workspace[module]
      const cwd = process.cwd()
      shell.cd(path.join(cwd, `${module}`))
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

program
  .version(require('./package.json').version)
  .usage('<workspacefile> [options]')
  .option('-o, --organization [organization]', 'GitHub organization owing the project', 'kalisio')
  .option('-d, --debug', 'Verbose output for debugging')
  .option('-c, --clone', 'Clone git repositories')
  .option('-i, --install', 'Perform yarn install')
  .option('-l, --link', 'Perform yarn link')
  .option('-ul, --unlink', 'Perform yarn unlink')
  .option('-b, --branch [branch]', 'Switch git branch')
  .parse(process.argv)

let workspace = program.args[0]
// When relative path is given assume it relative to working dir
if (!path.isAbsolute(workspace)) workspace = path.join(process.cwd(), workspace)
// Read workspace file
workspace = require(workspace)
run(workspace, program.branch || 'master')


