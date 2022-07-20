http = require('http')
fs = require('fs')
url = require('url')
mqtt = require('mqtt')

client = mqtt.connect('http://mqtt.pi40.ru',{username:'fadeev_iliya',password:'Ajhtcnufvg95',port:1883,clientId:'338764'})
const topic = "fadeev_iliya/command";
const topic_Em = "fadeev_iliya/command";
const topic_ = "fadeev_iliya/command";

// MQTT ---------------------------------------
function on_connect() {     console.log('connected')      }

function receive_message(topic,payload){
    console.log('received message',topic,payload.toString())
}
function on_subscribe(){
    console.log('subscribed')
}

// Server --------------------------------------
function on_request(request,result){
    console.log('Запрос ' + request.method +" "+ request.url)
    if (request.url.indexOf("/home.css") != -1){
        result.setHeader("Content-type","text/css; charset=utf-8;")
        fs.createReadStream('home.css').pipe(result)    
    }
    else if (request.url.indexOf("/home") != -1){
        result.setHeader("Content-type","text/html; charset=utf-8;")
        fs.createReadStream('home.html').pipe(result)
        if (request.method == "GET"){
            let urlRequest = url.parse(request.url,true)
            // Движение 
            if      (urlRequest.query.move == 'forward' )       {    client.publish(topic,"o")    }
            else if (urlRequest.query.move == 'backward')       {    client.publish(topic,"p")    }
            else if (urlRequest.query.move == 'right'   )       {    client.publish(topic,"r")    }
            else if (urlRequest.query.move == 'left'    )       {    client.publish(topic,"q")    }
            // Стопы
            else if (urlRequest.query.stop == 'smooth'  )       {    client.publish(topic,"f")    }
            else if (urlRequest.query.stop == 'hard'    )       {    client.publish(topic,"h")    }
        }
    }
    else if (request.url.indexOf('.png') != -1){
        result.setHeader("Content-type","image/png;")
        fs.createReadStream(__dirname + request.url).pipe(result)    
    }
    else{
        result.write("ERROR 404 not Found")
    }
}
function on_create(){
    console.log('Сервер запущен');
}


client.on("connect",on_connect)
client.on("message",receive_message)

server = http.createServer(on_request);

server.listen(3000,on_create)