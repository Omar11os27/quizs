const express = require('express');
const http = require('http'); 
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app); // نربط Express بسيرفر الـ HTTP
const db = require('./database'); // ملف الاتصال اللي سويناه
const { error } = require('console');
const { emit } = require('cluster');
const { json } = require('stream/consumers');
const { finished } = require('stream');

app.use(express.static("public"));
// هنا الربط الحقيقي لـ Socket.io مع حل مشكلة الـ CORS
const io = new Server(server, {
  cors: {
    origin: "*", // هذا يسمح لأي متصفح يتصل بيك (ضروري للتطوير)
    methods: ["GET", "POST"]
  }
});

const port = 3000
// start server
// ipv4 10.229.50.248 (cmd ipconfig)
server.listen(port,'0.0.0.0', () => {
    console.log(`listening on port ${port}`)
})

//view engine setup 
app.set("view engine", "ejs");

//Routes
app.get("/", (req, res) => {
    res.render('home')
})

app.get("/admin", (req, res) => {
    res.render('admin')
})
app.get("/lottery", (req, res) => {
    res.render('lottery')
})
app.get("/match", (req, res) => {
    res.render('match')
})
app.get("/result", (req, res) => {
    res.render('result')
})
app.get("/winner", (req, res) => {
    res.render('winner')
})
app.get("/player", (req, res) => {
    // if(global.users.length < 2){
        res.render('player')
    // }else{
        // res.render('maxplayer')
    // }
})
app.get("/wait", (req, res) => {
    res.render('wait')
})
app.get("/welcome", (req, res) => {
    res.render('welcome')
})


let time = null;
let timeInterval = null;

let global = {
    currectOption: null,
    timer: false,
    answer: false,
    Isanswer: false,
    users: [],
    rolePlayer: '2',
    client: '',
    pointP1: 0,
    pointP2: 0,
    question: [],
    curQus: 0,
    numQus: 3,
    qusFull: false,
    enoughQus: false,
    isMatch: true,
    noQusDatabase: false,
    matchs: [],
    teams: [],
    matchid: 0,
    teamA: null,
    teamB: null,
    set: false,
    win1st: "win1",
    win2nd: "win2"

}

let lotteryData = {
    'm1':[""],'m2':[],'m3':[],'m4':[],'m5': "",
    'm2Name':["","","","","","","",""],
    'm3Name':["","","",""],
    'm4Name':["",""],
    'm5Name': "",
    'level': 1,'pos': 0 
}


//functions
        
    // team
    async function getTeams(){
        let res = await db.query(`select * from teams`)
        return res
    }
    //

    // matchs
    async function getMatchs(){
        let res = await db.query("select * from quiz_matches order by match_order")
        return res
    }

    async function setMT() {
        let m = await getMatchs()
        global.matchs = m[0]
        let t = await getTeams()
        global.teams = t[0]
        console.log('set done!!')
    }

    setMT()

    function getMatch(){
        let matchs = global.matchs
        let cur = matchs.filter(m => {
           return m.match_status == 'pending'
        })
        return cur
    }

    function getTeam(a,b){
        let team = global.teams
        
        let teamA = team.filter(t => t.id == a)
        let teamB = team.filter(t => t.id == b)
        
        return{
            teamA: teamA[0],
            teamB: teamB[0]
        }
    }

    // async function finishMatch(id){
    //     if(id != 0){
    //         await db.query(`update quiz_matches set match_status = 'finished' where id = ${id}`)
    //     }
    // }
    function finishMatch(id){
        let m = global.matchs
        m.map(m=>{
            if(m.id == id){
                m.match_status = 'finish'
            }
        })
        m = m.filter(m =>{
            return m.match_status != 'finish'
        })
        global.matchs = m
    }

    function curMatch() {
        let m = getMatch()
            m = m[0]
        if(m != null){
            global.matchid = m.id
            let t = getTeam(m.teamA_id, m.teamB_id)
            let ta = t.teamA
            let tb = t.teamB
            
            global.teamA = ta
            global.teamB = tb
            console.log('curMatch=> ',m)
            finishMatch(m.id) //to change match_status = 'finish'
            
        }else{
            return null
        }
    }

    function changeRole(){
        // if(global.isMatch == false) return

        if(global.rolePlayer == '1'){
            global.rolePlayer = '2'
        }else{
            global.rolePlayer = '1'
        }
    }

    function saveScore(id){
        let m = global.matchs

        m = m.filter(m =>{
            return m.id == id
        })
        m = m[0]
        // console.log('save =>',m)
        if(m != null){
            m.teamA_score = global.pointP1
            m.teamB_score = global.pointP2
        }

    }

    function lossTeam(id){
        let m = global.matchs

        m = m.filter(m =>{
            return m.id == id
        })
        m = m[0]
        let scoreA = 0
        let scoreB = 0
        if(m != null){
            scoreA = m.teamA_score
            scoreB = m.teamB_score
        }
        
        // console.log(m)
        if(scoreA > scoreB){
            return m.teamB_id
        }else if(scoreA < scoreB){
            return m.teamA_id
        }else{
            console.log('TIE')
        }
    }
    function updateLottery(lossTeamid){
        let matchs = global.matchs
        let newMatchs = matchs.filter(m =>{
            return m.teamA_id != lossTeamid && m.teamB_id != lossTeamid
        })
        // console.log(newMatchs)
        global.matchs = newMatchs
    }

    // setMT()
    // setTimeout(()=>{
        // console.log("before=> ",global.matchs)
        // curMatch()
        // curMatch()
        // console.log("after=> ",global.matchs)
            
            // updateLottery(lossTeam(global.matchid)) 

        // console.log('-----------------')
        // for(let i=0;i<3;i++){
        //     let id = curMatch()
        //     updateLottery(lossTeam(id))
        //     console.log("after=> ",global.matchs)
        // }
        // if(global.matchs.length == 0){console.log('end game')}
    // },1000)



