import { useState, useContext, Fragment, useEffect } from "react";
import { StateContext } from "@/context/stateContext";
import classes from "./Chart.module.scss";
import c3 from "c3";
import "c3/c3.css";
import { sortPricesByDate } from "@/services/utility";

const Chart = ({ chartId, legend, companyData }) => {
  const { screenSize, setScreenSize } = useContext(StateContext);

  let dateValues = Object.keys(companyData.price);
  dateValues.unshift("x");

  let priceValues = Object.values(sortPricesByDate(companyData.price));
  priceValues.unshift(companyData.name);

  useEffect(() => {
    const chart = c3.generate({
      bindto: `#${chartId}`,
      data: {
        x: "x",
        columns: [dateValues, priceValues],
      },
      axis: {
        x: {
          type: "timeseries",
          tick: {
            format: "%Y-%m-%d",
          },
          show: screenSize !== "mobile",
        },
        y: {
          show: false,
        },
      },
      legend: {
        show: legend,
      },
      padding: {
        left: 20,
        right: 20,
      },
      tooltip: {
        format: {
          value: (value, ratio, id) => {
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          },
        },
      },
    });

    return () => {
      chart.destroy(); // Cleanup on unmount
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div id={chartId} className={classes.chart}></div>;
};

export default Chart;
