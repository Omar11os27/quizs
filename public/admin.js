// const mainPath = "https://watch-party-v2gx.onrender.com";
// const socket = io(mainPath)
// const socket = io('http://10.229.50.248:3000')
const socket = io()

const btn = document.querySelector('.btn')
const btn2 = document.querySelector('.btn2')

btn.addEventListener('click', ()=>{
    let teamA = document.querySelector('.teamA').value
    let teamB = document.querySelector('.teamB').value
    socket.emit('setTeam', {teamA: teamA, teamB: teamB})
    socket.emit('reset')
    socket.emit('changeRole')
    // setTimeout(()=>{
    socket.emit('timer')
    // },500)
})

btn2.addEventListener('click', ()=>{
    socket.emit('stopTimer')
})


socket.emit('getOp')
socket.on('getOp', data =>{
    let r = data.res[0]
    r.map(r => {
        if(r.state == ''){
            document.querySelectorAll('.team').forEach(op =>{
                op.innerHTML += `
                    <option value="${r.team_name}">${r.team_name}</option>
                `
            })
        }else{
            document.querySelectorAll('.teamDone').forEach(done =>{
                done.innerHTML += `${r.team_name}`
            })
        }
    })
})
