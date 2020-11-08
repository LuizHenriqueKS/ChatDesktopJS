const { spawn } = require('child_process');
const child = spawn('cmd.exe');

child.stdout.on('data', chunk => {
    process.stdout.write(chunk.toString());
    if (chunk.toString().indexOf('exit') != -1) {
        process.exit();
    }
});
child.stderr.on('data', chunk => process.stderr.write(chunk.toString()));

child.stdin.write('start /separate cmd.exe /k npm run electron:serve\r\n');
child.stdin.write('exit\r\n');

child.on('close', () => process.exit());