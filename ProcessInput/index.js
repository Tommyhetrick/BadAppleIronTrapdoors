const sharp = require('sharp');
const fs = require('fs');

let origFrameSize = [480, 360];

let frameSize = [origFrameSize[0]/2, origFrameSize[1]/2];

const go = async () => {

    let lastImage = new Array(180000);

    lastImage.fill(2);

    let thumbOut = '';

    for (let i=1;i<=6572;i++) {

        console.log('Processing frame ' + i + '...');

        let name = i.toString().padStart(4, '0') + '.png';
        let data = await sharp('./inputs/'+name)
        .resize(frameSize[0],frameSize[1])
        .raw()
        .toBuffer()

        let thisImage = [];
        let frameOut = '';
        let frameSoundOut = '';
        
        for (var j=0;j<data.length;j+= 3) {
            let r = data[j];
            let g = data[j+1];
            let b = data[j+2];

            let avg = (r+g+b)/3;

            if (avg < 128) {
                thisImage.push(0);
            } else {
                thisImage.push(1);
            }
        }

        for (var j=0;j<thisImage.length;j++) {
            
            if (thisImage[j] !== lastImage[j]) {

                let x = j%frameSize[0];
                let z = Math.floor(j/frameSize[0]);
                let blockData = thisImage[j] === 0 ? '4' : '0';
                let soundType = thisImage[j] === 0 ? 'open' : 'close';

                frameOut += `setblock ${x} 56 ${z} iron_trapdoor ${blockData}\n`;
                frameSoundOut += `playsound block.iron_trapdoor.${soundType} master @a ${x} 56 ${z} 15\n`;
            }

            if (i === 1636) {
                let x = j%frameSize[0];
                let z = Math.floor(j/frameSize[0]);
                let blockData = thisImage[j] === 0 ? '4' : '0';
                thumbOut += `setblock ${x} 56 ${z} iron_trapdoor ${blockData}\n`;
            }
        }

        frameOut += "setblock -3 50 -4 redstone_block\n";
        
        fs.writeFileSync('./frames/'+i+'.mcfunction', frameOut);
        fs.writeFileSync('./play/'+i+'.mcfunction', frameSoundOut);

        lastImage = JSON.parse(JSON.stringify(thisImage));
    }

    fs.writeFileSync('./thumb.mcfunction', thumbOut);
}

const createDraw = () => {

    let draw = '';

    for (let i=1;i<=6572;i++) {
        draw += `execute @a[score_frame_min=${i},score_frame=${i}] ~ ~ ~ function badapple:frames/${i}\n`;
    }

    fs.writeFileSync('./draw.mcfunction', draw);
}

const createPlay = () => {

    let play = '';

    for (let i=1;i<=6572;i++) {
        play += `execute @a[score_frame_min=${i},score_frame=${i}] ~ ~ ~ function badapple:play/${i}\n`;
    }

    play += "scoreboard players add @a frame 30\n";

    fs.writeFileSync('./play.mcfunction', play);
}

go();
createDraw();
createPlay();