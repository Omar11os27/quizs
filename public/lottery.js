const socket = io()

socket.on('wait', ()=>{
    window.location.href = `match`
})

// class action for ever level
let m1 = [""]
let m2 = []
let m3 = []
let m4 = []
let m5 = ""

// socket

socket.on('updateLottery',(data)=>{
    let a = data.teamA
    let level = data.level
    switch(level){
        case 1:
            if(a){
                m1.push('winner')
                m1.push('loss')
            }else{
                m1.push('loss')
                m1.push('winner')
            }
        break

        case 2:
            if(a){
                m2.push('winner')
                m2.push('loss')
            }else{
                m2.push('loss')
                m2.push('winner')
            }
        break

        case 3:
            if(a){
                m3.push('winner')
                m3.push('loss')
            }else{
                m3.push('loss')
                m3.push('winner')
            }
        break

        case 4:
            if(a){
                m4.push('winner')
                m4.push('loss')
            }else{
                m4.push('loss')
                m4.push('winner')
            }
        break
    }
    


    draw()
})







// draw lottery
function draw(){
    for(let i=0;i<14;i++){
    document.querySelector('.matchs1').innerHTML  += `
        <div class="match match1 m${i+1} ${m1[i]}"></div>
    `
    }

    for(let i=0;i<6;i++){
        document.querySelector('.matchs2').innerHTML  += `
            <div class="match match2 m2${i+1} ${m2[i]}"></div>
        `
    }

    for(let i=0;i<4;i++){
        document.querySelector('.matchs3').innerHTML  += `
            <div class="match match3 m3${i+1} ${m3[i]}"></div>
        `
    }

    for(let i=0;i<2;i++){
        document.querySelector('.matchs4').innerHTML  += `
            <div class="match match4 m4${i+1} ${m4[i]}"></div>
        `
    }

    document.querySelector('.matchs5').innerHTML  += `
            <div class="match match5 m50 ${m5}"></div>
        `
}
draw()