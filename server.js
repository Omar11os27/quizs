const express = require('express');
const http = require('http'); 
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app); // نربط Express بسيرفر الـ HTTP
const db = require('./database'); // ملف الاتصال اللي سويناه
const { error } = require('console');

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
server.listen(port, () => {
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

app.get("/player", (req, res) => {
    res.render('player')
})

let time = null;
let timeInterval = null;

let global = {
    currectOption: null,
    timer: false,
    answer: false
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

    let question = null;
    async function getqus(){
        question = await getNewQuestion();
        
        if (question != null) {
            io.emit('question', { qus: question.questionText, options: question.options });
        }else{
            // io.emit('question', { qus: false});
        }
        return await question
    }

        
    // Timer
    socket.on('timer',async ()=>{
        global.timer = true
        question = await getqus()
        global.currectOption = question.correctId
        time = 10 //timer value
        clearInterval(timeInterval)

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
        clearInterval(timeInterval)
    })


    let Isanswer = false
    socket.on('answer',(data)=>{
        if(global.timer && !Isanswer){
            console.log(data.currentOption == global.currectOption)
            global.answer = data.currentOption == global.currectOption
            Isanswer = true
            io.emit('active',{answer : global.answer})
        }
    })


    socket.on('disconnect', ()=>{
        console.log('disconnect:', socket.id)
    })
})