io.on('connection', (socket)=>{
    console.log('new connection', socket.id)

    let usedQuestions = []; // مصفوفة لتخزين الأسئلة اللي ظهرت
    

    async function getNewQuestion() {
        if(global.isMatch == false) return

        try {
            // 1. نجيب ID مال سؤال واحد عشوائي مو مستخدم
            const excludeIds = usedQuestions.length > 0 ? usedQuestions : [0];
            const [questionRow] = await db.query(
                `SELECT id, question_text FROM questions WHERE id NOT IN (?) ORDER BY RAND() LIMIT 1`,
                [excludeIds]
            );

            if (questionRow.length === 0) {
                console.log("خلصت كل الأسئلة! راح نصفر القائمة.");
                usedQuestions = []; 
                return null;
            }

            const questionId = questionRow[0].id;
            const questionText = questionRow[0].question_text;

            // 2. هسة نجيب الخيارات الخاصة بهذا السؤال حصراً
            const [optionsRows] = await db.query(
                `SELECT id, option_text, is_correct FROM options WHERE question_id = ?`,
                [questionId]
            );

            // 3. ترتيب البيانات للرجوع
            const options = optionsRows.map(r => ({
                id: r.id,
                text: r.option_text
            }));

            const correctOption = optionsRows.find(r => r.is_correct === 1);

            usedQuestions.push(questionId);

            return {
                questionId,
                questionText,
                options,
                correctId: correctOption ? correctOption.id : null
            };

        } catch (err) {
            console.error("خطأ بجلب السؤال:", err);
        }
    }

    async function getqus(){
        if(global.noQusDatabase){
            return "DATABASE"
        }
        let question = null;
        let curQus = global.curQus;
        let qus = null;
        let count = global.question.length
        if(count == 0){
            for(;!global.qusFull;){
                count = global.question.length
                if(count == 2){
                    global.qusFull = true
                }
                qus = await getNewQuestion();
                if(qus != null){
                    global.question.push(qus)
                }else{
                    global.noQusDatabase = true
                }
            }
            global.numQus = count+1
        }
        // console.log("global == ", global.question)
        question = global.question[curQus];
        if(global.curQus == global.numQus){
            global.enoughQus = true
            io.emit('question', {enoughQus: global.enoughQus});
            return
        }else{
            global.curQus++;
        }

        if (question != null) {
            // console.log("question == ", question)
            io.emit('question', { qus: question.questionText, 
                options: question.options, 
                role: global.rolePlayer, 
                curQus: global.curQus, 
                numQus: global.numQus, 
                enoughQus: global.enoughQus});
        }
        
        return await question
    }
    
    socket.on('updateLottery', ()=>{
        io.emit('updateLottery', {teamA: true, teamAname: "كلية التربية للعلوم الصرفة", teamBname: "كلية علوم الحاسوب وتكنولوجيا المعلومات"})
    })
    
    socket.on('getTeam', ()=>{
        io.emit('getTeam', {teamA: global.teamA, teamB: global.teamB, role: global.rolePlayer})
    })

    socket.on('newMatch', ()=>{
        if(!global.isMatch){
            console.log('new match')
            updateLottery(lossTeam(global.matchid)) 
            curMatch()
            global.pointP1 = 0
            global.pointP2 = 0
            global.curQus = 0
            global.numQus = 3
            global.question = []
            global.qusFull = false
            global.enoughQus = false
            global.isMatch = true
            io.emit('newMatch')
        }else{
            console.log('match in running!!')
        }
    })

    socket.on('endMatch', ()=>{
        if(global.matchs.length == 0){
            console.log('endGAme!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
            io.emit('end')
        }

        saveScore(global.matchid)
        global.isMatch = false
    })

    socket.on('endgame', ()=>{
        io.emit('endgame')
    })

    socket.on('changeRole', ()=>{
        changeRole()
        console.log('![role] changed Role')
    })
        
    // Timer
    socket.on('timer',async ()=>{
        
        io.emit('showRole', {role : global.rolePlayer})

        global.timer = true
        question = await getqus()
        if(question == "DATABASE"){
            console.log("[X]no questions in database !!")
            // io.emit('endgame')
        }
        if(question != null){
            global.currectOption = question.correctId
        }

        time = 15 //timer value
        clearInterval(timeInterval)
        io.emit('timerAnimation')
        timeInterval = setInterval(() => {
            if(time < 0){
                clearInterval(timeInterval)
            }else{
                socket.broadcast.emit('showTime', {time: time})
                if(time != 0){time--}else{global.timer = false}
            }
        }, 1000);

    })

    socket.on('stopTimer',  ()=>{
        io.emit('stopTimerAnimation')
        clearInterval(timeInterval)
    })


    socket.on('reset', ()=>{
        global.Isanswer = false    
        console.log("[!]reset server")
        io.emit('reset')
    })

    
    socket.on('answer',(data)=>{
        if(global.timer && !global.Isanswer){
            global.answer = data.currentOption == global.currectOption
            global.Isanswer = true
            // socket.emit('active',{answer : global.answer})
            if(global.answer == true){
                if(data.playerid == '1'){
                    global.pointP1 += 1
                }else{
                    global.pointP2 += 1
                }
            }
            io.emit('active',{answer : global.answer, pointP1 : global.pointP1, pointP2 : global.pointP2, opId: data.currentOption})
        }
    })

    socket.on('player',()=>{
        console.log('player id = ', socket.id)
        if(global.users.length < 2){
            global.users.push(socket.id)
            socket.emit('playerId', {playerid : global.users.length})
        }
        // console.log('[Global ]player ids = ', global.users)
    })

    socket.on('client', ()=>{
        global.client = socket.id
        console.log('![c] client join')
    })

    socket.on('getpoint', ()=>{
        io.emit('getpoint', {pointA: global.pointP1, pointB: global.pointP2})
    })
    

    socket.on('getwinners', ()=>{
        io.emit('getwinners', {name1: global.win1st, name2: global.win2nd})
    })

    socket.on('start', ()=>{io.emit('start')})


    socket.on('saveLottery', (data)=>{
        lotteryData.m1 = data.m1
        lotteryData.m2 = data.m2
        lotteryData.m3 = data.m3
        lotteryData.m4 = data.m4
        lotteryData.m5 = data.m5
        lotteryData.m2Name = data.m2name
        lotteryData.m3Name = data.m3name
        lotteryData.m4Name = data.m4name
        lotteryData.m5Name = data.m5name
        lotteryData.level = data.level
        lotteryData.pos = data.pos
        console.log(lotteryData)
    })
    socket.on('loadLottery',()=>{
        io.emit('loadLottery',{
            m1: lotteryData.m1,m2: lotteryData.m2,m3: lotteryData.m3,m4: lotteryData.m4,m5: lotteryData.m5,
            m2name: lotteryData.m2Name,m3name: lotteryData.m3Name,m4name: lotteryData.m4Name,m5name: lotteryData.m5Name,
            level: lotteryData.level, pos: lotteryData.pos
        })
    })




// wait before start match
    socket.on('wait', ()=>{
        if(!global.set){
            setMT()
            curMatch()
            global.set = true
        }

        if(global.curQus != global.numQus){
            io.emit('wait')
        }else{
            io.emit('endMatch')
        }
    })
    socket.on('waitFinsh' ,()=>{
        io.emit('waitFinsh')
    })

    





    socket.on('disconnect', ()=>{
        console.log('disconnect:', socket.id)
    })
    
})//end connection


