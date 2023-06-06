const { encrypt } = require("eccrypto-js");

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

function createKey() {

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

function transformKey(arrNum) {
    // let arrNum = (param.exec(data))[0];  
    // console.log(arrNum,"first")
    
    console.log(arrNum,"entered data for function transformKey")
    //arrNum = arrNum.split(' ').join('');
    arrNum = arrNum.split('');
    // console.log(arrNum,"secont")
    let lengthFutureArr = arrNum.length/2
    let arrBit = eccryptoJS.randomBytes(lengthFutureArr);
    // let arrBit = new ArrayBuffer();
    console.log(arrBit)
    //senderPrivateKey = senderPrivateKey.privateKey;
    for (let i = 0; i < lengthFutureArr; i++) {
        let temp = arrNum.splice(0,2)
        temp = parseInt(temp.join(''),16)
        arrBit[i] = temp;
        //console.log(arrBit[i]);
    }
    return arrBit;
}
  
async function encryption(flag) {

    let key = "";
    let iv = "";
    let file;
    let stringData;
    let stringKey;
    let textarea = document.getElementById("textarea")

    // const fileInput = document.getElementById('fileInput');
    // const file = fileInput.files[0]; // Получаем выбранный файл
    // let data = document.querySelector("#inputData");
    let inputData = document.getElementById("inputData")
    let dataFile = inputData.files[0];
    let inputKey = document.getElementById("inputKey");
    let keyFile = inputKey.files[0];
    console.log(dataFile,inputKey)
    
    if (!keyFile || !dataFile) {
        console.log("files is not have")
        return;
    }

    //read files with key and text which need encryption
    const reader = new FileReader();
    reader.addEventListener('load', async (event) => {
        stringKey = event.target.result;
        console.log(stringKey);
        const readerData = new FileReader();
        readerData.addEventListener('load', async (event) => {
            stringData = event.target.result;
            console.log(stringData);
            //fub=nction crypto have three pramaters: 
            //first text of fileKey in form of string;  
            //second text of fileData in form of string
            //third parameter indicate what need do: encryp or decryp
            let text = ""
            // let key = "";
            // let iv = "";
            let keyfile = "";
            const regex = /\b([A-Fa-f0-9]{96})\b/g;
            //key = data;
            //const match = regex.key.exec(data);
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
                    textarea.innerHTML = ciphertext;
                    break;
                //decry
                case 1:
                    text = transformKey(stringData);
                    console.log(text,"text")

                    let decrypted = await eccryptoJS.aesCbcDecrypt(iv, key, text);
                    decrypted = decrypted.toString();
                    console.log(decrypted,"|decrypted");
                    textarea.innerHTML = decrypted;
                    break;
                    
                default:
                    break;
            }
            console.log(textarea.innerHTML)
        });
        readerData.readAsText(dataFile)
    });
    reader.readAsText(keyFile)
    console.log(reader)
}