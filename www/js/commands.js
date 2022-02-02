'use strict';

document.getElementById('table');
const datatable = document.getElementById('datatable');

datatable.header = {
    'NAME': 'name',
    'SCOPE': 'scope',
    'DESCRIPTION': 'description',
    'OUTPUT': 'output'
};

fetch('https://rzu27yefga.execute-api.us-east-2.amazonaws.com/dev/getBotCommands?fmt=json&headers=true')
    .then(res => res.json())
    .then(rows => {
        datatable.data = rows.map(row => {
            const args = [];
            if (!!row['ARGUMENT_MAP']) {
                row['ARGUMENT_MAP'].split(' ').forEach(arg => {
                    args.push(arg.split('@')[0]);
                });
            }
            return {
                'NAME': `!${row['NAME']}${args.map(arg => ` <${arg}>`)}`,
                'SCOPE': row['SCOPE'],
                'DESCRIPTION': row['DESCRIPTION'],
                'OUTPUT': row['OUTPUT']
            };
        });
    })
    .catch(console.error);
