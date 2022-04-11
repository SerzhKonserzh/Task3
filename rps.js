var CryptoJS=require('crypto-js');
var rand=require("csprng");
const prompt = require("prompt-sync")();
const asTable = require("as-table");
const underscore = require('underscore');
const {Random} = require("random-js");
class Main{
    constructor(){
        this.startCheck();
        this.moves=[];
        for(let i=2;i<process.argv.length;i++){
            this.moves.push(process.argv[i]);
        }
        this.rules = new Rules();
        this.rules.setRules(this.moves);
        this.text = "";
    }    
    isRepeating(moves){
        let test = underscore.uniq(moves);
        if(test.length==moves.length)
            return false;
        else
            return true;
    }
    startCheck(){ 
        if(process.argv.length%2==0||process.argv.length<=3||this.isRepeating(process.argv)){
            console.log("Error. There are such rules to follow: \n- Amount of arguments shold be odd.\n- Amount of arguments shold be greater than one.\n- Arguments shouldn't repeat.\n Example: node rps.js 1 2 3");
            process.exit();
        }
    }
    printMenu(moves){
        console.log("Available moves:");
        moves.forEach((item,i)=>{
            console.log(`${i+1} - ${item}`);
        })
        console.log("0 - exit");
        console.log("? - help");
    }
    input(){
        do{
            this.text=prompt("Enter your move: ")
            if(this.text<=this.moves.length&&parseInt(this.text)){
                break;
            }else if(this.text=="?"){
                console.log(new Table(this.moves,this.rules).table);
                continue;
            }else if(this.text=='0'){
                process.exit();
            }
        }while(true)
    }
    main(){
        let pcMove=Object.keys(this.rules.gameRules)[new Random().integer(0,this.moves.length-1)];
        let crypt=new KeyHmac(pcMove);
        console.log(`HMAC: ${crypt.hmac}`);
        this.printMenu(this.moves);
        this.input();
        let playerMove=Object.keys(this.rules.gameRules)[this.text-1];
        console.log(`Your move: ${playerMove}`);
        console.log(`Computer move: ${pcMove}`);
        console.log(this.rules.gameRules[[playerMove]][pcMove]);
        console.log(`HMAC key: ${crypt.key}`);
        process.exit();
    }
}
class Rules{
    constructor(){
        this.gameRules = {};
    }
    setRules(rules){
        rules.forEach((item,i)=>{
            this.gameRules[item] = {
                [item]: "Draw",
            };
            for(let j=1;j<=(rules.length-1)/2;j++){
                this.gameRules[item][rules[(i+j)%rules.length]]="Lose";
                this.gameRules[item][rules[(i+j+(rules.length-1)/2)%rules.length]]="Win";
            }
        })
    }
}
class KeyHmac{
    constructor(move){
        this.key=rand(300,16);
        this.hmac=CryptoJS.HmacSHA256(move,this.key);
    }
}
class Table{
    constructor(moves,rules){
        let form=[];
        for(let i = 0; i<moves.length; i++){
            form.push(Object.assign({" ": moves[i]},rules.gameRules[Object.keys(rules.gameRules)[i]]));
        }
        this.table = asTable(form);
    }
}
let main = new Main().main();




