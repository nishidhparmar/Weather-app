const express = require("express");
const bodyparser = require("body-parser");
const https = require("https");
const path = require('path');

const staticpath = path.join(__dirname,"/public");
// console.log(staticpath);
const app = express();

app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(staticpath));
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    res.render('index')

})

app.post("/Weather", (req, res) => {

    const city = req.body.city;
    const url = "https://api.openweathermap.org/data/2.5/weather?appid=0e926a75ef904b09e500ec958d3fc5de&units=metric&q=" + city + ",in";
    https.get(url, (response) => {
        response.on("data", (data) => {

            const weatherdata = JSON.parse(data);

            if (weatherdata.cod === '404') {
                return res.render("notfound",{
                    notfounderror:"City name is invalid"
                })

            } 
                const main = weatherdata.weather[0].main;
                const des = weatherdata.weather[0].description;
                const temp = weatherdata.main.temp;
                const icon = weatherdata.weather[0].icon;
                const country = weatherdata.sys.country;
                const name = weatherdata.name;
                const imgurl = "https://openweathermap.org/img/wn/" + icon + "@4x.png";


                res.render('city',{
                    city:name,
                    temp:temp,
                    description:des,
                    img:imgurl
                })
            

        });
    }).on('error', (e) => {
        console.error(e);
    });

});


app.post("/Area_Weather", (req, res) => {

    const zipcode = req.body.zipcode;
    const url = "https://api.openweathermap.org/data/2.5/weather?zip=" + zipcode + ",in&units=metric&appid=0e926a75ef904b09e500ec958d3fc5de";
    https.get(url, (response) => {
        response.on('data', (data) => {
            const weatherdata = JSON.parse(data);
            if(weatherdata.cod === "404"){
               return res.render('notfound',{
                    notfounderror : "Zipcode is invalid"
                })
            }
            const main = weatherdata.weather[0].main;
            const des = weatherdata.weather[0].description;
            const temp = weatherdata.main.temp;
            const icon = weatherdata.weather[0].icon;
            const country = weatherdata.sys.country;
            const name = weatherdata.name;
            const imgurl = "https://openweathermap.org/img/wn/" + icon + "@4x.png";

            res.render('city',{
                city:name,
                temp:temp,
                description:des,
                img:imgurl
            })
            // res.write("<h1 >" + temp + "&#176; Temperature in " + name + "</h1>");

            // res.write("<h2>The weather is " + des + "</h2>");
            // res.write("<img src=" + imgurl + ">");

            // res.send();
        });

    }).on('error', (e) => {
        console.error(e);
    });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, () => console.log("server is running on 3000"));

