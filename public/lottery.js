const socket = io()

socket.on('wait', ()=>{
    window.location.href = `match`
})

for(let i=0;i<14;i++){
    document.querySelector('.matchs1').innerHTML  += `
        <div class="match match1 m${i+1}"></div>
    `
}

for(let i=0;i<6;i++){
    document.querySelector('.matchs2').innerHTML  += `
        <div class="match match2 m2${i+1}"></div>
    `
}

for(let i=0;i<4;i++){
    document.querySelector('.matchs3').innerHTML  += `
        <div class="match match3 m3${i+1}"></div>
    `
}

for(let i=0;i<2;i++){
    document.querySelector('.matchs4').innerHTML  += `
        <div class="match match4 m4${i+1}"></div>
    `
}

document.querySelector('.matchs5').innerHTML  += `
        <div class="match match5 m50"></div>
    `