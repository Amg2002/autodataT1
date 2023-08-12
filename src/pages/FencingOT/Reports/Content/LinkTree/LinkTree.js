import React from "react";
import Highcharts from "highcharts/";
import HighchartsReact from "highcharts-react-official";
import networkgraph from "highcharts/modules/networkgraph";


function LinkTree(props) {

  Highcharts.addEvent(
    Highcharts.Series, 
    'click',
    function(e){
      props.searchMsisdn(e.point.id);
    }
  )

  Highcharts.addEvent(
    Highcharts.Series,
    'afterSetOptions',
    function (e) {
        var colors = Highcharts.getOptions().colors,
        i = 1,
        nodes = {};

        let mainMsisdn = props.mainMsisdn;
        let msisdnList = Object.keys(props.data);

        if (
            this instanceof Highcharts.seriesTypes.networkgraph &&
            e.options.id === 'caller-data'
        ) {
            e.options.data.forEach(function (link) {
              if(link[0] === mainMsisdn){
                nodes[mainMsisdn] = {
                  id: mainMsisdn,
                  marker: {
                      radius: 25
                  }
                };
                
                if(msisdnList.includes(link[1].toString())){
                  nodes[link[1]] = {
                      id: link[1],
                      marker: {
                          radius: 25
                      },
                      color: colors[i++]
                  };
                }
              }else if (nodes[link[0]] && nodes[link[0]].color) {
                nodes[link[1]] = {
                  id: link[1],
                  color: nodes[link[0]].color,
                  marker: {
                    radius: 25
                  },
                };
              }
            });

            e.options.nodes = Object.keys(nodes).map(function (id) {
              return nodes[id];
            });
        }
    }
);

  networkgraph(Highcharts);

  let data=[];
  for(let servedmsisdn in props.data){
    props.data[servedmsisdn].forEach(callednumber => {
      data.push([servedmsisdn, callednumber])
    }); 
  }

  const options = {
    chart: {
      type: "networkgraph",
      height: "100%",
    },
    title: {
      text: "Link-Tree Chart To represent caller data",
    },
    subtitle: {
      text: Object.keys(props.data).length? "" : 'No Data Found',
    },
    series: [
      {
        marker: {
          radius: 25
        },
        dataLabels: {
          enabled: true,
          linkFormat: "",
        },
        id: "caller-data",
        data,
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}

export default LinkTree;
