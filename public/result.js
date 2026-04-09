// socket = io('http://10.143.115.248:3000')
const socket = io()

let pointP1 = 4
let pointP2 = 5

socket.emit('getpoint')
socket.on('getpoint', (data)=>{
    document.querySelector('.scoreA').innerHTML = `${data.pointA}`
    document.querySelector('.scoreB').innerHTML = `${data.pointB}`
})


socket.emit('getTeam')
socket.on('getTeam', (data)=>{
    let teamA = data.teamA
    let teamB = data.teamB
    
    console.log(teamA)
    console.log(teamB)

    //teamA details
    let teamApath = `${teamA.team_name}`
    //team nameA
    document.querySelector('.nameA').innerHTML = `${teamApath}`
    //logoA
    document.querySelector('.logoA').innerHTML = `<img src="/teamimgs/${teamApath}/logo.jpg" 
        onerror="this.onerror=null; this.src='';"
        alt="logo">`
    //leaderA
    document.querySelector('.leaderA').innerHTML = `<img src="/teamimgs/${teamApath}/0.jpg" 
        onerror="this.onerror=null; this.src='/img/anyone.png';"
        alt="leader">`
    //memberA
    let a = 1
    document.querySelectorAll('.memberA .member').forEach( (m) =>{
        m.innerHTML = `<img src="/teamimgs/${teamApath}/${a}.jpg" 
        onerror="this.onerror=null; this.src='/img/anyone.png';"
        alt="member">`
        a++
    })

    //teamB details
    let teamBpath = `${teamB.team_name}`
    //team nameB
    document.querySelector('.nameB').innerHTML = `${teamBpath}`
    //logoB
    document.querySelector('.logoB').innerHTML = `<img src="/teamimgs/${teamBpath}/logo.jpg" 
        onerror="this.onerror=null; this.src='';"
        alt="logo">`
    //leaderB
    document.querySelector('.leaderB').innerHTML = `<img src="/teamimgs/${teamBpath}/0.jpg" 
        onerror="this.onerror=null; this.src='/img/womanLogo.jpg';"
        alt="leader">`
    //memberB
    let b = 1
    document.querySelectorAll('.memberB .member').forEach( (m) =>{
        m.innerHTML = `<img src="/teamimgs/${teamBpath}/${b}.jpg" 
        onerror="this.onerror=null; this.src='/img/womanLogo.jpg';"
        alt="member">`
        b++
    })

})
