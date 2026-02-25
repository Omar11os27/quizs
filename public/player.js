// const mainPath = "https://watch-party-v2gx.onrender.com";
// const socket = io(mainPath)
socket = io()

socket.emit('player')

let btns = document.querySelectorAll('.op')
let currentOption = null

btns.forEach( btn =>{
    btn.addEventListener('click',()=>{
        currentOption = btn.dataset.id
        socket.emit('answer',{currentOption: currentOption})
    })
})

socket.on('question', (data) => {
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