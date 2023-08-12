import React from "react";
import Highcharts from "highcharts/";
import HighchartsReact from "highcharts-react-official";
import networkgraph from "highcharts/modules/networkgraph";

function LinkTree(props) {
  networkgraph(Highcharts);

  const data = props.data.map((res) => [res.servedmsisdn, res.callednumber]);
  const options = {
    chart: {
      type: "networkgraph",
      height: "100%",
    },
    title: {
      text: "Link-Tree Chart To represent caller data",
    },
    subtitle: {
      text: "",
    },
    // plotOptions: {
    //   networkgraph: {
    //     keys: ["from", "to"],
    //     layoutAlgorithm: {
    //       enableSimulation: true,
    //       friction: -0.9,
    //     },
    //   },
    // },
    series: [
      {
        dataLabels: {
          enabled: true,
          linkFormat: "",
        },
        id: "lang-tree",
        data,
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}

export default LinkTree;
