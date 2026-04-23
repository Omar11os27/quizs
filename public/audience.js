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
    

    

    // audio
    const audio = new Audio('/audio/sound1.wav');
    function start(){
        audio.play()
        // console.log('sound!!')
    }
    function end(){
        audio.pause()
        audio.currentTime = 0
        // console.log('sound end!!')
    }
    // audio
    
    let curqus = 0
    let qus = ['متى تأسست جامعة الأنبار؟',
         `في اي عام حصلت جامعة الأنبار على جائزة
          الأوسكار كأفضل قيادة ادارية في الوطن العربي
          ضمن جوائز التايمز البرطانية العالمية`];

    let ops = [
        ['1986','1987','1988','1989'],
        ['2023','2024','2025','2026']
    ]


    // timer
    // let time = null;
    // socket.on('showTime', (data)=>{
    //     if(clientData.endMatch) return

    //     time = data.time
    //     document.querySelector('.number').innerHTML = `${time}s`
        
    //     if(time <= 5){
    //         if(!isSound){start()}
    //         document.querySelector('.number').style.color = `red`
    //         document.querySelector('.progress').style.stroke = `#770000`
    //     }
    //     if(time == 0){
    //         end()
    //         document.querySelector('.qus').style.backgroundColor = `red`
    //         document.querySelector('.qus .text').innerHTML = `نفذ الوقت`
    //         document.querySelector('.qus .text').style.textShadow = `1px 1px 10px red`
    //     }
    // })

    socket.on('timerAnimation', ()=>{
        document.querySelector('.progress').style.animationPlayState = 'running';
        document.querySelector('.progress').classList.remove('move')
        setTimeout(()=>{
            document.querySelector('.progress').classList.add('move')
        },1100)
    })

    socket.on('stopTimerAnimation',()=>{
        document.querySelector('.progress').style.animationPlayState = 'paused';
    })

    let timer = null
    socket.on('audienceNext', ()=>{
        document.querySelector('.qus .text').innerHTML = qus[curqus]
        let i = 0
        optionsshowtext.forEach(q=>{
            q.innerHTML = `${ops[curqus][i]}`
            i++
        })
        if(curqus<1){curqus++}

        //time
        let isSound = false;
        let time = 15

        clearInterval(timer)
        timer = setInterval(()=>{
            
            document.querySelector('.number').innerHTML = `${time}s`
            
            if(time <= 5){
                if(!isSound){start()}
                document.querySelector('.number').style.color = `red`
                document.querySelector('.progress').style.stroke = `#770000`
            }
            if(time == 0){

                end()
                document.querySelector('.qus').style.backgroundColor = `red`
                document.querySelector('.qus .text').innerHTML = `نفذ الوقت`
                document.querySelector('.qus .text').style.textShadow = `1px 1px 10px red`
                clearInterval(timer)
                
            }
            time--
        },1000)
        
    })
    

    
    socket.on('reset', ()=>{
        
        document.querySelector('.qus .text').innerHTML = `السؤال`
        document.querySelector('.qus').style.backgroundColor = `#DBDBDB`
        document.querySelectorAll('.text').forEach(text =>{text.style.textShadow = `1px 1px 20px #F3E6D0`})
        document.querySelector('.number').innerHTML = `20s`
        document.querySelector('.number').style.color = `#55F068`
        document.querySelectorAll(`.op .bgop`).forEach(op => {op.style.backgroundColor = `#4A2828`})
        


        console.log("[!]reset client")
    })

   
    



})