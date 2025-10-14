window.onload = loadCSV;

class music{
    constructor(name, unit, idols){
        this.name = name;
        this.unit = unit;
        this.idols = idols;
    }

    is_target_data(target){
        for(let i=0; i<this.idols.length; i++){
            if(target == "島村卯月" && this.name == "はにかみdays"){
                console.log("target:");
                for(let i=0; i<target.length; i++) console.log(target.charCodeAt(i));
                console.log("idol_name:");
                for(let i=0; i<this.idols[0].length; i++) console.log(this.idols[0].charCodeAt(i));
            }
            if(target == this.idols[i]){
                return true;
            }
        }
        return false;
    }
}

class nameManager{
    constructor(true_name, candidates){
        this.true_name = true_name;
        this.candidates = candidates;
    }

    get_true_name(cand_name){
        for(let i=0; i<this.candidates.length; i++){
            const temp = this.candidates[i];
            if(cand_name == temp) return true;
        }
        return false;
    }
}

//↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ いつか直す ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
// function makeDB(){
//     loadCSV('cg_musics.csv')
//         .then(music_datas => {
//             music_datas.forEach(function(data){
//                 const row = data.split(',');
//                 music_list.push(new music(row[0], row[1], row.slice(2)));
//             });
//             loadCSV('name_conversion.csv')
//                 .then(conversion_data => {
//                     conversion_data.forEach(function(data){
//                         const row = data.split(',');
//                         conversion_list.push(new nameManager(row[0], row.slice(1)));
//                     });
//                 });
//         });

//     console.log(music_list);
//     console.log(conversion_list);
// }

// // function makeDB(){
// //     const music_datas = loadCSV('cg_musics.csv');
// //     music_datas.forEach(function(data){
// //         const row = data.split(',');
// //         music_list.push(new music(row[0], row[1], row.slice(2)));
// //     });
// //     const conversion_datas = loadCSV('name_conversion.csv');
// //     conversion_datas.forEach(function(data){
// //         const row = data.split(',');
// //         conversion_list.push(new nameManager(row[0], row.slice(1)));
// //     });
// // }

// function loadCSV(fname){
//     let arranged_list = [];
//     fetch(fname)
//         .then(response => response.text())
//         .then(csvText => {
//             let temp_text = "";
//             temp_text = csvText.replaceAll("\r\n", "\n");
//             temp_text = temp_text.replaceAll("\r", "\n");

//             arranged_list = temp_text.split('\n');
//         })
//         .catch(error => {
//             console.error("Loading failed.", error);
//         });
//     return arranged_list;
// }

const music_list = []
const conversion_list = []
function loadCSV(){
    fetch('cg_musics.csv')
        .then(response => response.text())
        .then(csvText => {
            let temp_text = "";
            temp_text = csvText.replaceAll("\r\n", "\n");
            temp_text = temp_text.replaceAll("\r", "\n");

            const music_datas = temp_text.split('\n');
            music_datas.forEach(function(data){
                const row = data.split(',');
                music_list.push(new music(row[0], row[1], row.slice(2)));
            });
        })
        .catch(error => {
            console.error("Loading failed.", error);
        });

    fetch('name_conversion.csv')
        .then(response => response.text())
        .then(csvText => {
            const name_datas = csvText.split('\r\n');
            name_datas.forEach(function(data){
                const row = data.split(',');
                conversion_list.push(new nameManager(row[0], row.slice(1)));
            });
        })
        .catch(error => {
            console.error("Loading failed.", error);
        });
}

function makeTargetIdolList(target_idols){
    console.log(target_idols);
    let target_list = [];
    music_list.forEach(function(music){
        if(music.is_target_data(target_idols[0])) target_list.push(music);
    });
    if(target_idols.length == 1) return target_list;
    
    for(let i=1; i<target_idols.length; i++){
        let temp_list = [];
        target_list.forEach(function(music){
            if(music.is_target_data(target_idols[i]) && music.name != "お願い！シンデレラ"){
                temp_list.push(music);
            }
            target_list = temp_list.slice();
        });
    }
    return target_list;
}

function makeTable(){
    const text = document.getElementById("idolNames").value;
    const idols = makeIdolList(text);
    const target_list = makeTargetIdolList(idols);

    if(target_list.length == 0) document.getElementById("output").innerHTML = ``;

    let result = "<table border=1>";
    target_list.forEach(function(music){
        result += `<tr>`;
        result += `<td>${music.name}</td><td>${music.unit}</td>`;
        result += `<td>`;
        if(music.name == "お願い！シンデレラ"){result += `</td>`; return;}
        for(let i=0; i<music.idols.length-1; i++) result += `${music.idols[i]}, `
        result += `${music.idols[music.idols.length-1]}</td></tr>`
    });
    result += `</table>`
    document.getElementById("output").innerHTML = result;
}

function makeIdolList(text){
    newText = text.replaceAll('　', ' ');
    let temp = newText.split(' ');
    console.log("list: " + temp);
    
    let idolList = [];
    temp.forEach(function(temp_name){
        let name = "xxx";
        conversion_list.forEach(function(nm){
            if(temp_name == nm.true_name){
                name = nm.true_name;
                return;
            }
            if(nm.get_true_name(temp_name)){
                name = nm.true_name;
                return;
            }
        });
        if(name != "") idolList.push(name)
    });

    console.log("newlist: " + idolList);
    return idolList;
}