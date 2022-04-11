const Config = require('./config.json')
const Kurir = require('./kurir')
const fs = require('fs')
const qrcode = require('qrcode-terminal')
const Downloader = require('./downloader')
const WebSocket = require('ws')
const _ = require('lodash')
const {
    Client,    
    MessageMedia,
    LocalAuth
} = require('whatsapp-web.js');
const downloadManager = new Downloader()
let kurir
let filePath

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: Config.puppeteer
});
// You can use an existing session and avoid scanning a QR code by adding a "session" object to the client options.
// This object must include WABrowserId, WASecretBundle, WAToken1 and WAToken2.

client.initialize();

client.on('qr', (qr) => {
    // NOTE: This event will not be fired if a session is specified.
    console.log('QR RECEIVED', qr)
    if (Config.puppeteer.headless) {
        qrcode.generate(qr, {small: true})
    }
    
});

client.on('authenticated', (session) => {
    console.log('AUTHENTICATED', session);
    // sessionCfg = session;
    // fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
    //     if (err) {
    //         console.error(err);
    //     }
    // });
});

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessfull
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', () => {
    console.log('READY');
    kurir = new Kurir(client)
});

client.on('message', async msg => {
    console.log(msg)
    if(kurir === undefined) return
    if (msg.body.startsWith('/')) {
        // Send a new message to the same chat
        kurir.chat(msg);
    }
});

client.on('message_create', (msg) => {
    // Fired on all message creations, including your own
    if (msg.fromMe) {
        // do stuff here
    }
});

client.on('message_revoke_everyone', async (after, before) => {
    // Fired whenever a message is deleted by anyone (including you)
    console.log(after); // message after it was deleted.
    if (before) {
        console.log(before); // message before it was deleted.
    }
});

client.on('message_revoke_me', async (msg) => {
    // Fired whenever a message is only deleted in your own view.
    console.log(msg.body); // message before it was deleted.
});

client.on('message_ack', (msg, ack) => {
    /*
        == ACK VALUES ==
        ACK_ERROR: -1
        ACK_PENDING: 0
        ACK_SERVER: 1
        ACK_DEVICE: 2
        ACK_READ: 3
        ACK_PLAYED: 4
    */

    if (ack == 3) {
        // The message was read
    }
});

client.on('group_join', (notification) => {
    // User has joined or been added to the group.
    console.log('join', notification);
    notification.reply('User joined.');
});

client.on('group_leave', (notification) => {
    // User has left or been kicked from the group.
    console.log('leave', notification);
    notification.reply('User left.');
});

client.on('group_update', (notification) => {
    // Group picture, subject or description has been updated.
    console.log('update', notification);
});

client.on('change_battery', (batteryInfo) => {
    // Battery percentage for attached device has changed
    const {
        battery,
        plugged
    } = batteryInfo;
    console.log(`Battery: ${battery}% - Charging? ${plugged}`);
});

client.on('disconnected', (reason) => {
    console.log('Client was logged out', reason);
});

const wss = new WebSocket.Server({
    port: Config.websocketPort
})

wss.on('connection', ws => {
    ws.on('message', async message => {
        //console.log(`Received message => ${message}`)
        handleMessage(message);
    })
})

async function handleMessage(e) {
    let obj = JSON.parse(e);
    if (obj.type == 'sendWa') {
        //  let validType = ['text', 'image', 'document', 'location', 'video']
        let numbers = obj.data
        let options = {}
        let tmpAttachment = {}
        for (var i in numbers) {            
            options = numbers[i].options !== undefined ? numbers[i].options : {}
            if (options.media) {
                options.media = new MessageMedia(options.media.mimetype, options.media.b64data, options.media.filename)
            }
            
            if (numbers[i].url_public) {
                filePath = Config.folderDownload +"/"+ numbers[i].url_public.substring(numbers[i].url_public.lastIndexOf('/') + 1);
                await downloadManager.download(numbers[i].url_public,filePath)
                        .then(fileInfo => numbers[i].attachment = fileInfo.path)
                        .catch(err => console.log(err))
            }

            if (numbers[i].attachment !== undefined) {
                if (numbers[i].attachment) {
                    if (fs.existsSync(numbers[i].attachment)) {
                        if(tmpAttachment[numbers[i].attachment] == undefined){
                            tmpAttachment[numbers[i].attachment] = MessageMedia.fromFilePath(numbers[i].attachment)
                        }
                        options['media'] = tmpAttachment[numbers[i].attachment]
                    }
                }                         
            }
            // jika mimetype tidak ada dalam list mimetypecaption maka kirim dulu captionnya scecara terpisah
            if(options.media){
                if(!_.includes(Config.mimetypeCaption,options.media.mimetype)){
                    if(!_.isEmpty(numbers[i].message)){
                        client.sendMessage(numbers[i].to, numbers[i].message)
                    }
                }
            }
            
            client.sendMessage(numbers[i].to, numbers[i].message, options)
        }
        tmpAttachment = {}
    }
}

