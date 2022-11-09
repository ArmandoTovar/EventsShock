import knex from './knex';
export const graph = async ({ startDate, endDate, type }) => {
  let query = '';
  if (type === 'day') {
    query = `select FORMAT( DATEADD(dd, 0, DATEDIFF(dd, 0, created_At)) , 'dd-MM-yyyy') as date, COUNT(*) as count FROM USERS 
        where  created_At > '${startDate}' and created_At <'${endDate}'
        GROUP BY  DATEADD(dd, 0, DATEDIFF(dd, 0, created_At))    HAVING COUNT(*)>=1;`;
  } else {
    query = `select FORMAT(DATEADD(HH,DATEPART(HH,created_At),CAST(CAST(created_At AS DATE) AS DATETIME)) , 'dd-MM-yyyy-HH') as date, COUNT(*) as count FROM USERS 
        where  created_At > '${startDate}' and created_At <'${endDate}'
        GROUP BY DATEADD(HH,DATEPART(HH,created_At),CAST(CAST(created_At AS DATE) AS DATETIME))    HAVING COUNT(*)>=1;`;
  }
  const data = await knex.raw(query);
  const label = data.map(({ date }) => "'" + date.toString() + "'");
  const count = data.map(({ count }) => count);
  const content = `<!DOCTYPE html>
<html lang='en'>
  <head>
    <meta charset='UTF-8' />
    <meta http-equiv='X-UA-Compatible' content='IE=edge' />
    <meta name='viewport' content='width=device-width, initial-scale=1.0' />
    <title>Document</title>
    <script src='https://cdn.jsdelivr.net/npm/chart.js'></script>
  </head>
  <body>
    <div>
      <canvas id='myChart' "></canvas>
    </div>
    <script>
      const labels = [${label.toString()}];

      const data = {
        labels: labels,
        datasets: [
          {
            label: 'History Users',
            data:[${count.toString()}],
            borderWidth: 1
          },
        ],
      };

      const config = {
        type: 'bar',
        data: data,
        options: {
            scales: {
                y: {
                  beginAtZero: true
                },
                x: {
                    ticks: {
                       callback: function(val, index) {
                         return index % 2 === 0 ? this.getLabelForValue(val) : '';
                        },
                        color: 'red',
                  }
                }
        }
      }};
    </script>
    <script>
      const myChart = new Chart(document.getElementById('myChart'), config);
    </script>
  </body>
</html>`;

  return content;
};
