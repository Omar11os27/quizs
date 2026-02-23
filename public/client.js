window.addEventListener('load', ()=>{
    // const mainPath = "https://watch-party-v2gx.onrender.com";
    // const socket = io(mainPath)
    const socket = io()


    // html element
    const timeshow = document.querySelector('.time')
    const questionshow = document.querySelector('.qus')
    const optionsshow = document.querySelectorAll('.op')
    
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
            questionshow.innerHTML = `[error] no question`
        }
    });

    // timer
    socket.on('showTime', (data)=>{
        time = data.time
        timeshow.innerHTML = `${time}`;
        if(time == 0){
            questionshow.style.backgroundColor = `red`;
        }
    })
    


    socket.on('active', (data)=>{
        socket.emit('stopTimer')
        console.log(data.answer)
        if(data.answer){
            document.querySelector('.qus').style.backgroundColor = `green`
        }else{
            document.querySelector('.qus').style.backgroundColor = `red`
        }
    })
    

    

    

})