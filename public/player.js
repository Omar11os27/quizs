// const mainPath = "https://watch-party-v2gx.onrender.com";
// const socket = io(mainPath)
socket = io()

let playerData = {
    playerid: ''
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

socket.on('question', (data) => {
    if(data.role == playerData.playerid){
        console.log("can play")
        document.querySelector('.lock').style.display = `none`
    }else{
        console.log("can not play")
        document.querySelector('.lock').style.display = ``
    }
    let options = data.options
    let i = 0
    btns.forEach( btn =>{
        btn.dataset.id = `${options[i].id}`
        i++
    })
});

socket.on('reset', ()=>{
    document.querySelector('.con').style.backgroundColor = `#A433C3`
    console.log("[!]reset player")
})

socket.on('active', (data)=>{
    console.log(data.answer)
    if(data.answer){
        document.querySelector('.con').style.backgroundColor = `green`
    }else{
        document.querySelector('.con').style.backgroundColor = `red`
    }
})