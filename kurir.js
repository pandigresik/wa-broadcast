const Config = require('./config.json')
const fetch = require('node-fetch')
class Kurir {
    constructor (clientWa) {
        this.clientWa = clientWa        
    }

    async kirim (url, msg) {        
        let number = msg.from.split('@')[0];        
        let urlWebService = Config.webserviceUrl + url + '?sender=' + number + '&message=' + encodeURIComponent(msg.body);
        console.log(urlWebService)
        fetch(urlWebService).then(response => response.json()).then(pesan => this.clientWa.sendMessage(msg.from, pesan['pesan']) ).catch(error => console.log(error))
    }

    saveInbox(msg){
        this.kirim('receive',msg);
    }

    register(msg){        
        this.kirim('register',msg);
    }

    chat(msg){        
        this.kirim('chat',msg);
    }
}

module.exports = Kurir;