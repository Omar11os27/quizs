// const mainPath = "https://watch-party-v2gx.onrender.com";
// const socket = io(mainPath)
// const socket = io('http://10.143.115.248:3000')
const socket = io()

let endgame = false
let isMatch = false

const btn = document.querySelector('.btn')
const btn2 = document.querySelector('.btn2')
const newMatch = document.querySelector('.newMatch')
const start = document.querySelector('.start')
const audience = document.querySelector('.audience')
const audienceNext = document.querySelector('.audienceNext')
const returnHome = document.querySelector('.returnHome')


audience.addEventListener('click' ,()=>{
    socket.emit('audience')
})
audienceNext.addEventListener('click' ,()=>{
    socket.emit('reset')
    socket.emit('audienceNext')
})
returnHome.addEventListener('click' ,()=>{
    socket.emit('returnHome')
})

start.addEventListener('click' ,()=>{
    socket.emit('start')
})
//next
btn.addEventListener('click', ()=>{
    if(!isMatch) {
        socket.emit('wait')
    }
})
socket.on('waitFinsh', ()=>{
    socket.emit('reset')
    socket.emit('changeRole')
    socket.emit('timer')
})

btn2.addEventListener('click', ()=>{
    // socket.emit('stopTimer')
    if(endgame){
        socket.emit('endgame')
    }else{
        console.log('lottery is running !!')
    }
})

newMatch.addEventListener('click', ()=>{
    socket.emit('newMatch')
    // socket.emit('updateLottery')
})

socket.on('lottery', (data)=>{
    let m = data.matchs
    console.log(m)
})

socket.on('end', ()=>{
    // console.log('end game!!')
    document.querySelector('.btn2').style.backgroundColor = `red`
    endgame = true
})



