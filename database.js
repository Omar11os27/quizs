const mysql = require('mysql2');

// إنشاء حوض اتصالات (Connection Pool) 
// هذا الخيار أفضل للأداء من الاتصال الفردي
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',      
  password: '',     
  database: 'quiz_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// تحويل الـ pool ليعمل بنظام الـ Promises 
// حتى تستخدم async/await وكودك يصير حديث ونظيف
const promisePool = pool.promise();

console.log("تم تهيئة حوض الاتصال بقاعدة البيانات...");

module.exports = promisePool;