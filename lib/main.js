var fs = require('fs');
var path = require('path');

(function() {
    var tsTempFile = null;
    ['TMPDIR', 'TMP', 'TEMP'].forEach(function(td) {
        if (!tsTempFile && process.env[td])
            tsTempFile = process.env[td];
    });
    tsTempFile = path.join((tsTempFile || "/tmp"), "typescript-require-" + Date.now() + ".js");

    // get the installed typescript module.
    var typescriptmodulefile = require.resolve("typescript");
    var location = path.dirname(typescriptmodulefile);

    var contents = [
        "(function() {",
        fs.readFileSync(typescriptmodulefile, "utf8"),
        "module.exports = TypeScript;",
        "}).call({});"
    ].join("");
    fs.writeFileSync(tsTempFile, contents, "utf8");

    var TypeScript = module.exports.TypeScript = require(tsTempFile);
    TypeScript.moduleGenTarget = TypeScript.ModuleGenTarget.Synchronous;

    fs.unlinkSync(tsTempFile);

    module.exports._libdPath = require.resolve(location + '/lib.d.ts');
})();