const convert = function (dat)
{
    if(isNaN(dat))
    {
       throw new Error('Not a number');
    }

// Readline and FS declarations
const readline = require('readline');
const fs = require('fs');

// Thief
let theftData = [];
let over = [];
let under = [];

// Assault
let arrestData = [];
let noArrest = [];
let arrested = [];

// Crimes
let crimesData = [];
let index = [];
let nonindex = [];
let violent = [];
let property = [];

// Declarations
let theft = {};
let arrest = {};
let crimes = {};
let i = 0;

// Years
for (i = 2001; i <= 2016; i = i + 1) {
    over[i] = 0;
    under[i] = 0;
    arrested[i] = 0;
    noArrest[i] = 0;
}

index[2015] = 0;
nonindex[2015] = 0;
violent[2015] = 0;
property[2015] = 0;

// Reading local CSV
const rl = readline.createInterface({
    input: fs.createReadStream('./../inputdata/chicagocrimes.csv')
});

// Applying Regex for unwanted values and conditional counting of scenarios for Theft and Assault
rl.on('line', function(line) {
    let value = line.trim().split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

    if (value[5] === 'THEFT' && value[6] === 'OVER $500') {
        over[value[17]] = over[value[17]] + 1;
    } else if (value[5] === 'THEFT' && value[6] === '$500 AND UNDER') {
        under[value[17]] = under[value[17]] + 1;
    } else if (value[5] === 'ASSAULT' && value[8] === 'true') {
        arrested[value[17]] = arrested[value[17]] + 1;
    } else if (value[5] === 'ASSAULT' && value[8] === 'false') {
        noArrest[value[17]] = noArrest[value[17]] + 1;
    } else if (value[17] === '2015' && value[5] === 'ROBBERY') {
        index[2015] = index[2015] + 1;
    } else if (value[17] === '2015' && value[5] === 'OTHER OFFENSE') {
        nonindex[2015] = nonindex[2015] + 1;
    } else if (value[17] === '2015' && value[5] === 'CRIMINAL TRESPASS') {
        violent[2015] = violent[2015] + 1;
    } else if (value[17] === '2015' && value[5] === 'CRIMINAL DAMAGE') {
        property[2015] = property[2015] + 1;
    }
});

// Performing the functional operation on csv data to obtain the expected aggregated result
rl.on('close', function() {
    for (i = 2001; i <= 2016; i = i + 1)
    {
        /* 1. Aggregating the data of "THEFT OVER $500" & "THEFT $500 AND UNDER"
        over the time frame 2001 - 2016. */
        theft = {};
        theft.Year = i;
        theft['Theft Over $500'] = over[i];
        theft['Theft $500 And Above'] = under[i];
        theftData.push(theft);

        /* 2. Aggregating all assault cases over the time frame 2001 - 2016
        on whether the crime resulted in an arrest or not.        */
        arrest = {};
        arrest.Year = i;
        arrest.Arrested = arrested[i];
        arrest['Not Arrested'] = noArrest[i];
        arrestData.push(arrest);
    }

    // 3. Aggregating all crimes for 2015
    crimes = {};
    crimes.year = 2015;
    crimes.index = index[2015];
    crimes.nonindex = nonindex[2015];
    crimes.violent = violent[2015];
    crimes.property = property[2015];
    crimesData.push(crimes);

// Conversion of resultant csv data into JSON format
fs.writeFileSync('../outputdata/theft_data.json', JSON.stringify(theftData), 'utf8');
fs.writeFileSync('../outputdata/assault_data.json', JSON.stringify(arrestData), 'utf8');
fs.writeFileSync('../outputdata/crimes_data.json', JSON.stringify(crimesData), 'utf8');
// console.log('Done');
});

// console.log('CSV to Json Converted');
return 'JSON written successfully';
};
module.exports = convert;
