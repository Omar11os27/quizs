// const mainPath = "https://watch-party-v2gx.onrender.com";
// const socket = io(mainPath)
// const socket = io('http://10.143.115.248:3000')
const socket = io()



const btn = document.querySelector('.btn')
const btn2 = document.querySelector('.btn2')
const newMatch = document.querySelector('.newMatch')


btn.addEventListener('click', ()=>{
    socket.emit('wait')
})
socket.on('waitFinsh', ()=>{
    socket.emit('reset')
    socket.emit('changeRole')
    socket.emit('timer')
})

btn2.addEventListener('click', ()=>{
    socket.emit('stopTimer')
})

newMatch.addEventListener('click', ()=>{
    socket.emit('newMatch')
})



