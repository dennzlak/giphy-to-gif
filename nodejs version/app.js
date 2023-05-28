const colors = require('colors');
const prompt = require('prompt-sync')({signit: false});
const https = require('https');
const fs = require('fs');

function title() {
    console.clear();
    console.log(`
█▀▀ █ █▀█ █░█ █▄█   ▀█▀ █▀█   █▀▄▀█ █▀█ █░█
█▄█ █ █▀▀ █▀█ ░█░   ░█░ █▄█   █░▀░█ █▀▀ ▀▀█`.red+`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ `.red + `dennzlak`.white + ` ━━
[!] BUGS/ERRORS? CONTACT dennzlak ON GITHUB`.red + `
[!] TYPE 'X' TO QUIT
[!] TYPE 'F' FOR MULTIPLE LINKS (ON TEXT FILE)
[!] TYPE 'I' FOR INSTRUCTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`.red)
}


function validate(url) {
    if (!url.startsWith('http') && url.includes('giphy.com')) {
        url = 'https://'+url
    } else if (url.startsWith('http') && (url.includes('giphy.com/gifs') || url.includes('media.giphy.com')) && url.includes('://')) {
        if (url.endsWith('/giphy.gif')) {
            url = url.replace('/giphy.gif', '')
        }
    }
    else if (url.toLowerCase() == 'f') {
        url = 'f';
    }
    else if (url.toLowerCase() == 'i') {
        url = 'i'
    }
    else {
        console.log('[!] - URL appears to be invalid.'.red)
        url = false;
    }
    return url
}


function findMultiple() {
    try {  
        var data = fs.readFileSync('multiple_links.txt', 'utf8');
        if (data.toString().length < 2) {
            console.log('[!] Contents too short!'.red);
            console.log('[!] Make sure you have pasted the files into the file: '.red + 'multiple_links.txt'.bgRed)
            console.log('[!] Make sure you have saved the file: '.red + 'multiple_links.txt'.bgRed)
        }
        else {
            listArray = data.split('\r\n')
            var y = 0
            listArray.forEach(item => {
                var i = validate(item)
                findGif(i)
                y = y+1
            });
            console.log('Converting...', y, 'gifs to videos.')
        }
    } catch(e) {
        console.log('Error! Please try again or contact dennzlak on Github');
    }


}


function showInstructions() {
    console.clear()
    console.log('INSTRUCTIONS:')
    console.log()
    console.log('FOR ONE GIF'.underline)
    console.log(`
- PASTE THE LINK (RIGHT CLICK TO PASTE ON WINDOWS)
AND PRESS ENTER - THE VIDEO SHOULD DOWNLOAD.

- IF YOU CANNOT PASTE THE LINK ON THE COMMAND LINE, PASTE 
THE LINK INTO THE `.red + `multiple_links.txt `.blue + `FILE AND PRESS 'F' 
ON THE COMMAND LINE TO DOWNLOAD THE FILES.

- IF IT STILL DOESN'T WORK, CONTACT dennzlak ON GITHUB, IT
COULD BE AN ERROR IN THE CODE THAT I CAN FIX.`.red)

console.log(`
SUMMARY: PASTE THE LINK ONTO THE COMMAND LINE, THEN PRESS ENTER.
`.bgRed)

    console.log('FOR MULTIPLE GIFS'.underline)
    console.log(`
- PASTE THE LINKS ONTO THE TEXT FILE (`.red+`multiple_links.txt`.blue+`)
AND PRESS ENTER - THE VIDEO SHOULD DOWNLOAD.

- NOTE: IF IT DOESN'T WORK, TRY TO CREATE THE 
multiple_links.txt FILE YOURSELF

- IF IT STILL DOESN'T WORK, CONTACT dennzlak ON GITHUB, IT
COULD BE AN ERROR IN THE CODE THAT I CAN FIX.`.red)

console.log(`
SUMMARY: PASTE THE LINKS INTO THE TEXT FILE (multiple_links.txt),
THEN PRESS 'F' ON THE COMMAND LINE, FOR THE VIDEOS TO DOWNLOAD`.bgRed)


var cont = prompt('CONTINUE? ('.red+'y'.red.underline+'/n)'.red)
if (cont.toLowerCase() == 'n' || cont.toLowerCase() == 'x') {
    process.exit()
}
else {
    start()
}

}

function start() {
    title()
    fs.writeFile('multiple_links.txt', `https://giphy.com/gifs/chubbiverse-cute-spooky-chubbicorn-NFJxVSN3EtY65vvZdz
    https://media.giphy.com/media/xUA7aM09ByyR1w5YWc/giphy.gif
    https://giphy.com/gifs/LreFxTLmVqQ7O7LtxC
    giphy.com/gifs/chubbiverse-happy-birthday-chubbicorns-chubbicorn-gQmpH0ywVsdKMgVXXd`, { flag: 'wx' }, function (err) {
        if (err) {
            console.log('PLEASE CREATE A FILE NAMED: multiple_links.txt'.red)
        };
    });
    var link = prompt('{ - } Enter GIF link: ')
    if (link.toLowerCase() == 'x') {
        return process.exit()
    }
    var newlink = validate(link)
    findGif(newlink)
}

function findGif(gif) {
    if (gif == false) {
        return
    }
    else if (gif.toLowerCase() == 'f') {
        findMultiple()
    }
    else if (gif.toLowerCase() == 'i') {
        showInstructions()
    }
    else {
        var linkarray = gif.split('/')
        if (gif.includes('-')) {
            var x = linkarray[4].split('-')
            linkarray[4] = x.slice(-1).toString()
        }
        
        var code = linkarray.slice(-1)

        if (code.includes('/')) {
            var temp = code.split('/')
            code = temp[0]
        }
        if (code.toString().includes('\r')) {
            var temp = code.toString().split('\r')
            code = temp[0]
        }
    
    
        const file = fs.createWriteStream('gifs/'+code.toString()+".gif");
        const request = https.get("https://media4.giphy.com/media/"+code+"/giphy.gif", function(response) {
            response.pipe(file);
            file.on("finish", () => {
                file.close();
                console.log("Fully Converted!")
                console.log("[!] Find it in: ".green + "gifs/"+code+".gif");
       });
    });
    }
    
}

start()
