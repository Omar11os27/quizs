// const mainPath = "https://watch-party-v2gx.onrender.com";
// const socket = io(mainPath)
// socket = io('http://10.143.115.248:3000')
const socket = io()

let time = 1
let timeInterval = null

socket.emit('getTeam')
socket.on('getTeam', (data)=>{
    let teamA = data.teamA
    let teamB = data.teamB
    let role = data.role
    console.log(role)
    let path = ``
    if(role == 2){
        path = `${teamA.team_name}`
    }else{
        path = `${teamB.team_name}`
    }

    document.querySelector('.nameTeam').innerHTML = `${path}`
    document.querySelector('.logoTeam').innerHTML = `<img src="/teamimgs/${path}/logo.jpg" 
        onerror="this.onerror=null; this.src='';"
        alt="logo">`

})

timeInterval = setInterval(()=>{
    document.querySelector('.timeText').innerHTML = `${time}s`
    if(time != 0){time--}
    else{
        socket.emit('waitFinsh')
        clearInterval(timeInterval)
    }
}, 1000)

