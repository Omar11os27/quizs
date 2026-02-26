window.addEventListener('load', ()=>{
    // const mainPath = "https://watch-party-v2gx.onrender.com";
    // const socket = io(mainPath)
    const socket = io()

    socket.emit('client')

    // html element
    const timeshow = document.querySelector('.time')
    const questionshow = document.querySelector('.qus .text')
    const optionsshow = document.querySelectorAll('.op .text')
    
    
    let time = null;


    socket.on('question', (data) => {
        // console.log("السؤال الجديد: ", data.qus);
        // console.log("الخيارات: ", data.options);
        if(data.qus){
            let options = data.options
            questionshow.innerHTML = `${data.qus}`
            let i = 0
            optionsshow.forEach( opshow =>{
                opshow.innerHTML = `${options[i].text}`
                i++
            })
                
        }else{
            questionshow.innerHTML = `خلصت الاسألة`
        }
    });

    // timer
    socket.on('showTime', (data)=>{
        time = data.time
        timeshow.innerHTML = `${time}`;
        if(time <= 5){
            timeshow.style.color = `red`
        }
        if(time == 0){
            document.querySelector('.qus').style.backgroundColor = `red`
            document.querySelector('.qus .text').innerHTML = `نفذ الوقت`
        }
    })
    
    socket.on('reset', ()=>{
        document.querySelector('.qus').style.backgroundColor = ``
        document.querySelector('.qus .text').innerHTML = `السؤال`
        document.querySelector('.time').style.color = `white`
        document.querySelector('.time').innerHTML = `20`
        console.log("[!]reset client")
    })

    socket.on('active', (data)=>{
        socket.emit('stopTimer')
        console.log(data.answer)
        if(data.answer){
            document.querySelector('.qus').style.backgroundColor = `green`
            document.querySelector('.qus .text').innerHTML = `إجابة صحيحة`

            document.querySelector('.teamA .point').innerHTML = `${data.pointP1}`
            document.querySelector('.teamB .point').innerHTML = `${data.pointP2}`
        }else{
            document.querySelector('.qus').style.backgroundColor = `red`
            document.querySelector('.qus .text').innerHTML = `إجابة خاطئة`
        }

        
    })
    

    

    

})