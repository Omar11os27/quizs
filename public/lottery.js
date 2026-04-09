const socket = io()

socket.on('wait', ()=>{
    window.location.href = `match`
})

for(let i=0;i<8;i++){
    document.querySelector('.matchs1').innerHTML  += `
        <div class="match match1 m${i+1}"></div>
    `
}

for(let i=0;i<4;i++){
    document.querySelector('.matchs2').innerHTML  += `
        <div class="match match2 m${i+9}"></div>
    `
}

for(let i=0;i<2;i++){
    document.querySelector('.matchs3').innerHTML  += `
        <div class="match match3 m${i+13}"></div>
    `
}

document.querySelector('.matchs4').innerHTML  += `
        <div class="match match4 m15"></div>
    `