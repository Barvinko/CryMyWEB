// import "core-js/stable";
import './index.html';
import './index.scss';
// import { eccryptoJS } from "eccrypto-js/dist/umd/index.min.js";
const eccryptoJS = require('eccrypto-js');

let checkKey = document.getElementById("checkKey");
let checkData = document.getElementById("chekData");
let inputKey = document.getElementById("inputKey");
let inputData = document.getElementById("inputData");

//allow and ban file transfer access for user
checkKey.addEventListener("change", () => changeCheck(inputKey, checkKey));
  
checkData.addEventListener("change", () => changeCheck(inputData, checkData));

function changeCheck(input,check) {
    let inputFile = document.querySelector(`#${check.id} ~ div.file`);
    let plus = inputFile.querySelector("i");
    let parentForm = check.parentNode;
    let nameFile = inputFile.querySelector(".nameFile");
    if (check.checked) {
        input.disabled = false;
        parentForm.classList.add('active');
        inputFile.classList.remove("file-disabled");
        //If file choosed then picture of file must not blink. This chek existence text into div.nameFile 
        if (!nameFile.innerHTML) {
            plus.classList.add("fa-fade");
        }
        // space.classList.add("space-active");
    } else {
        inputFile.classList.add("file-disabled");
        parentForm.classList.remove('active');
        plus.classList.remove("fa-fade");
        // space.classList.remove("space-active")
        input.disabled = true;
    }
}

inputKey.addEventListener("change",() => setFileInput(inputKey))
inputData.addEventListener("change",() => setFileInput(inputData))

function setFileInput(inputFile) {
    let plus = document.querySelector(`#${inputFile.id} ~ i`);
    let nameFile = document.querySelector(`#${inputFile.id} ~ .nameFile`)
    //console.log(nameFile);
    plus.classList.remove("fa-plus","fa-fade");
    plus.classList.add("fa-file");
    if (!inputFile.files[0]) {
        return;
    }
    let dataFile = inputFile.files[0];
    console.log(dataFile);
    nameFile.innerHTML = dataFile.name;
}

//////////////////////////////////////////////////////////////////

//transformed array of bits in 10 system to string in 16 unit
function bitTo16(bits){
    let ints = [];
    for (let i = 0; i < bits.length; i++) {
        ints[i] = bits[i].toString(16);
        //console.log(ints[i].length)
        if (ints[i].length == 1) {
            ints[i] = "0" + ints[i]
        }
    }
    return ints.join('')
}

//create key AES-256 and downland fail with key
function createKey() {

    console.log(eccryptoJS)
    // создание ключа
    let Key = eccryptoJS.randomBytes(32);
    let IV = eccryptoJS.randomBytes(16);
    //перевд через функцыю
    Key = bitTo16(Key)
    IV = bitTo16(IV)
    console.log(Key,IV);

    const content = `${IV}${Key}`; // Здесь может быть ваше содержимое файла
    console.log(content);
    const fileName = 'key.txt'; // Имя файла

    const blob = new Blob([content], { type: 'text/plain' }); // Создаем объект Blob с указанным содержимым и типом файла

    const url = URL.createObjectURL(blob); // Создаем URL из объекта Blob

    const link = document.createElement('a'); // Создаем элемент <a>
    link.href = url; // Устанавливаем URL в атрибут href элемента <a>
    link.download = fileName; // Устанавливаем имя файла в атрибут download элемента <a>
    link.style.display = 'none'; // Скрываем элемент <a>

    document.body.appendChild(link); // Добавляем элемент <a> в DOM

    link.click(); // Вызываем клик на элементе <a> для запуска скачивания файла

    document.body.removeChild(link); // Удаляем элемент <a> из DOM

    URL.revokeObjectURL(url); // Освобождаем ресурсы URL
}

//transform string in 16 unit to array of bits in 10 unit
function transformKey(arrNum) {  
    console.log(arrNum,"entered data for function transformKey")
    arrNum = arrNum.split('');
    let lengthFutureArr = arrNum.length/2
    let arrBit = eccryptoJS.randomBytes(lengthFutureArr);
    console.log(arrBit)
    for (let i = 0; i < lengthFutureArr; i++) {
        let temp = arrNum.splice(0,2)
        temp = parseInt(temp.join(''),16)
        arrBit[i] = temp;
    }
    return arrBit;
}
  
