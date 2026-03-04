const express = require('express');
const http = require('http'); 
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app); // نربط Express بسيرفر الـ HTTP
const db = require('./database'); // ملف الاتصال اللي سويناه
const { error } = require('console');
const { emit } = require('cluster');

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
// ipv4 10.229.50.248(cmd ipconfig)
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
    numQus: 0,
    qusFull: false,
    enoughQus: false,
    isMatch: true,
    noQusDatabase: false
}

io.on('connection', (socket)=>{
    console.log('new connection', socket.id)

    let usedQuestions = []; // مصفوفة لتخزين الأسئلة اللي ظهرت
    

    async function getNewQuestion() {
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
        // console.log("numQus: ",global.numQus,"  curQus",global.curQus)
        // console.log(global.question)
        // console.log(question)
        if (question != null) {
            // console.log("question == ", question)
            io.emit('question', { qus: question.questionText, options: question.options, role: global.rolePlayer, curQus: global.curQus, numQus: global.numQus, enoughQus: global.enoughQus});
        }
        // else{
        //     io.emit('question', { qus: false, enoughQus: global.enoughQus});
        // }
        return await question
    }

    function changeRole(){
        if(global.rolePlayer == '1'){
            global.rolePlayer = '2'
        }else{
            global.rolePlayer = '1'
        }
    }

    // socket.on('start', ()=>{
    //     // question

    //     // timer
    // })

    socket.on('newMatch', ()=>{
        if(!global.isMatch){
            global.curQus = 0
            global.numQus = 0
            global.question = []
            global.qusFull = false
            global.enoughQus = false
            global.isMatch = true
            io.emit('toMain')
        }
    })

    socket.on('endMatch', ()=>{
        global.isMatch = false
        io.to(global.client).emit('endMatch')
    })

    socket.on('changeRole', ()=>{
        // changeRole()
        console.log('![role] changed Role')
    })
        
    // Timer
    // socket.on('timer',async ()=>{
        
        
    // })

    socket.on('stopTimer',  ()=>{
        io.to(global.client).emit('stopTimerAnimation')
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
            socket.emit('active',{answer : global.answer})
            if(global.answer == true){
                if(data.playerid == '1'){
                    global.pointP1 += 1
                }else{
                    global.pointP2 += 1
                }
            }
            io.to(global.client).emit('active',{answer : global.answer, pointP1 : global.pointP1, pointP2 : global.pointP2, opId: data.currentOption})
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








    // setTeam
    async function getOp(){
        let res = await db.query("select * from teams")
        return res
    }
    socket.on('getOp', async ()=>{
        let res = await getOp()
        socket.emit('getOp', {res : res})
    })

    socket.on('setTeam', data =>{
        io.to(global.client).emit('setTeam', {teamA: data.teamA, teamB: data.teamB})
    })
    // setTeam





    socket.on('disconnect', ()=>{
        console.log('disconnect:', socket.id)
    })
})
