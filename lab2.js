function getRandomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

function hsv_to_rgb(H,S,V){
  var f , p, q , t, lH;

  S /=100;
  V /=100;
  
    lH = Math.floor(H / 60);
    
    f = H/60 - lH;
                  
    p = V * (1 - S); 
                  
    q = V *(1 - S*f);
        
    t = V* (1 - (1-f)* S);
    
  switch (lH){
        case 0: R = V; G = t; B = p; break;
        case 1: R = q; G = V; B = p; break;
        case 2: R = p; G = V; B = t; break;
        case 3: R = p; G = q; B = V; break;
        case 4: R = t; G = p; B = V; break;
        case 5: R = V; G = p; B = q; break;
  }
return [parseInt(R*255), parseInt(G*255), parseInt(B*255)];
}

function generate_table(n)
{     
    var win_button_index = getRandomInRange(0, n * n - 1);
    var H_color_difference = 180.0 / (n - 1);
    console.log(H_color_difference);
    var H_main_color = getRandomInRange(0,360);
    var H_win_color = H_main_color - H_color_difference >= 0 ? H_main_color - H_color_difference :
      H_main_color + H_color_difference;
    var main_color = "rgb("+hsv_to_rgb(H_main_color,70,70)+")";
    var win_color = "rgb("+hsv_to_rgb(H_win_color,70,70)+")";
    var table = document.createElement("table");
    table.id = "table_game";
    for (let i = 0, k=0; i < n; i++) {
        var row = document.createElement("tr");
        for (let j = 0; j < n; j++, k++) {
          
            var td = document.createElement("td");
            var btn = document.createElement("button");        
            if(k == win_button_index)
            {     
                btn.style.background = win_color;
                btn.onclick = next_level;
            }
            else                   
            {
                btn.style.background = main_color;
                btn.onclick = lose;     
            }              
                
            td.appendChild(btn);
            row.appendChild(td);
    }
        table.appendChild(row);
    }   
    return table;
}

function next_level()
{       
    var old_table = document.getElementById("table_game");
    var count_rows = old_table.rows.length;
    old_table.parentNode.removeChild(old_table);          
    var game_field = document.getElementById("game_field");
    game_field.appendChild(generate_table(count_rows + 1));
    var level = document.getElementById("level");
    level.value = Number.parseInt(level.value) + 1;           
}
function start_game()
{
  init();
  var game_field = document.getElementById("game_field");
  game_field.appendChild(generate_table(2));
  window.timerId = window.setInterval(increment_time, 1000);       
}

function countinue_game(level_num, time_sec)
{
  var game_field = document.getElementById("game_field");
  game_field.appendChild(generate_table(level_num + 1));
  var level = document.getElementById("level");
  level.value = level_num;
  var timer = document.getElementById("timer");
  timer.value = time_sec;
  window.timerId = window.setInterval(increment_time, 1000);       
}

function init()
{
  if(window.timerId != null)
    window.clearInterval(window.timerId);
  var old_table = document.getElementById("table_game");
  if(old_table != null)
    old_table.parentNode.removeChild(old_table);
  var level = document.getElementById("level");
  var timer = document.getElementById("timer");
  level.value = 1;
  timer.value = 120;  
}

function lose()
{
    window.clearInterval(window.timerId);
    window.timerId = null;
    var level = document.getElementById("level");
    var timer = document.getElementById("timer");
    alert('Вы проиграли ): Пройдено уровней: ' +  (level.value - 1) + '.' + 
    'Потрачено времени, сек: ' + (120 - Number.parseInt(timer.value)));
    var name = prompt("Введите ваше имя", "default");
    check_records(name, level.value - 1, 120 - Number.parseInt(timer.value));
    init();
}

function check_records(player_name, player_level, player_time)
{
  
  window.records.push({     
    name: player_name,
    level: player_level,
    time: player_time
  });

  window.records.sort(function(r1,r2) {
    if (r1.level > r2.level) return -1;
    if (r1.level < r2.level) return 1;
    // при равных level сортируем по time
    if (r1.time < r2.time) return -1;
    if (r1.time > r2.time) return 1;
    return 0;
  });

  //если число рекордов превысило 5
  if(window.records.length > 5)
  {
    window.records.splice(5, 1);
  }

  var table_records = document.getElementById("table_records");
  console.log("//");
  console.log(window.records.length);
  console.log("//");
    for(let i = 0; i < window.records.length; i++)
    {
        table_records.rows[i + 1].cells[0].innerHTML = window.records[i].name;
        table_records.rows[i + 1].cells[1].innerHTML = window.records[i].level;
        table_records.rows[i + 1].cells[2].innerHTML = window.records[i].time;
    }
}

function increment_time()
{
    var timer = document.getElementById("timer");
    if(timer.value == "0")    
    {
      alert('Время вышло');
      lose();
      return;
    }
    timer.value = Number.parseInt(timer.value) - 1;        
}

function onunload_function()
{
  localStorage.clear();
  if(window.timerId != null)
  {
    var level = document.getElementById("level");
    localStorage.setItem('level', level.value);
    var timer = document.getElementById("timer");
    localStorage.setItem('time', timer.value);  
  }
  localStorage.setItem("records", JSON.stringify(window.records));
}

var records = []

