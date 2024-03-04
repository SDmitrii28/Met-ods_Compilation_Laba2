// //Нисходящая стратегия
const downwardParser = (e) => {
    // const T = ["!", "+", "*", "(", ")", "a", "b", "c"]; //порождающая грамматика. терминалы
    const T = ["!", "+", "*", "(", ")", "a", "b", "c"]; //порождающая грамматика. терминалы
    const N = ["A", "B", "W", "T", "Z", "M"];//нетерминалы
    //продукции
    // const Productions = {
    //     "B": ["TW"],
    //     "W": ["+TW", "e"],
    //     "T": ["MZ"],
    //     "Z": ["*MZ", "e"],
    //     "M": ["(B)", "a", "b", "c"]
    // };
    const Productions = {
        "A": ["!B!"],
        "B": ["TW"],
        "W": ["e","+TW"],
        "T": ["MZ"],
        "Z": ["e","*MZ"],
        "M": ["a", "b", "(B)"]
    };
    let productionsNumbered = [];
    for (const key in Productions) {
        const arr = [];
        for(let i=0; i<Productions[key].length;i++) {
            arr.push({[key]: Productions[key][i]})
        }
        productionsNumbered = [...productionsNumbered, ...arr];
    }
//console.log(productionsNumbered);
//     const Productions = {
//     "B": "TW",//0
//     "W": "+TW",//1
//     "W": "e",//2
//     "T": "MZ",//3
//     "Z": "*MZ",//4
//     "Z": "e",//5
//     "M": "(B)",//6
//     "M": "a",//7
//     "M": "b",//8
//     "M": "c"//9

// };
// Object.values(Productions)[0]
// const Table = {
//     "B": [["a", 0],["b", 0],["c", 0], ["(", 0]],
//     "W": [[")", 2], ["+", 1], ["e", 2]],
//     "T": [["a", 3],["b", 3],["c", 3], ["(", 3]],
//     "Z": [[")", 5], ["+", 5], ["*", 4], ["e", 5]],
//     "M": [["a", 7], ["b", 7], ["c", 7], ["(", 6]]
// };

const Table = {
    "A": [["!", 0]],
    "B": [["(", 1],["a", 1],["b", 1]],
    "W": [["!", 2], ["+", 3], [")", 2], ["e",2]],
    "T": [["(", 4],["a", 4],["b", 4]],
    "Z": [["!", 5], ["+", 5], ["*", 6], [")", 5], ["e",5]],
    "M": [["(", 9], ["a", 7], ["b", 8]]
};
//    B' = w
//    T' = Z
// const Productions = {
//     "A": [["!","B", "!"]],
//     "B": [["T","W"]],
//     "W": [["e"],["+","T","W"]],
//     "T": [["M","Z"]],
//     "Z": [["e"],["*","M","Z"]],
//     "M": [["a"], ["b"], ["(","B",")"]]
// };
// const ProductionIndex = {
//     "B": 0,
//     "W": 0,
//     "T": 0,
//     "Z": 0,
//     "M": 0
// };
// const ProductionIndex = {
//     "A": 0,
//     "B": 0,
//     "W": 0,
//     "T": 0,
//     "Z": 0,
//     "M": 0
// };
// const Index = {
//     "B": [1],
//     "W": [2,3],
//     "T": [4],
//     "Z": [5,6],
//     "M": [7,8,9,10]
// };
// const Index = {
//     "A": [1],
//     "B": [2],
//     "W": [3,4],
//     "T": [5],
//     "Z": [6,7],
//     "M": [8,9,10]
// };
    const start = Object.keys(productionsNumbered[0])[0];//берем все левые части из объекта, нулевой т е буква А
    console.log(start);
    e.preventDefault();// нужно для отображения в html
    const forms = document.getElementById('downwardParser');
    const formData = new FormData(forms);
    const omegas = formData.get('input');//строка из input
    const omega = omegas.split('');
    omega[omega.length] = "e";
    const L = [];// стек
    const answer = [];
    let omegaIndex = 0;
    L.unshift(start);// вставка в начало масива L
    start==omega[omegaIndex] ? Action2() : Action1();//проверка если start = первому элементу строки то переходим к действию 2 иначе к действию 1


    function Action1 (){
        //const notTerm = L.shift();//извлекаем первый элемент
        //console.log(notTerm);
        checkSimvol(L[0]);
    }
    function checkSimvol(el) {
        if(T.indexOf(el) < 0){
            L.shift();
            notTerminal(el);// проверка символа по таблице
        }
        else
        if(T.indexOf(el) >= 0 && (el=="a" || el=="b" || el=="c")){
            Action2 ();
        }
        else 
        {
            NotSimvol();//ОШИБКА
        }
    }
    //меняем на следующую альетнативу
    function notTerminal (el) {
        let flag=0;
        let number=0;
        //console.log(Table, el);
        (Table[el]).forEach(el =>{
            if(el[0]==omega[0])
            {
               console.log("find");
               flag=1;
               number = el[1];

            }
        });
        if(flag==1){
            console.log("№" + number);
            //console.log(Object.values(productionsNumbered[number])[0]);
            (Object.values(productionsNumbered[number])[0].split('').reverse()).forEach(el => {
                L.unshift(el);//вставляем в начало
                //console.log(L);
            });
            if(L[0]=="e"){
                console.log("FINISH");
                L.shift();
                if(L.length==0){
                    L.unshift("e");
                }
            }
            console.log(L);
            console.log(omega);
            answer.push(number+1);
            L[0]==omega[omegaIndex] ? Action2() : Action1();//проверка если start = первому элементу строки то переходим к действию 2 иначе к действию 1
        }
        else
            NotSimvol();//ОШИБКА
    }
    
    function Action2 () { // для терминала
            L.shift();
            omega.shift();
            if(L.length==0 && omega[0]=="e"){
                L.unshift("e");
            }
            if (omega.length==0 && L.length==0) {
                Output();
            }
            else
            {
                console.log(L);
                console.log(omega);
                L[0]==omega[omegaIndex] ? Action2() : Action1();//проверка если start = первому элементу строки то переходим к действию 2 иначе к действию 1
            }

    }

    function Output() { // анализ стека L1 и вывод результата
        form.output.value=answer;
    }

    function NotSimvol () {
        console.error("Ошибка");//вывод ошибки
        form.output.value='Ошибка';
    }
}
const form = document.getElementById('downwardParser');
form.addEventListener('submit', downwardParser)
