const fs = require('fs');
const archiver = require('archiver');

// 指定要压缩的文件夹路径和输出 ZIP 文件的路径
const sourceDir = './out';
const outputZipPath = './AoWalletChromeExtension.zip';

// 创建一个可写流，用于写入 ZIP 文件
const output = fs.createWriteStream(outputZipPath);
const archive = archiver('zip', {
    zlib: { level: 9 } // 设置压缩级别
});

// 监听 'close' 事件，表示压缩完成
output.on('close', () => {
    console.log(`${archive.pointer()} total bytes`);
    console.log('Archiving completed successfully');
});

// 监听 'error' 事件，处理错误
archive.on('error', (err) => {
    throw err;
});

// 将输出流连接到归档器
archive.pipe(output);

// 添加指定文件夹中的所有文件和文件夹到归档器
archive.directory(sourceDir, false);

// 完成归档
archive.finalize();
