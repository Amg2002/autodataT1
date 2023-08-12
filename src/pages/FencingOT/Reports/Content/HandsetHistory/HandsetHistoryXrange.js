import React from 'react';
import Highcharts from "highcharts/";
import ReactHighcharts from "highcharts-react-official";
import xrange from 'highcharts/modules/xrange';
import HighchartsExporting from 'highcharts/modules/exporting'

const HandsetHistoryXrange = (props) => {
    
  xrange(Highcharts);

  if (typeof Highcharts === 'object') {
      HighchartsExporting(Highcharts)
  }


  let imei = [];
  let startTime, endTime;

  let data = props.data.map((res) => {

      if(!imei.includes(res.imei)){
        imei.push(res.imei);
      }

      startTime = new Date(res.startTime);
      endTime = new Date(res.endTime);

      return {
          x: Date.UTC(startTime.getFullYear(), startTime.getMonth(), startTime.getDate() ),
          x2: Date.UTC(endTime.getFullYear(), endTime.getMonth(), endTime.getDate() ),
          y: imei.indexOf(res.imei),
      }
  });


  let options = {
      chart: {
        type: 'xrange'
      },
      title: {
        text: 'Handset History'
      },
      subtitle:{
        text: props.data.length? "" : "No Data Found"
      },
      accessibility: {
          point: {
            descriptionFormatter: function (point) {
              var ix = point.index + 1,
                category = point.yCategory,
                from = new Date(point.x),
                to = new Date(point.x2);
              return ix + '. ' + category + ', ' + from.toDateString() +
                ' to ' + to.toDateString() + '.';
            }
          }
        },
      xAxis: {
        type: 'datetime'
      },
      yAxis: {
        title: {
          text: 'MSISDN'
        },
        categories: imei,
        reversed: true
      },
      series: [{
          name: 'Handset History',
          borderColor: 'gray',
          pointWidth: 20,
          data: data,
          dataLabels: {
          enabled: true
        }
      }],
  }

  return <ReactHighcharts highcharts={Highcharts} options={options} />

}


export default HandsetHistoryXrange;
