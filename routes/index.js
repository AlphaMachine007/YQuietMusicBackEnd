const user = require("./user")
const mainContent = require("./mainContent")
const search = require("./search")
const music = require("./music")
const playMusic = require("./playMusic")
const chat = require("./chat")
module.exports = (app)=>{
    app.use("/user",user);
    app.use("/mainContent",mainContent);
    app.use("/search",search);
    app.use("/music",music);
    app.use("/playMusic",playMusic);
    app.use("/chat",chat);
}