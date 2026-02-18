const { time } = require("console");
const express = require("express")
const app = express()

app.use(express.static("public"));
// sockect.io
const http = require('http').Server(app)
const io = require('socket.io')(http)

const port = 3000
// start server
http.listen(port, () => {
    console.log(`listening on port ${port}`)
})

//view engine setup 
app.set("view engine", "ejs");

//Routes
app.get("/", (req, res) => {
    res.render('home')
})

let count = null;
let timeInterval = null;

io.on('connection', (socket)=>{
    console.log('new connection', socket.id)
    
    socket.on('count', ()=>{
        count = 5
        
        timeInterval = setInterval(() => {
            if(count < 0 ){
                clearInterval(timeInterval)
            }else{
                io.emit('showCount', {count: count})
                if(count != 0){count--}
            }
        }, 1000);
        
        
    })

    socket.on('stopTimer',  ()=>{
        clearInterval(timeInterval)
    })

    socket.on('disconnect', ()=>{
        console.log('disconnect:', socket.id)
    })
})
