const nativeMessage = require('chrome-native-messaging');
const spawn = require('cross-spawn');

/*
(async function test() {
  console.log(await handleMessage({command: 'list-entries'}));
})();
*/

process.stdin
  .pipe(new nativeMessage.Input())
  .pipe(new nativeMessage.Transform(async function (msg, push, done) {
    const reply = await handleMessage(msg);
    push(reply);
    done();
  }))
  .pipe(new nativeMessage.Output())
  .pipe(process.stdout)
;

/**
 * @typedef {{stdout: string[], stderr: string[], returnCode: number}} reply
 */

/**
 * @param {string[]} stdout
 * @param {string[]} stderr
 * @param {number} returnCode
 * @return reply
 */
function buildReply({stdout, stderr, returnCode}) {
  return {stdout, stderr, returnCode};
}


/**
 * @param {string} command
 * @param {string[]} args
 * @return {Promise.<reply>}
 */
async function handleMessage({command, args}) {
  args = args || [];

  switch (command) {
    case 'ls':
    case 'list':
      if (args.length > 1) {
        return buildReply({stdout: [], stderr: ['wrong argument count'], returnCode: -1});
      }
      return await executePassCommand('show', args);
    case 'show':
      if (args.length !== 1) {
        return buildReply({stdout: [], stderr: ['wrong argument count'], returnCode: -1});
      }
      return await executePassCommand('show', args);
    case 'version':
      return await executePassCommand('version', args);
    case 'list-entries':
      return await listEntries();
    default:
      return buildReply({stdout: [], stderr: ['unknown command'], returnCode: -1});
  }
}

/**
 * @param command
 * @param args
 * @return {Promise.<reply>}
 */
function executePassCommand(command, args) {
  const BASH_COLOR_CODES = /\u001b\[[0-9;]*m/g;
  return new Promise((resolve) => {
    try {
      const pass = spawn('pass', [command, ...args], {
        env: Object.assign(
          {},
          process.env,
          {
            TREE_CHARSET: "windows-1251", // see https://github.com/passff/passff/issues/59
          }
        ),
      });
      let stdout = [], stderr = [];

      pass.stdout.on('data', (data) => stdout.push(data));
      pass.stderr.on('data', (data) => stderr.push(data));
      pass.on('close', (returnCode) => resolve(buildReply({
        returnCode,
        stdout: stdout.join('').replace(BASH_COLOR_CODES, '').trim().split("\n"),
        stderr: stderr.join('').replace(BASH_COLOR_CODES, '').trim().split("\n"),
      })));
    } catch (err) {
      resolve(buildReply({stdout: [], stderr: ['error executing pass', err.message], returnCode: -1}));
    }
  });
}

async function listEntries() {
  return new Promise((resolve) => {

    try {
      const pass = spawn('find', [
        '-L',
        '.',
        '-not', '-path', '\\*/.\\*',
        '-type', 'd',
        '-or',
        '-not', '-path', '\\*/.\\*',
        '-type', 'f', '-iname', '\\*.gpg',
      ], {
        cwd: process.env.PASSWORD_STORE_DIR || `${process.env.HOME || '~'}/.password-store`,
      });
      let stdout = [], stderr = [];

      pass.stdout.on('data', (data) => stdout.push(data));
      pass.stderr.on('data', (data) => stderr.push(data));
      pass.on('close', (returnCode) => resolve(buildReply({
        returnCode,
        stdout: stdout.join('').split("\n").map(
          line => (line.endsWith('.gpg') ? line : `${line}/`).replace(/^\.\//, '').replace(/\.gpg$/, '').trim()
        ).sort(),
        stderr: stderr.join('').trim().split("\n"),
      })));
    } catch (err) {
      resolve(buildReply({stdout: [], stderr: ['error executing pass', err.message], returnCode: -1}));
    }
  });
}
