const socket = io()

socket.on('start', ()=>{
    console.log('start')
    window.location.href = `lottery`
})