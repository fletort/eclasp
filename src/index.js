import { program } from 'commander'
import { push, pull } from './push-pull.js'

program.name('eclasp').description('Extended Command Line Apps Script Projects')

program
  .command('push')
  .description('Update the remote project managing local specific code')
  .option('-f, --force', 'Forcibly overwrites the remote manifest.')
  .action(options => push(options))

program
  .command('pull')
  .description('Fetch a remote project managing local specific code')
  .option(
    '--versionNumber <version>',
    'The version number of the project to retrieve.'
  )
  .action(options => pull(options))

program.parse(process.argv)
