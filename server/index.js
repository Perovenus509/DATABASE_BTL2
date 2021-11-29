const express = require("express");
const bodyParser = require("body-parser")
const app = express();
const mysql = require("mysql")
const cors = require("cors")
const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'12345678',
    database:'qlktx',
    dateStrings: true
});
app.use(cors());
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}));
app.listen(3000,()=>{
  console.log("running port 3000")
})
app.get('/employee',(req, res)=>{
    db.query("SELECT * FROM employee;",(err, results)=>{
        if (err) console.log(err);
        else res.json(results);
    });
});
app.get('/manage',(req, res)=>{
    db.query("SELECT * FROM employee WHERE Job ='Trưởng nhà';",(err, results)=>{
        if (err) console.log(err);
        else res.json(results);
    });
});
app.get('/cashier',(req, res)=>{
    db.query("SELECT * FROM employee WHERE Job ='Thu ngân';",(err, results)=>{
        if (err) console.log(err);
        else res.json(results);
    });
});
app.get('/securityguard',(req, res)=>{
    db.query("SELECT * FROM employee WHERE Job ='Bảo vệ';",(err, results)=>{
        if (err) console.log(err);
        else res.json(results);
    });
});
app.get('/managetime',(req, res)=>{
    db.query("SELECT  Staff_ID,Full_name,Gender,BName,Start_date,End_date FROM employee,manage_time WHERE Staff_ID = BM_ID	AND curdate() BETWEEN Start_date AND End_date;",(err, results)=>{
        if (err) console.log(err);
        else res.json(results);
    });
});
app.post("/insertemployee",(req, res)=>{
    const Staff_ID = req.body.Staff_ID
    const Full_name = req.body.Full_name
    const SSN = req.body.SSN
    const DoB = req.body.DoB
    const Gender = req.body.Gender
    const EmpUname = req.body.EmpUname
    const Job = req.body.Job
    const sqlInsertemployee = "INSERT INTO employee (Staff_ID,Full_name,SSN,DoB,Gender,EmpUname,Job) VALUES (?,?,?,?,?,?,?)"
    db.query(sqlInsertemployee, [Staff_ID,Full_name,SSN,DoB,Gender,EmpUname,Job], (err,result)=>{
        if(err){
            console.log(err)
            res.send("Đã xảy ra lỗi")
        }
        else{
            res.send("Đã thêm")
        }
    })

    
})
app.post("/findemployee",(req, res)=>{
    const Staff_ID = req.body.Staff_ID
    const Full_name = req.body.Full_name
    const EmpUname = req.body.EmpUname
    var sqlFind
    if(Staff_ID){
            sqlFind = "SELECT * FROM employee WHERE Staff_ID = ?"
            db.query(sqlFind,[Staff_ID],(err, results)=>{
                if (err) console.log(err);
                else {

                    console.log(results)
                    res.json(results)
                };
            });
    }else{
        if(Full_name){
            sqlFind = "SELECT * FROM employee WHERE Full_name = ?"
            db.query(sqlFind,[Full_name],(err, results)=>{
                if (err) console.log(err);
                else {

                    console.log(results)
                    res.json(results)
                };
            });
        }else{
            if(EmpUname){
                sqlFind = "SELECT * FROM employee WHERE EmpUname = ?"
                db.query(sqlFind,[EmpUname],(err, results)=>{
                    if (err) console.log(err);
                    else {
    
                        console.log(results)
                        res.json(results)
                    };
                });
            }else{
                console.log("chưa nhập unmae")
            }
            console.log("chưa nhập fullname")
        }
        console.log("chưa nhập id")
    }
})
app.post("/deleteemployee",(req, res)=>{
    const Staff_ID = req.body.Staff_ID
    const sqlDel = "DELETE FROM employee WHERE Staff_ID = ?"
    db.query(sqlDel, [Staff_ID], (err,result)=>{
        if (err) {
          console.log(err);
          res.send("Không được xóa");
        }
        else {
          res.send("Đã xóa");
        }
    })  
})
app.post("/updateemployee",(req, res)=>{
    const id = req.body.Staff_ID
    const name = req.body.Full_name
    const dob = req.body.DoB
    const ssn = req.body.SSN
    const gender = req.body.Gender
    const uname = req.body.EmpUname
    const sqlUpdateemployee = "UPDATE employee SET Full_name = ?,DoB = ?,SSN = ?,Gender = ?,EmpUname = ? WHERE Staff_ID = ?"
    db.query( sqlUpdateemployee, [name,dob,ssn,gender,uname,id], (err,result)=>{
        if (err){
          console.log(err);
          res.send("Cập nhật thất bại")
        }
        else res.send("Cập nhật thành công!")
    })  
    console.log(sqlUpdateemployee)
})
app.post("/findsecurity",(req,res)=>{
    const bname = req.body.Bname
    const ngay =  req.body.day
    var shift = req.body.shift
    if (shift === "Sáng"){
      shift = "Morning"
    }else if(shift === "Tối"){
      shift= "Evening"
    }
    const sqlfindsecurity = "SELECT Staff_ID,Full_name,DoB,SSN,Gender,EmpUname,Job FROM  employee, on_call_schedule WHERE Staff_ID = SG_ID AND BName = ? AND Shift = ? and date = ?;"
    db.query(sqlfindsecurity,[bname,shift,ngay],(err, results)=>{
        if (err) res.send([]);
        else {

            console.log(results)
            res.json(results)
        };
    });
})
/// phần của nghĩa
app.get("/building", (req, res) => {
    db.query("select Name from building", (err, result) => {
      if (err) console.log(err);
      else res.send(result);
    });
  });
  
  app.post("/room", (req, res) => {
    const building = req.body.building;
    db.query(
      "SELECT Room_ID FROM room where B_Name = ?",
      [building],
      (err, result) => {
        if (err) console.log(err);
        else res.send(result);
      }
    );
  });
  
  app.get("/students", (req, res) => {
    db.query(
      "select * from student left join rent_info on StudentID = R_StudentID where End_date > curdate() order by School,R_BName",
      (err, result) => {
        if (err) console.log(err);
        else res.send(result);
      }
    );
  });
  
  app.get("/allstudents", (req, res) => {
    db.query(
      "select * from student left join rent_info on StudentID = R_StudentID group by StudentID  order by StudentID",
      (err, result) => {
        if (err) console.log(err);
        else res.send(result);
      }
    );
  });
  
  app.post("/searchstudent", (req, res) => {
    const id = req.body.id;
    db.query(
      "select * from student left join rent_info on StudentID = R_StudentID where StudentID = ?",
      [id],
      (err, result) => {
        if (err) console.log(err);
        else res.send(result);
      }
    );
  });
  
  app.put("/updatestudent", (req, res) => {
    const studentID = req.body.id;
    const fullname = req.body.fullname;
    const ssn = req.body.ssn;
    const gender = req.body.gender;
    const dob = req.body.dob;
    const school = req.body.school;
    const schoolyear = req.body.schoolyear;
  
  
    db.query(
      "update student set Full_name = ?, SSN = ?, Gender = ?, DoB = ?, School = ?, SchoolYear = ? where StudentID = ?",
      [fullname, ssn, gender, dob, school, schoolyear, studentID],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send(result);
        }
      }
    );
  });
  
  app.put("/updaterent", (req, res) => {
    const studentID = req.body.studentID;
    const BName = req.body.BName;
    const RoomID = req.body.RoomID;
  
    db.query(
      "insert into rent value(?,?,?)",
      [studentID, BName, RoomID],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send(result);
        }
      }
    );
  });
  
  app.post("/updaterentinfo", (req, res) => {
    const studentID = req.body.studentID;
    const BName = req.body.BName;
    const RoomID = req.body.RoomID;
    const month = req.body.month;
    db.query(
      "call update_rent(?,?,?,?);",
      [studentID, BName, RoomID, month],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send(result);
        }
      }
    );
  });
  
  app.post("/addroom", (req, res) => {
    const studentID = req.body.id;
    const fullname = req.body.fullname;
    const ssn = req.body.ssn;
    const gender = req.body.gender;
    const dob = req.body.dob;
    const school = req.body.school;
    const schoolyear = req.body.schoolyear;
    const bname = req.body.building;
    const room = req.body.room;
    const month = req.body.month;
  
    const leader = 0;
  
    db.query(
      "call assign_student_to_room(?,?,?,?,?,?,?,?,?,?,?)",
      [
        studentID,
        fullname,
        ssn,
        gender,
        dob,
        school,
        schoolyear,
        bname,
        room,
        month,
        leader,
      ],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send(result);
        }
      }
    );
  });
  app.delete("/deletestudent/:id", (req, res) => {
    const id = req.params.id;
    db.query("delete from student where StudentID = ?", id, (err, result) => {
      if (err) console.log(err);
      else res.send(result);
    });
  });
