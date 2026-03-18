// const mainPath = "https://watch-party-v2gx.onrender.com";
// const socket = io(mainPath)
// socket = io('http://10.143.115.248:3000')
const socket = io()

let playerData = {
    playerid: '',
    opId: 0,
    endMatch: false
}

document.querySelector('.lock').style.display = `none`

socket.emit('player')
socket.on('playerId', (data)=>{
    playerData.playerid = data.playerid
    console.log('player id = ', playerData.playerid)
})

let btns = document.querySelectorAll('.op')
let currentOption = null

btns.forEach( btn =>{
    btn.addEventListener('click',()=>{
        currentOption = btn.dataset.id
        socket.emit('answer',{currentOption: currentOption, playerid : playerData.playerid})
    })
})

const optionsshowtext = document.querySelectorAll('.op .text');

socket.on('question', (data) => {
    document.querySelector('.countQus').innerHTML = `${data.curQus}/${data.numQus}`

    if(data.role == playerData.playerid){
        console.log("can play")
        document.querySelector('.lock').style.display = `none`
    }else{
        console.log("can not play")
        document.querySelector('.lock').style.display = ``
    }
    // qus
    document.querySelector('.qus .text').innerHTML = `${data.qus}`
    let options = data.options
    let j = 0
    optionsshowtext.forEach( opshow =>{
        opshow.innerHTML = `${options[j].text}`
        j++
    })
    // ids
    let i = 0
    btns.forEach( btn =>{
        btn.dataset.id = `${options[i].id}`
        btn.classList.add(`op${options[i].id}`)
        i++
    })
});

// timer
socket.on('showTime', (data)=>{

    // let sound = new Audio('/audio/sound1.wav');

    let time = data.time
    // timeshow.innerHTML = `${time}`;
    document.querySelector('.number').innerHTML = `${time}s`
    
    if(time <= 5){
        document.querySelector('.number').style.color = `red`
        document.querySelector('.progress').style.stroke = `red`
        // sound.play();
    }
    if(time == 0){
        document.querySelector('.qus').style.backgroundColor = `red`
        document.querySelector('.qus .text').innerHTML = `نفذ الوقت`
        document.querySelector('.qus .text').style.textShadow = `1px 1px 10px red`
        // sound.pause();
    }
})

//  socket.on('timerAnimation', ()=>{
//     document.querySelector('.progress').style.animationPlayState = 'running';
//     document.querySelector('.progress').classList.remove('move')
//     setTimeout(()=>{
//         document.querySelector('.progress').classList.add('move')
//     },100)
// })

// socket.on('stopTimerAnimation',()=>{
//     document.querySelector('.progress').style.animationPlayState = 'paused';
// })

socket.on('reset', ()=>{
    document.querySelectorAll(`.op .bgop`).forEach(op=>{
        op.style.backgroundColor = `#4A2828`
    })

    document.querySelector('.number').style.color = `#55F068`
    document.querySelector('.progress').style.stroke = `#925353`

    document.querySelector('.qus').style.backgroundColor = `#DBDBDB`
    document.querySelector('.qus .text').innerHTML = ``
    document.querySelector('.qus .text').style.textShadow = `1px 1px 10px white`

    console.log("[!]reset player")
})

socket.on('active', (data)=>{
    playerData.opId = data.opId
    console.log(playerData.opId)
    if(data.answer){
        document.querySelector(`.op${playerData.opId} .bgop`).style.backgroundColor = `green`
    }else{
        document.querySelector(`.op${playerData.opId} .bgop`).style.backgroundColor = `red`
    }
})

//iframe
const iframe = document.querySelector('.resPage')
socket.on('endMatch', async()=>{
    document.querySelector('.quscon').style.display = `none`
    iframe.contentWindow.location.href = `result`
    iframe.style.display = `block`
})
socket.on('newMatch', (data)=>{
    iframe.contentWindow.location.href = `match`
})

//wait
socket.on('wait', ()=>{
    // iframe.contentWindow.location.href = `wait`
    // iframe.style.display = `block`
    // document.querySelector('.lock').display = `none`
})
socket.on('waitFinsh', ()=>{
    document.querySelector('.quscon').style.display = ``
    iframe.contentWindow.location.href = ``
    iframe.style.display = `none`
    // document.querySelector('.lock').display = ``
})