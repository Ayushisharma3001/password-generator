const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");

const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numberCheck=document.querySelector("#numbers");
const symbolCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateButton");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|\:;"<,>.?/';

let password="";
let passwordLength=10;
let checkCount=0;
handleSlider();
// set strength colour to grey
setIndicator("#ccc");
// set password length with slider

// password length ko ui mai reflect krwata h
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength; 

    const min = inputSlider.min;
    const max = inputSlider.max;
    // width size
    inputSlider.style.backgroundSize = ((passwordLength-min )*100/(max-min)) +"% 100%";
} 


function setIndicator(color){
      indicator.style.backgroundColor=color;
    //   shadow add
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;

}

function getRandomInteger(min,max){
     return  Math.floor(Math.random() * (max-min))+min;
}

function generateRandomNumber(){
    return getRandomInteger(0,9);
}

function generateLowerCase(){
    return  String.fromCharCode (getRandomInteger(97,123));
}

function generateUpperCase(){
    return  String.fromCharCode (getRandomInteger(65,91));
}

function generateSymbol(){
     const randNum = getRandomInteger(0,symbols.length);
     return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper= false;
    let hasLower= false;
    let hasNum= false;
    let hasSym= false;
    if(uppercaseCheck.checked) hasUpper= true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numberCheck.checked) hasNum=true;
    if(symbolCheck.checked) hasSym=true;

if( hasUpper && hasLower && (hasNum || hasSym ) && passwordLength>=8){
    setIndicator("#0f0");
}
else if((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength>=6){
    setIndicator("#ff0");
}
else{
    setIndicator("#f00");
}

}

function shufflePassword(array){
    // fisher yates method
    for(let i = array.length-1 ; i>0 ;i--){
        // finding random index
      const j=Math.floor(Math.random() * (i+1));
    //   swap i and j value
      const temp=array[i];
      array[i]=array[j];
      array[j]=temp;
    }
    let str="";
    array.forEach((el) => (str += el));
    return str;
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";
    }
    catch(e){
     copyMsg.innerText="failed";
    }
    // to make copy span visible
    copyMsg.classList.add("active");

    setTimeout(() =>{
    copyMsg.classList.remove("active");
    },2000);
}

function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
            checkCount++;
    });
    // special case
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) =>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})

inputSlider.addEventListener('input',(e) =>{
    passwordLength=e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copyContent();
    }
})

generateBtn.addEventListener('click',()=>{
// none of the checkbox is selected
if(checkCount <= 0)
     return;

if(passwordLength < checkCount){
    passwordLength=checkCount;
    handleSlider();
} 

console.log("starting the journey");

// new password find

// empty old password
password="";

// let's put the mentioned checkboxes
// if(uppercaseCheck.checked){
//     password += generateUpperCase();
// }
// if(lowercaseCheck.checked){
//     password += generateLowerCase();
// }
// if(numberCheck.checked){
//     password += generateRandomNumber();
// }
// if(symbolCheck.checked){
//     password += generateSymbol();
// }

let funcArr=[];

if(uppercaseCheck.checked)
    funcArr.push(generateUpperCase);

if(lowercaseCheck.checked)
    funcArr.push(generateLowerCase);

if(numberCheck.checked)
    funcArr.push(generateRandomNumber);

if(symbolCheck.checked)
    funcArr.push(generateSymbol);

// compulsory add

for(let i=0;i<funcArr.length;i++){
    password += funcArr[i]();
}
console.log("compulsory addition done");

// remaining addition

for(let i=0;i < passwordLength - funcArr.length;i++){
     let randIndex= getRandomInteger(0, funcArr.length);
    //  console.log("random index" + randIndex);
     password += funcArr[randIndex]();
}

console.log("remaining addition done");
// shuffle the password

password = shufflePassword(Array.from(password));

console.log("shuffling done");

// show
passwordDisplay.value=password;

console.log("UI addition done");
// calculate strength

calcStrength();

});