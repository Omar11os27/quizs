window.addEventListener('load', ()=>{
    // const mainPath = "https://watch-party-v2gx.onrender.com";
    // const socket = io(mainPath)
    const socket = io()


    // html element
    const time = document.querySelector('.time')
    const btn = document.querySelector('.btn')
    
    let counterStart = false;
    let count = null;

    btn.addEventListener('click',()=>{
        counterStart = !counterStart
        if(counterStart){// no logic
            socket.emit('count')
            document.querySelector('body').style.backgroundColor = `green`;
        }else{
            socket.emit('stopTimer');
        }
    })

    socket.on('showCount', (data)=>{
        count = data.count
        time.innerHTML = `${count}`;
        if(data.stop){
            document.querySelector('body').style.backgroundColor = `red`;
        }
    })
    
    
})