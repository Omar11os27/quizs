const express = require('express');
const http = require('http'); 
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app); // نربط Express بسيرفر الـ HTTP
const db = require('./database'); // ملف الاتصال اللي سويناه

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



let time = null;
let timeInterval = null;

io.on('connection', (socket)=>{
    console.log('new connection', socket.id)


    let usedQuestions = []; // مصفوفة لتخزين الأسئلة اللي ظهرت

    async function getNewQuestion() {
        try {
            // SQL Query: يجيب سؤال عشوائي مو موجود بالـ usedQuestions
            const query = `
                SELECT q.id AS q_id, q.question_text, 
                    o.id AS o_id, o.option_text, o.is_correct
                FROM questions q
                JOIN options o ON q.id = o.question_id
                WHERE q.id NOT IN (?) 
                ORDER BY RAND() 
                LIMIT 4; -- هنا نحدد عدد الخيارات (مثلاً 4)
            `;

            // إذا المصفوفة فارغة، نمرر [0] حتى لا يضرب الـ Query
            const excludeIds = usedQuestions.length > 0 ? usedQuestions : [0];
            
            const [rows] = await db.query(query, [excludeIds]);

            if (rows.length === 0) {
                console.log("خلصت كل الأسئلة! راح نصفر القائمة.");
                usedQuestions = []; // نصفرها إذا خلصت الأسئلة
                return null;
            }

            // 1. استخراج نص السؤال
            const questionId = rows[0].q_id;
            const questionText = rows[0].question_text;

            // 2. استخراج الاختيارات كلها
            const options = rows.map(r => ({
                id: r.o_id,
                text: r.option_text
            }));

            // 3. معرفة الخيار الصح (نخزنه بالسيرفر بس)
            const correctOption = rows.find(r => r.is_correct === 1);

            // إضافة السؤال للقائمة المستخدمة حتى ما يتكرر
            usedQuestions.push(questionId);

            return {
                questionId,
                questionText,
                options,
                correctId: correctOption.o_id
            };

        } catch (err) {
            console.error("خطأ بجلب السؤال:", err);
        }
    }

    let question = null;
    async function getqus(){
        question = await getNewQuestion();
        if (question) {
            io.emit('question', { qus: question.questionText, options: question.options });
        }else{
            io.emit('question', { qus: false});
        }
    }
    getqus()









    // Timer
    socket.on('timer', ()=>{
        time = 3 //timer value
        clearInterval(timeInterval)

        timeInterval = setInterval(() => {
            if(time < 0){
                clearInterval(timeInterval)
            }else{
                io.emit('showTime', {time: time})
                if(time != 0){time--}
            }
        }, 1000);

    })

    socket.on('stopTimer',  ()=>{
        clearInterval(timeInterval)
    })

    

    socket.on('disconnect', ()=>{
        console.log('disconnect:', socket.id)
    })
})
