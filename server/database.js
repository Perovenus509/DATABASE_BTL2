var mysql = require('mysql');
var connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'12345678',
    database:'qlktx'
});
var connect = () =>{
    connection.connect((err)=>{
        if (!err){
            console.log("Database is connected!!!")
        }else{
            console.log("Database connect error!!")
        }
    })
}
var closeDB =()=>{
    connection.end((err)=>{
        if(!err){
            console.log("Closed Databse!!");
        }
    });
}
exports.getAllEmployee = (callbackQuery)=>{
    connect();
    connection.query("SELECT * FROM employee",(err, results,fileds)=>{
        if(!err){
            callbackQuery(results)
        }else{
            console.log(err)
        }
    })
}