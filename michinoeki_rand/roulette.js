window.onload = loadCSV;

class station{
    constructor(pref, name, region, url){
        this.pref = pref;
        this.name = name;
        this.region = region;
        this.url = url;
    }
}

const st_list = [];

function loadCSV(){
    fetch('michinoeki.csv')
        .then(response => response.text())
        .then(csvText => {
            let temp_text = "";
            temp_text = csvText.replaceAll("\r\n", "\n");
            temp_text = temp_text.replaceAll("\r", "\n");

            const st_datas = temp_text.split('\n');
            st_datas.forEach(function(data){
                const row = data.split(',');
                st_list.push(new station(row[0], row[1], row[2], row[3]));
            }); 
        })
        .catch(error => {
            console.error("Loading failed.", error);
        });
}

function makeTargetList(){
    let temp_list = [];
    let input_checkbox = document.querySelectorAll("input[name=station]:checked");
    st_list.forEach(function(row){
        input_checkbox.forEach(function(target_box){
            if(row.pref == target_box.value) temp_list.push(row);
        });
    });
    return temp_list;
}

function showNextSt(){
    const target_list = makeTargetList();
    let result = "都道府県を選んで下さい";
    if(target_list.length > 0){
        const rand_idx = Math.floor(Math.random()*target_list.length);
        console.log(rand_idx);
        const dest = target_list[rand_idx];
        result = "<table border=1><tr><th>道の駅名</th><td>" + `${dest.name}` + "</td></tr>"
        result += "<tr><th>都道府県名</th><td>" + `${dest.pref}` + "</td></tr>";
        result += "<tr><th>地域</th><td>" + `${dest.region}` + "</td></tr>"
        result += "<tr><th>URL</th><td><a href=\"" + `${dest.url}` + "\">" + `${dest.url}` + "</td></tr></table>";
    }
    document.getElementById("output").innerHTML = result;
}
