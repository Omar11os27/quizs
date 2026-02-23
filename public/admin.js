// const mainPath = "https://watch-party-v2gx.onrender.com";
// const socket = io(mainPath)
const socket = io()

const btn = document.querySelector('.btn')
const btn2 = document.querySelector('.btn2')

btn.addEventListener('click', ()=>{
    socket.emit('timer')
})

btn2.addEventListener('click', ()=>{
    socket.emit('stopTimer')
})