import React from "react";
import Highcharts from "highcharts/";
import HighchartsReact from "highcharts-react-official";
import timeline from "highcharts/modules/timeline";

function HandsetHistoryGraph(props) {
  timeline(Highcharts);

  // eslint-disable-next-line no-unused-vars
  function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time =
      date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
    return time;
  }

  let data = props.data.map((res) => {
    return {
      name: `Start Time: ${res.startTime}`,
      label: `IMEI: ${res.msisdnorimei} IMSI: ${res.imsi}`,
    };
  });

  const options = {
    chart: {
      type: "timeline",
    },
    accessibility: {
      screenReaderSection: {
        beforeChartFormat:
          "<h5>{chartTitle}</h5>" +
          "<div>{typeDescription}</div>" +
          "<div>{chartSubtitle}</div>" +
          "<div>{chartLongdesc}</div>" +
          "<div>{viewTableButton}</div>",
      },
      point: {
        valueDescriptionFormat: "{index}. {point.label}. {point.description}.",
      },
    },
    xAxis: {
      visible: false,
    },
    yAxis: {
      visible: false,
    },
    title: {
      text: "",
    },
    subtitle: {
      text: "",
    },
    colors: ["#4185F3", "#427CDD", "#406AB2", "#3E5A8E", "#3B4A68", "#363C46"],
    series: [
      {
        data,
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}

export default HandsetHistoryGraph;