//function of encription and decription, choose which is depended of flag's value: 0-encryption 1-decription
async function encryption(flag) {
    let key = "";
    let iv = "";
    //datas from file or textarea
    let stringData;
    let stringKey;
    //Link of textarea's element
    let textarea = document.getElementById("textarea");
    let textareaKey = document.getElementById("textareaKey")

    let checkKey = document.getElementById("checkKey");
    let checkData = document.getElementById("chekData");
    let inputData = document.getElementById("inputData")
    let inputKey = document.getElementById("inputKey");
    let dataFile = inputData.files[0];
    let keyFile = inputKey.files[0];
    let text = ""
    let keyfile = "";
    const regex = /\b([A-Fa-f0-9]{96})\b/g;
    console.log(dataFile,inputKey)
    
    if (checkKey.checked) {
        const promiseKey = new Promise((resolve, reject) => {
            //read files with key and text which need encryption
            const reader = new FileReader();
            reader.addEventListener('load', async (event) => {
                resolve(event.target.result);
            });
            reader.readAsText(keyFile)
        })
        stringKey = await promiseKey.then((result) => {
            console.log(result); // Результат выполнения
            return result
        }).catch((error) => {
            console.error(error); // Ошибка
        });
    } else if(textareaKey.value){
        stringKey = textareaKey.value
    }

    console.log(stringKey);

    if (checkData.checked) {
        const readerData = new FileReader();
        readerData.addEventListener('load', async (event) => {
            stringData = event.target.result;
            console.log(stringData);
        });
        readerData.readAsText(dataFile)

        const promiseData = new Promise((resolve, reject) => {
            //read files with key and text which need encryption
            const readerData = new FileReader();
            readerData.addEventListener('load', async (event) => {
                resolve(event.target.result);
            });
            readerData.readAsText(dataFile)
        })
        stringData = await promiseData.then((result) => {
            console.log(result); // Результат выполнения
            return result
        }).catch((error) => {
            console.error(error); // Ошибка
        });
    } else if(textarea.value){
        stringData = textarea.value;
        console.log(textarea)
    }

    console.log(stringData)

    if (!stringKey || !stringData) {
        console.log("not have needed data")
        return;
    }


    console.log(stringData);
    //function crypto have three pramaters: 
    //first text of fileKey in form of string;  
    //second text of fileData in form of string
    //third parameter indicate what need do: encryp or decryp
    keyfile = (regex.exec(stringKey))[0]
    key = keyfile.split('');
    iv = key.splice(0,32);
    key = transformKey(key.join(''));
    iv = transformKey(iv.join(''))
    console.log(iv,"IV") 
    console.log(key,"Key")

    switch (flag) {
        //encryption
        case 0:
            text = eccryptoJS.utf8ToBuffer(stringData);
            console.log(text,"text");  // выводим считанные данные

            console.log(iv, key, text)
            let ciphertext = await eccryptoJS.aesCbcEncrypt(iv, key, text);
            ciphertext = bitTo16(ciphertext)
            console.log(ciphertext,"ciphertext");
            textarea.value = ciphertext;
            break;
        //decry
        case 1:
            text = transformKey(stringData);
            console.log(text,"text")

            let decrypted = await eccryptoJS.aesCbcDecrypt(iv, key, text);
            decrypted = decrypted.toString();
            console.log(decrypted,"|decrypted");
            textarea.value = decrypted;
            break;

        default:
            break;
    }
    console.log(textarea.value)
}

let butCreateKey = document.getElementById("butCreateKey");
let butEncryption = document.getElementById("butEncryption");
let butDecryption = document.getElementById("butDecryption");

butCreateKey.addEventListener('click',createKey)

butEncryption.addEventListener('click', () => encryption(0))
butDecryption.addEventListener('click', () => encryption(1))

console.log("files download");