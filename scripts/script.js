let scoreLettersInText = 0;


function textReader(input){
    
    let file = input.files[0];
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
        reader.result.replace(/\n|\r/g, "").toLowerCase();

        let mapOfVowe = new Map(Object.entries(scoreVowelsInFile(reader.result)));
        const mapOfVowe_sort = new Map([...mapOfVowe.entries()].sort((a, b) => a[1] - b[1]));
        
        document.querySelector("input").style.display = 'none';
        createTable(mapOfVowe_sort);
        bs = basicStatistics(mapOfVowe_sort);
        writeResult(bs);
        console.log(bs)
        probability(mapOfVowe_sort);
 //       console.log(reader.result.replace(/\n|\r/g, ""));
        
    };
    reader.onerror = () => console.log('poshel_nahui')
    
}



function fashion(voweList){
    let maxCount = 0;

    for(let letter in voweList){
        if(maxCount < voweList[letter]){
            maxCount = voweList[letter];
        }
    }

    return Object.keys(voweList).find((letter) => voweList[letter] === maxCount);
}


function scoreVowelsInFile(file){
    //let voweList = ['а', 'я', 'е', 'э', 'о', 'ё', 'и', 'у', 'ю', 'ы',];
    let voweList = {'а': 0, 'я': 0, 'е': 0, 'э': 0, 'о': 0, 'ё': 0, 'и': 0, 'у': 0, 'ю': 0, 'ы': 0,};
    
    for(let letter of file){
        switch(letter){
            case 'а':
                voweList['а'] += 1;
                break;
            case 'я':
                voweList['я'] += 1;
                break;
            case 'е':
                voweList['е'] += 1;
                break;
            case 'э':
                voweList['э'] += 1;
                break;
            case 'о':
                voweList['о'] += 1;
                break;
            case 'ё':
                voweList['ё'] += 1;
                break;
            case 'и':
                voweList['и'] += 1;
                break;
            case 'у':
                voweList['у'] += 1;
                break;
            case 'ю':
                voweList['ю'] += 1;
                break;
            case 'ы':
                voweList['ы'] += 1;
                break;
            default:
                scoreLettersInText++;
        }
    }
    console.log(voweList);
    //console.log(scoreLettersInText);
    return voweList;
}



function createTable(mapOfVowe_sort){
    //let table = document.querySelector('table');
    let tableB = document.createElement('table')
    let table = document.createElement('tbody');
    tableB.append(table)
    let tr1 = document.createElement('tr');
    let tr2 = document.createElement('tr');
    for(let entry  of mapOfVowe_sort){
        let th = document.createElement('th');
        th.textContent = entry[0];
        tr1.append(th);
        let tr = document.createElement('td');
        tr.textContent = entry[1];
        tr2.append(tr);
    }
    table.append(tr1);
    table.append(tr2);
    document.querySelector('body').append(tableB)
}

function writeResult(obj){
    let dd = {
        arithmeticMean: "Среднее Арифметическое",
        geometricMean : "Среднее Геометрическое",
        harmonicMean : "Среднее Гармоническое",
        scope : "Размах",
        median : "Медиана",
    }
    let l = ``;
    let div = document.createElement("div");
    for(let item in obj){
        l += `<p>${dd[item]} = ${obj[item]}<p>`
    }
    div.innerHTML = l;
    document.querySelector("body").append(div);
}


function basicStatistics(mapOfVowe_sort){
    let arithmeticMean = geometricMean = harmonicMean = scope = median = blowout = 0; //blowout - выброс
    let sumOfValues = sumNumInNegativeDegree = quantityNum = maxNum = 0, multOfValues = 1, minNum = 10000000000;
    
    for(let entry  of mapOfVowe_sort){
        if(minNum > entry[1]) minNum = entry[1];
        if(maxNum < entry[1]) maxNum = entry[1];
        sumOfValues += entry[1];
        multOfValues *= entry[1]==0 ? 1 : entry[1];
        sumNumInNegativeDegree += entry[1]==0 ? 0 : Math.pow(entry[1], -1);
        quantityNum++;
        mapOfVowe_sort
    }
    arithmeticMean = sumOfValues / quantityNum;
    geometricMean = Math.pow(multOfValues, 1/quantityNum);
    harmonicMean = quantityNum / sumNumInNegativeDegree;
    scope = maxNum - minNum;

    

    if(mapOfVowe_sort.size % 2 == 0){
        let mean = Math.floor(mapOfVowe_sort.size/2) - 1;
        median = (Array.from(mapOfVowe_sort.values())[mean] + Array.from(mapOfVowe_sort.values())[mean+1]) / 2;
    }else{
        median = mapOfVowe_sort.values()[Math.ceil(mapOfVowe_sort.size/2)];
    }

    return {
        median : median,
        arithmeticMean: arithmeticMean,
        geometricMean : geometricMean,
        harmonicMean : harmonicMean,
        scope : scope, 
    }
}



function probability(map){
    
    //let table = document.createElement("table");
    //let row1 = document.createElement('tr');
    let row1 = row2 = `<tr>`;
    let totalNum = mathExpectation = disperthon = 0;

    map.forEach((value) => totalNum += value);
    let probabilityLetter = 100 / totalNum;

    var v = []
    let labes = []

    for(let entry of map){
        row1 += `<td>${entry[0]}</td>`
        row2 += `<td>${(entry[1] * probabilityLetter).toFixed(2)}</td>`
        mathExpectation += entry[1] * (entry[1] * probabilityLetter).toFixed(2);
        disperthon += Math.pow(entry[1], 2) * (entry[1] * probabilityLetter).toFixed(2);
        v.push((entry[1] * probabilityLetter).toFixed(2));
        labes.push(entry[0]);
    }
    row1 += '</tr>';
    row2 += '</tr>';

   

    let table = document.createElement("table");
    table.classList.add('probability')
    let tBody = `<tbody>${row1} ${row2}</tbody>`
    table.innerHTML = tBody;
    let p = document.createElement('div');
    p.innerHTML = `
    <p>Математическое ожидание: ${mathExpectation}</p>
    <p>Дисперсия: ${disperthon}</p>
    <p>Среднее квадратичное значение: ${Math.sqrt(disperthon).toFixed(2)}</p>
    `;

    let d = document.createElement("div");
    d.className = "ct-chart ct-perfect-fourth";
    d.style.width = `1000px`,
    d.style.height = `500px`
    document.querySelector('body').append(table, p, d);
    


    new Chartist.Line('.ct-chart', {
        series: [[
          {x: 1, y: v[0]},
          {x: 2, y: v[1]},
          {x: 3, y: v[2]},
          {x: 4, y: v[3]},
          {x: 5, y: v[4]},
          {x: 6, y: v[5]},
          {x: 7, y: v[6]},
          {x: 8, y: v[7]},
          {x: 9, y: v[8]},
          {x: 10, y: v[9]},
          {x: 11, y: v[9]},

        ]],
        labels: labes,
      }, {
        axisX: {
        //   type: Chartist.AutoScaleAxis,
        //   onlyInteger: true
        labelInterpolationFnc: function (value) {
            return value;
          }
        },
        axisY: {
          type: Chartist.FixedScaleAxis,
          ticks: v,
          low: 0
        },
        lineSmooth: Chartist.Interpolation.step(),
        showPoint: false
      });

   console.log(matrix)
    
}







