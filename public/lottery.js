const socket = io()

socket.on('wait', ()=>{
    window.location.href = `match`
})

let collageName = ["كلية الآداب", "كلية الإدارة والإقتصاد", "كلية التربية البدنية وعلوم الرياضة", "كلية التربية للبنات", "كلية التربية للعلوم الانسانية", "كلية التربية للعلوم الصرفة", "كلية الصيدلة", "كلية الطب", "كلية العلوم", "كلية العلوم الاسلامية", "كلية العلوم السياسية", "كلية القانون", "كلية علوم الحاسوب وتكنولوجيا المعلومات"]

// class action for ever level
let m1 = [""]
let m2 = []
let m3 = []
let m4 = []
let m5 = ""

// الاسماء لازم تكون نفس الي في قاعدة البيانات في جدول المباريات 
let m1Name = ["انسانية","حديثة","حاسوب","سياسية","صرفة","علوم","صيدلة","إدارة","اسلامية","اداب","طب","بنات","رياضة","قانون","كلية التربية الاساسية حديثة"]
let m2Name = ["","","","","","","",""]
let m3Name = ["","","",""]
let m4Name = ["",""]
let m5Name = ""


let levelData = {
    "level": 1,
    "pos": 0
}
socket.emit('loadLottery')
socket.on('loadLottery', (data)=>{
    m1 = data.m1
    m2 = data.m2
    m3 = data.m3
    m4 = data.m4
    m5 = data.m5
    m2Name = data.m2name
    m3Name = data.m3name
    m4Name = data.m4name
    m5Name = data.m5name
    levelData.level = data.level
    levelData.pos = data.pos
    draw()
})



let x = {
    "كلية الآداب": "اداب",
    "كلية الإدارة والإقتصاد": "إدارة",
    "كلية التربية البدنية وعلوم الرياضة" : "رياضة",
    "كلية التربية للعلوم الصرفة" : "صرفة",
    "كلية علوم الحاسوب وتكنولوجيا المعلومات" : "حاسوب",
    "كلية التربية للبنات": "بنات",
    "كلية التربية للعلوم الانسانية": "انسانية",
    "كلية الصيدلة": "صيدلة", 
    "كلية الطب": "طب",
    "كلية العلوم" : "علوم",
    "كلية العلوم الاسلامية": "اسلامية",
    "كلية العلوم السياسية": "سياسية",
    "كلية القانون": "قانون",
    "كلية التربية الاساسية حديثة": "حديثة"

}
function shorterName(name){
    return x[name]
}

// socket

socket.on('updateLottery',(data)=>{

    let a = data.teamA
    let level = levelData.level
    let pos = levelData.pos
    let nameA = data.teamAname
    let nameB = data.teamBname
    
    switch(level){
        case 1:
            if(a){
                m1.push('winner')
                m1.push('loss')
                m2Name[pos]=shorterName(nameA)
            }else{
                m1.push('loss')
                m1.push('winner')
                m2Name[pos]=shorterName(nameB)
            }
            levelData.pos++
            if(pos == 5){levelData.level++;levelData.pos=0}
        break

        case 2:
            if(a){
                if(pos == 0){
                    m1[0]=('winner')
                    m2.push('loss')
                }else if(pos == 3){
                    m2.push('winner')
                    m1[13]=('loss')
                }else{
                    m2.push('winner')
                    m2.push('loss')
                }
                m3Name[pos]=shorterName(nameA)
            }else{
                if(pos == 0){
                    m1[0]=('loss')
                    m2.push('winner')
                }else if(pos == 3){
                    m2.push('loss')
                    m1[13]=('winner')
                }else{
                    m2.push('loss')
                    m2.push('winner')
                }
                m3Name[pos]=shorterName(nameB)
            }
            levelData.pos++
            if(pos == 3){levelData.level++;levelData.pos=0}
        break

        case 3:
            if(a){
                m3.push('winner')
                m3.push('loss')
                m4Name[pos]=shorterName(nameA)
            }else{
                m3.push('loss')
                m3.push('winner')
                m4Name[pos]=shorterName(nameB)
            }
            levelData.pos++
            if(pos == 1){levelData.level++;levelData.pos=0}
        break

        case 4:
            if(a){
                m4.push('winner')
                m4.push('loss')
                m5Name=shorterName(nameA)
            }else{
                m4.push('loss')
                m4.push('winner')
                m5Name=shorterName(nameB)
            }
        break
    }
    


    draw()
})




// draw lottery
function draw(){
    for(let i=0;i<14;i++){
    document.querySelector('.matchs1').innerHTML  += `
        <div class="match match1 m${i+1} ${m1[i]}">
            <p class="name">${m1Name[i]}</p>
        </div>
    `
    }

    for(let i=0;i<6;i++){
        document.querySelector('.matchs2').innerHTML  += `
            <div class="match match2 m2${i+1} ${m2[i]}">
                <p class="name">${m2Name[i]}</p>
            </div>
        `
    }

    for(let i=0;i<4;i++){
        document.querySelector('.matchs3').innerHTML  += `
            <div class="match match3 m3${i+1} ${m3[i]}">
                <p class="name">${m3Name[i]}</p>
            </div>
        `
    }

    for(let i=0;i<2;i++){
        document.querySelector('.matchs4').innerHTML  += `
            <div class="match match4 m4${i+1} ${m4[i]}">
                <p class="name">${m4Name[i]}</p>
            </div>
        `
    }

    document.querySelector('.matchs5').innerHTML  += `
            <div class="match match5 m50 ${m5}">
                <p class="name">${m5Name}</p>
            </div>
        `

    socket.emit('saveLottery',{
        m1: m1,m2: m2, m3: m3,m4: m4,m5: m5,
        m2name: m2Name,m3name: m3Name,m4name: m4Name,m5name: m5Name,
        level: levelData.level, pos: levelData.pos
    })
}











/*
<img src="/teamimgs/${collageName[i]}/logo.jpg"
    onerror="this.onerror=null; this.style.display='none';"
class="logo">    
*/