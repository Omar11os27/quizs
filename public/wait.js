// const mainPath = "https://watch-party-v2gx.onrender.com";
// const socket = io(mainPath)
// socket = io('http://10.143.115.248:3000')
const socket = io()

let time = 1
let timeInterval = null

timeInterval = setInterval(()=>{
    document.querySelector('.timeText').innerHTML = `${time}s`
    if(time != 0){time--}
    else{
        socket.emit('waitFinsh')
        clearInterval(timeInterval)
    }
}, 1000)

