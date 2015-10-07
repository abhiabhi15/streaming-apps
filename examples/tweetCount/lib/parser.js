//console.dir(process)
//console.dir(process.argv)

function getNames(){
	return process.argv.slice(2);
}

module.exports.names = getNames;


