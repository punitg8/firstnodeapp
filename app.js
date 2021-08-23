const fs = require("fs");
const express = require("express");
const { get } = require("http");

const app = express();
app.use(express.json());

//Data processing from file
const getdata = () => {
  return new Promise((resolve, reject) => {
    fs.readFile("database.json", (err, result) => {
      if (err) {
        reject(err);
      } else {
        const data = JSON.parse(result).Userbase;
        resolve(data);
      }
    });
  });
};

const putdata = (data) => {
  const temp = { Userbase: data };
  return new Promise((resolve, reject) => {
    fs.writeFile("database.json", JSON.stringify(temp), (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

//Printing all the students info
app.get("/getall", async (req, res) => {
  const data = await getdata();
  res.send({ Userbase: data });
});
//Printing only the req student info
app.get("/get/:id", async (req, res) => {
  const data = await getdata();
  console.log(req.params.id);
  res.send(data.find((person) => person.rollno === Number(req.params.id)));
});
//Adding a new student to the data
app.post("/add", async (req, res) => {
  let data = await getdata();
  console.log(req);
  const { name, rollno, marks } = req.body;
  data.push({ name, rollno, marks });
  await putdata(data);
  res.send({ status: "Data added" });
});
//Deleting a user
app.delete("/delete/:id", async (req, res) => {
  let data = await getdata();
  var todelete = data.find((person) => person.rollno === Number(req.params.id));
  data = data.filter((person) => person.rollno !== Number(req.params.id));
  await putdata(data);
  res.send({ status: `Deleted person is ${todelete.name} with roll no ${todelete.rollno}` });
});
//Update a user
app.put("/update", async (req, res) => {
  let data = await getdata();
  const { name, rollno, marks } = req.body;
  for (var i = 0; i < data.length; i++) {
    if (data[i].rollno == rollno) {
      data[i].name = name;
      data[i].marks = marks;
    }
  }
  await putdata(data);
  res.send({ status: "Data Updated" });
});
app.listen(5500, () => {
  console.log("Currently on port 5500");
});
