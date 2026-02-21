window.addEventListener('load', ()=>{
    // const mainPath = "https://watch-party-v2gx.onrender.com";
    // const socket = io(mainPath)
    const socket = io()


    // html element
    const timeshow = document.querySelector('.time')
    const btn = document.querySelector('.btn')
    const btn2 = document.querySelector('.btn2')
    const questionshow = document.querySelector('.qus')
    const optionsshow = document.querySelectorAll('.op')
    
    let time = null;



    btn.addEventListener('click', ()=>{
        socket.emit('timer')
        document.querySelector('body').style.backgroundColor = `green`;
    })
    
    btn2.addEventListener('click', ()=>{
        socket.emit('stopTimer')
        document.querySelector('body').style.backgroundColor = `yellow`;

    })


    socket.on('question', (data) => {
        // console.log("السؤال الجديد: ", data.qus);
        // console.log("الخيارات: ", data.options);
        if(data.qus){
            let options = data.options
            let opCount = 1
            questionshow.innerHTML = `${data.qus}`
            options.forEach(op => {
            optionsshow[opCount-1].innerHTML = `${opCount}. ${op.text}`
            opCount++;
            });
        }else{
            questionshow.innerHTML = `[error] no question`
        }
    });

    // timer
    socket.on('showTime', (data)=>{
        time = data.time
        timeshow.innerHTML = `${time}`;
        if(time == 0){
            document.querySelector('body').style.backgroundColor = `red`;
        }
    })
    
    
})