// hết phần của nghĩa
//Phần của Hưng
app.get('/building_config',(req, res)=>{
  const selectQuery = "SELECT BName,Latest_W_price_index,Latest_E_price_index,Last_config_date,BM_ID "
  const fromQuery1 = "FROM building,config WHERE Name = BName AND W_price_index = Latest_W_price_index "
  const fromQuery2 = "AND E_price_index = Latest_E_price_index ORDER BY BName;"
  const sqlStatement = selectQuery + fromQuery1 + fromQuery2;
  db.query(sqlStatement, (err, results)=>{
      if (err) console.log(err);
      else res.json(results);
  });
});

app.get('/room1',(req, res)=>{
  db.query("SELECT * FROM room ORDER BY B_Name;",(err, results)=>{
      if (err) console.log(err);
      else res.json(results);
  });
});

app.get('/config',(req, res)=>{
  db.query("SELECT * FROM config ORDER BY BName;",(err, results)=>{
      if (err) console.log(err);
      else res.json(results);
  });
});

app.get('/rent_info',(req, res)=>{
  db.query("SELECT * FROM rent_info ORDER BY R_BName;",(err, results)=>{
      if (err) console.log(err);
      else res.json(results);
  });
});

app.post('/api/insert_on_config', (req, res) => {
  
  const BM_ID = req.body.BM_ID;
  const BName = req.body.BName;
  const Last_config_date = req.body.Last_config_date;
  const Latest_W_price_index = req.body.Latest_W_price_index;
  const Latest_E_price_index = req.body.Latest_E_price_index;

  const sqlInsert = "INSERT INTO config VALUES (?,?,?,?,?)"
  db.query(sqlInsert, [BM_ID, BName, Last_config_date, Latest_W_price_index, Latest_E_price_index],
      (err, result) => {
          console.log(err);
      });
});

