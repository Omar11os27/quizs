const socket = io('192.168.0.191:3000')

socket.on('start', ()=>{
    console.log('start')
    window.location.href = `lottery`
})