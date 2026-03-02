window.addEventListener('load', ()=>{
    // const mainPath = "https://watch-party-v2gx.onrender.com";
    // const socket = io(mainPath)
    // const socket = io('http://10.229.50.248:3000')
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
        // console.log('roled!!')
        if(clientData.endMatch){
            return
        }

        if(data.role == '1'){
            document.querySelector('.teamA .role').style.opacity = `100%`
            document.querySelector('.teamB .role').style.opacity = `0%`
            document.querySelector('.teamAicon').style.border = `green 2px solid`
            document.querySelector('.teamBicon').style.border = ``
            document.querySelector('.teamAicon').style.boxShadow = `1px 1px 20px green`
            document.querySelector('.teamBicon').style.boxShadow = `1px 1px 20px white`
        }else{
            document.querySelector('.teamB .role').style.opacity = `100%`
            document.querySelector('.teamA .role').style.opacity = `0%`
            document.querySelector('.teamBicon').style.border = `green 2px solid`
            document.querySelector('.teamAicon').style.border = ``
            document.querySelector('.teamBicon').style.boxShadow = `1px 1px 20px green`
            document.querySelector('.teamAicon').style.boxShadow = `1px 1px 20px white`
        }
    })


    // timer
    let time = null;
    socket.on('showTime', (data)=>{
        document.querySelector('.countQus').innerHTML = `${clientData.currentQus}/${clientData.numQus}`
        time = data.time
        timeshow.innerHTML = `${time}`;
        if(time <= 5){
            timeshow.style.color = `red`
            timeshow.style.textShadow = `1px 1px 10px red`
        }
        if(time == 0){
            document.querySelector('.qus').style.backgroundColor = `red`
            document.querySelector('.qus .text').innerHTML = `نفذ الوقت`
            document.querySelector('.qus .text').style.textShadow = `1px 1px 10px red`

        }
    })

    // questions
    socket.on('question', (data) => {
        clientData.currentQus = data.curQus
        clientData.numQus = data.numQus
        // data.qus && 
        if(!data.enoughQus){
            let options = data.options
            if(data.qus.length > 50){
                document.querySelector('.qus .text').style.fontSize = `32px`
            }
                console.log(data.qus.length)
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

    socket.on('endMatch', async()=>{
        clientData.endMatch = true
        socket.emit('stopTimer')
        socket.emit('reset')
    })
    
    socket.on('reset', ()=>{
        document.querySelector('.qus .text').innerHTML = `السؤال`
        document.querySelector('.qus').style.backgroundColor = `white`
        document.querySelector('.qus .text').style.textShadow = `1px 1px 10px white`
        document.querySelector('.time').style.textShadow = `1px 1px 10px yellow`
        document.querySelector('.time').style.color = `white`
        document.querySelector('.time').innerHTML = `20`
        document.querySelector(`.op${clientData.opId} .bgop`).style.backgroundColor = `#925353`
        document.querySelectorAll('.team .role').forEach(r => r.style.opacity = `0%`)
        document.querySelectorAll('.teamicon').forEach(t =>{ 
            t.style.border = ``
            t.style.boxShadow = `1px 1px 20px white`
        })
        
            




        console.log("[!]reset client")
    })

    socket.on('active', (data)=>{
        clientData.opId = data.opId
        socket.emit('stopTimer')
        // console.log(data.answer)
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
    

    

    socket.on('setTeam', data =>{
        document.querySelector('.teamA .name').innerHTML = `${data.teamA}`
        document.querySelector('.teamB .name').innerHTML = `${data.teamB}`
    })

})