app.post('/api/update_for_room', (req, res) => {
  
  const bname = req.body.B_Name
  const roomID = req.body.Room_ID
  const capacity = req.body.Capacity
  const amountOfMember = req.body.Amount_of_member
  const isAirconditioner = req.body.isAirconditioner

  const sqlUpdate = "UPDATE room SET Capacity = ?, Amount_of_member = ?, is_Air_Conditioner = ? WHERE B_Name = ? AND Room_ID = ?"
  db.query(sqlUpdate, [capacity, amountOfMember, isAirconditioner, bname, roomID],
      (err, result) => {
          console.log(err);
      });
  console.log(sqlUpdate)
});

app.post('/api/delete_from_rent_info', (req, res) => {
  
  const R_StudentID = req.body.R_StudentID
  const R_BName = req.body.R_BName
  const R_Room_ID = req.body.R_Room_ID
  const Start_date = req.body.Start_date
  const End_date = req.body.End_date
  const isRoomleader = req.body.isRoomleader

  const sqlInsert = "DELETE FROM rent_info WHERE R_StudentID = ? AND R_BName = ? AND R_Room_ID = ? AND Start_date = ? AND End_date = ? AND isRoomleader = ?"
  db.query(sqlInsert, [R_StudentID, R_BName, R_Room_ID, Start_date, End_date, isRoomleader],
      (err, result) => {
          console.log(err);
      });
      console.log(sqlInsert);
});

app.post('/api/search_in_rent_info', (req, res) => {

  const searchKey = req.body.searchKey

  const sqlSearch = "SELECT * FROM rent_info WHERE R_StudentID = ? OR R_BName = ? OR R_Room_ID = ?"
  db.query(sqlSearch, [searchKey, searchKey, searchKey],
      (err, result) => {
          console.log(err);
          if(err) res.send(false);
          else res.send(result);
      });
      console.log(sqlSearch);
});
//Hết phần của Hưng