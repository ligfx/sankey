import "./App.css";

import { useMemo, useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import * as highchartsSankey from "highcharts/modules/sankey";
//npm install highcharts highcharts-react-official highcharts-sankey

import {
  client,
  useConfig,
  useElementData,
} from "@sigmacomputing/plugin";

highchartsSankey(Highcharts);

client.config.configureEditorPanel([
  { name: "source", type: "element" },
  { name: "dimension", type: "column", source: "source", allowMultiple: true },
  { name: "measures", type: "column", source: "source", allowMultiple: true },
]);

function App() {
  const config = useConfig();
  const sigmaData = useElementData(config.source);
  const ref = useRef();
  const options = useMemo(() => {
    const dimensions = config.dimension;
    const measures = config.measures;

    // transform sigmaData --> sankey data
    let dataMap = [];
    if (sigmaData?.[dimensions[0]]) {
      for (let i = 0; i < dimensions.length - 1; i++) {
        for (let j = 0; j < sigmaData[dimensions[i]].length; j++) {
          const from = sigmaData[dimensions[i]][j];
          const to = sigmaData[dimensions[i + 1]][j];
          const weight = sigmaData[measures[i]][j];
          const dataPoint = [from, to, weight];
          dataMap[dataPoint] = dataPoint;
        }
      }
      let data = [];
      let i = 0;
      for (var key in dataMap) {
        data[i] = dataMap[key];
        i++;
      }
      const options = {
        title: {
          text: undefined,
        },
        chart: {
          height: window.innerHeight,
          backgroundColor: "transparent",
        },
        accessibility: {
          point: {
            valueDescriptionFormat:
              "{index}. {point.from} to {point.to}, {point.weight}.",
          },
        },
        series: [
          {
            keys: ["from", "to", "weight"],
            data: data,
            type: "sankey",
            name: "Sankey demo series",
          },
        ],
      };
      return options;
    }
  }, [config, sigmaData]);

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} ref={ref} />
    </div>
  );
}

export default App;