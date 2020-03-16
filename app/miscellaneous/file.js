const fs = require('fs');


module.exports = {
    readFile: (path, fileName) => {
        return new Promise((resolve, reject) => {
        fs.readFile(path + fileName, 'utf8', (err, content) => {
            if(err) {
                reject(err);
            }
            resolve(JSON.parse(content));
            });
         });
     }
     /*,readFileAsync: (path, fileName) => {
         let error, data
         try {
             data= fs.readFileSync(path + fileName)
         }
     }
     }*/
}