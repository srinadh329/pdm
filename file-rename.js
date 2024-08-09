var fs = require('fs');
var path = require('path');
var replaceFile = require('replace-in-file');
var buildPath = path.join(__dirname, './dist/product-management/');
var indexPath = buildPath + '/' + 'index.html';
fs.readdir(buildPath, (err, files) => {
	files.forEach(file => {
		if (file.match(/^(es2015-polyfills|main|polyfills|runtime|scripts|styles)+([a-z0-9.\-])*(js|css)$/g)) {
			console.log('Current Filename:',file); 
			const currentPath = file;
			const changePath = file + '.gz';
			changeIndex(currentPath, changePath); 
		}
	});
});

function changeIndex(currentfilename, changedfilename) {

	const options = {
		files: indexPath,
		from: '"'+ currentfilename + '"',
		to: '"'+ changedfilename + '"',
		allowEmptyPaths: false,
	};

	try {
		let changedFiles = replaceFile.sync(options);
		if (changedFiles == 0) {
			console.log("File updated failed");
		} else if (changedFiles[0].hasChanged === false) {
			console.log("File already updated");
		}
		console.log('Changed Filename:',changedfilename);
		// process.exit(1);
	}
	catch (error) {
		console.error('Error occurred:', error);
		throw error
	}
}