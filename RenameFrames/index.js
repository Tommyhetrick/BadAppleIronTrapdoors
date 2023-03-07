const fs = require('fs');

let ind = 0;

fs.readdirSync(".").forEach(file => {
    if (file.indexOf('.png') > -1) {
        fs.rename(file, ind.toString().padStart(4,"0") + '.png', err => console.log(err));
        ind++;
    }
});