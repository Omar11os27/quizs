// const { emit } = require("../database")

window.addEventListener('load', ()=>{
    
    // const mainPath = "https://watch-party-v2gx.onrender.com";
    // const socket = io(mainPath)
    // const socket = io('http://10.143.115.248:3000')
    const socket = io()

    socket.emit('client')

    // html element
    const timeshow = document.querySelector('.time')
    const questionshow = document.querySelector('.qus .text')
    const optionsshow = document.querySelectorAll('.op')
    const optionsshowtext = document.querySelectorAll('.op .text')
    

    let clientData = {
        opId: '',
        currentQus: 1,
        numQus: 0,
        endMatch: false
    }


    socket.on('showRole', (data)=>{
        // if(clientData.endMatch) return
        console.log('changed role!!')
        if(data.role == '1'){
            document.querySelector('.teamA').style.backgroundColor = `green`
            document.querySelector('.teamB').style.backgroundColor = `#4A2828`
            document.querySelector('.teamAicon').style.display = ``
            document.querySelector('.teamBicon').style.display = `none`
        }else{
            document.querySelector('.teamB').style.backgroundColor = `green`
            document.querySelector('.teamA').style.backgroundColor = `#4A2828`
            document.querySelector('.teamBicon').style.display = ``
            document.querySelector('.teamAicon').style.display = `none`

        }
    })


    // timer
    let time = null;
    socket.on('showTime', (data)=>{
        if(clientData.endMatch) return

        time = data.time
        document.querySelector('.number').innerHTML = `${time}s`
        
        if(time <= 5){
            document.querySelector('.number').style.color = `red`
        }
        if(time == 0){
            document.querySelector('.qus').style.backgroundColor = `red`
            document.querySelector('.qus .text').innerHTML = `نفذ الوقت`
            document.querySelector('.qus .text').style.textShadow = `1px 1px 10px red`
        }
    })

    socket.on('timerAnimation', ()=>{
        document.querySelector('.progress').style.animationPlayState = 'running';
        document.querySelector('.progress').classList.remove('move')
        setTimeout(()=>{
            document.querySelector('.progress').classList.add('move')
        },100)
    })

    socket.on('stopTimerAnimation',()=>{
        document.querySelector('.progress').style.animationPlayState = 'paused';
    })

    // questions
    socket.on('question', (data) => {
        // if(clientData.endMatch) return

        document.querySelector('.countQus').innerHTML = `${data.curQus}/${data.numQus}`

        if(!data.enoughQus){
            let options = data.options
            if(data.qus.length > 50){
                document.querySelector('.qus .text').style.fontSize = `32px`
            }
                // console.log(data.qus.length)
            questionshow.innerHTML = `${data.qus}`
            let i = 0
            optionsshowtext.forEach( opshow =>{
                opshow.innerHTML = `${options[i].text}`
                i++
            })
            // ids
            let j = 0
            optionsshow.forEach( op =>{
                op.classList.add(`op${options[j].id}`)
                j++
            })
                
        }else{
            socket.emit('endMatch')
        }
    });

    
    socket.on('reset', ()=>{
        document.querySelector('.qus .text').innerHTML = `السؤال`
        document.querySelector('.qus').style.backgroundColor = `#DBDBDB`
        document.querySelectorAll('.text').forEach(text =>{text.style.textShadow = `1px 1px 20px #F3E6D0`})
        document.querySelector('.number').innerHTML = `20s`
        document.querySelector('.number').style.color = `#55F068`
        document.querySelectorAll(`.op .bgop`).forEach(op => {op.style.backgroundColor = `#4A2828`})
        


        console.log("[!]reset client")
    })

    socket.on('active', (data)=>{
        clientData.opId = data.opId
        socket.emit('stopTimer')

        if(data.answer){
            document.querySelector(`.op${clientData.opId} .bgop`).style.backgroundColor = `#329e32`
            document.querySelector('.qus .text').innerHTML = `إجابة صحيحة 1+`
            document.querySelector('.qus .text').style.color = ``
            document.querySelector('.qus .text').style.textShadow = `1px 1px 10px green`

            document.querySelector('.teamA .point').innerHTML = `${data.pointP1}`
            document.querySelector('.teamB .point').innerHTML = `${data.pointP2}`
        }else{
            document.querySelector(`.op${clientData.opId} .bgop`).style.backgroundColor = `#9e3232`
            document.querySelector('.qus .text').innerHTML = `إجابة خاطئة`
            document.querySelector('.qus .text').style.color = ``
            document.querySelector('.qus .text').style.textShadow = `1px 1px 10px red`
        }
    })
    

    socket.on('endgame', ()=>{
        console.log("end game")
    })

    socket.on('setMatch', (data) =>{
        let teamA = data.teamA
        let teamB = data.teamB
        document.querySelector('.teamA .name').innerHTML = `${teamA.team_name}`
        document.querySelector('.teamB .name').innerHTML = `${teamB.team_name}`
    })


    const iframe = document.querySelector('.Page')
    socket.on('endMatch', ()=>{
        socket.emit('stopTimer')
        document.querySelector('.quscon').style.display = `none`
        iframe.contentWindow.location.href = `result`
        iframe.style.display = `block`
    })

    // socket.on('endMatch', async()=>{
    //     // clientData.endMatch = true
    //     socket.emit('stopTimer')
    //     // socket.emit('reset')
    //     document.querySelector('.quscon').style.display = `none`
    //     iframe.contentWindow.location.href = `result`
    //     // iframe.contentWindow.location.reload();
    //     iframe.style.display = `block`
    // })
    socket.on('newMatch', (data)=>{
        iframe.contentWindow.location.href = `match`
    })


    // wait page before start match
    socket.on('wait', ()=>{
        document.querySelector('.quscon').style.display = `none`
        iframe.contentWindow.location.href = `wait`
        iframe.style.display = `block`
    })
    socket.on('waitFinsh', ()=>{
        iframe.contentWindow.location.href = ``
        iframe.style.display = `none`
        document.querySelector('.quscon').style.display = ``
    })


})