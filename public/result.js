// socket = io('http://10.229.50.248:3000')
const socket = io()


socket.on('toMain', ()=>{
    window.location.href = '/'
})