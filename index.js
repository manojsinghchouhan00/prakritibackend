const express = require('express')
const connectDb = require("./db/config")
const cors = require('cors');

const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 5000;
const dev_mode = process.env.DEV_MODE;

const Role = require('./model/role');
const User = require('./model/user');
const Diet = require('./model/foodDiet');

// app.use(cors(express.json()));
const app = express()
app.use(express.json())
app.use(cors())

// ------------Users collectiion route------------------------
app.post("/login", async (req, resp) => {
    if (req.body.loginId && req.body.password) {
        try {
            //   //  this logic for case insensetive // //

            // const caseInsensitiveIdEmamil = new RegExp(req.body.loginId, "i");
            // const data = await User.findOne({loginId:caseInsensitiveIdEmamil, password :req.body.password}).select("-password");

            const data = await User.findOne(req.body).select("-password")
            if (data === null) {
                resp.send({ message: "No result found" })
            } else {
                // console.log(data)
                resp.send(data)
            }
        } catch (err) {
            console.log("Error in login Api", err)
        }
    } else if (req.body.loginId === "undefined") {
        resp.send({ message: "Enter Email id" })
    } else if (req.body.password === "undefined") {
        resp.send({ message: "Enter Password" })
    } else {
        resp.send({ message: "Enter LoginId And Password" })
    }
})
// ---------------------- user list-------------------------
app.get("/user", async (req, resp) => {
    try {
        let data = await User.find();
        resp.send(data)
    } catch (err) {
        console.log("Error on server", err)
        resp.status(500).send({ message: "Internal server error", error: err.message });

    }
})
// --------------------Create user----------------------------------
app.post("/user", async (req, resp) => {
    try {
        let data = new User(req.body);
        let result = await data.save();
        resp.send(result)
    } catch (err) {
        if (err?.errors?.roleId?.message) {
            resp.send(err?.errors?.roleId?.message)
        } else {
            resp.send({ message: "Email id already exist" })
        }
        // console.log("Register user :-", err)
    }
})
// --------------------Delete user----------------------------------
app.delete("/user/:id", async (req, resp) => {
    try {
        // console.log("req in user", req.params)
        let data = await User.deleteOne({ _id: req.params.id });
        resp.send(data);
    } catch (err) {
        console.log("Error in delete user", err)
    }
})
// --------------------Update user----------------------------------
app.put("/user/:id", async (req, resp) => {
    try {
        // console.log("update id",req.params)
        let data = await User.updateOne({ _id: req.params.id }, { $set: req.body })
        resp.send(data)
    } catch (err) {
        console.log("Error in user update", err)
        resp.send({ message: "user id exist" })
    }
})
app.get("/user/:id", async (req, resp) => {
    try {
        let data = await User.findOne({ _id: req.params.id });
        resp.send(data)
    } catch (err) {
        resp.send({ message: "Send correct id" })
    }

})
// --------------------Search user----------------------------------
app.get("/user/search/:key", async (req, resp) => {
    const caseInsensitiveKey = new RegExp(req.params.key, "i");
    let data = await User.find({
        $or: [
            { firstName: { $regex: caseInsensitiveKey } },
            { lastName: { $regex: caseInsensitiveKey } },
            { loginId: { $regex: caseInsensitiveKey } }
        ]
    })
    resp.send(data)
})
// ------------Users collectiion End route------------------------
// ------------Diet collectiion Start route------------------------
app.post('/diet', async (req, resp) => {
    try {
        let data = new Diet(req.body);
        data = await data.save();
        console.log(data)
        resp.send(data)
    } catch (error) {
        console.log(error)
        // console.log("Diet Catch block erroe", error.errors.mobileNo.message)
        // if (error?.errors?.mobileNo?.message) {
        //     resp.send({ message: error.errors.mobileNo.message })
        // } else {
            // resp.send(error.message)
            resp.send({ message: "Diet already exist" })
        // }
    }
})
app.put("/diet/:id", async (req, resp) => {
    console.log("Diet put api")
    try {
        let data = await Diet.updateOne({ _id: req.params.id }, { $set: req.body })
        resp.send(data)
    } catch (error) {
        console.log("Diet put api catch block")
        resp.send({ message: 'Diet already exiest' })
    }
})

app.delete("/diet/:id", async (req, resp) => {
    try {
        let data = await Diet.deleteOne({ _id: req.params.id })
        resp.send(data)
    } catch (error) {
        resp.send({ message: "Id is not there / already deleted" });
    }
})
app.get("/diet", async (req, resp) => {
    try {
        let data = await Diet.find();
        resp.send(data)
    } catch (error) {
        console.log(error)
        resp.send({ message: "Look the console" })
    }
})
app.get("/diet/:id", async (req, resp) => {
    try {
        let data = await Diet.findOne({ _id: req.params.id })
        resp.send(data)
    } catch (error) {
        console.log("diet serach one")
        resp.send({ message: "Put the correct id" })
    }
})
app.get("/diet/search/:key", async (req, resp) => {
    const caseInsensitiveKey = new RegExp(req.params.key, "i");
    let data = await Diet.find({
        $or: [
            { name: { $regex: caseInsensitiveKey } },
            { nameOut: { $regex: caseInsensitiveKey } },
        ]
    })
    resp.send(data)
})
// ------------Diet collectiion Start route------------------------

// ------------Role collectiion start route------------------------
app.post('/role', async (req, resp) => {
    try {
        let data = new Role(req.body);
        data = await data.save();
        console.log(data)
        resp.send(data)
    } catch (error) {
        // if (error.keyPattern.name === 1) {
        //     resp.send({ message: "Role already exist" })
        // } else {
            resp.send(error)
        // }
    }
})
app.get('/role', async (req, resp) => {
    try {
        let data = await Role.find()
        resp.send(data)
    } catch (error) {
        resp.send(error)
    }
})
app.get('/role/:id', async (req, resp) => {
    try {
        let data = await Role.findOne({ _id: req.params.id });
        resp.send(data)
    } catch (error) {
        resp.send(error)
    }
});
app.get('/role/search/:key', async (req, resp) => {
    const caseInsensitiveKey = new RegExp(req.params.key)
    try {
        let data = await Role.find({
            $or: [
                { name: { $regex: caseInsensitiveKey } },
                { discription: { $regex: caseInsensitiveKey } }
            ]
        });
        resp.send(data)
    } catch (error) {
        resp.send(error)
    }
})
app.delete('/role/:id', async (req, resp) => {
    try {
        let data = await Role.find({ _id: req.params.id })
        resp.send(data)
    } catch (error) {
        resp.send(error)
    }
})
app.put('/role/:id', async (req, resp) => {
    try {
        let data = await Role.updateOne({ _id: req.params.id }, { $set: req.body })
        resp.send(data)
    } catch (error) {
        resp.send(error)
    }
})
// ------------Role collectiion End route------------------------


app.listen(PORT, () => {
    console.log(` Server run ${dev_mode} with port http://localhost:${PORT}`)
})
