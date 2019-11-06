/* eslint-disable no-script-url */

import React, { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Title from '../Title';
import { ScatterChart, Scatter, CartesianGrid, Tooltip, Legend,
  XAxis, YAxis, ZAxis, ReferenceLine, ReferenceDot,ResponsiveContainer, ReferenceArea, ErrorBar,
  LabelList } from 'recharts';
import axios from "axios";

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

export default function ScatterAPIUsage() {
  const classes = useStyles();

  const [rows, setRows] = useState([]);

  var dataApi = "http://3.16.116.97:8088/ss/onm/apiDayTime";


  useEffect(() => {
    const fetchData = async () => {
      const results = await axios.get(dataApi, {
        // params: {
        //   foo: 'bar'
        // }
      });
      console.log(results.data);

      var datas = new Array();
      for (let row of results.data) {
        if(row.day === null || row.time === null) {
          continue;
        }
        datas.push(row);
      }
      
      setRows(datas);
    };
    fetchData();
  }, []);


  return (
    <React.Fragment>
      <Title>요일별 API 호출 분포</Title>
      <ResponsiveContainer>

          <ScatterChart margin={{ top: 20, right: 20, bottom: 0, left: 20 }}>
            <XAxis 
              type="category" 
              dataKey="time" 
              name="시간" 
              domain={
                ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", 
                "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"]
                }  
                allowDuplicatedCategory={false}/>
            <YAxis 
              type="category" 
              name="요일" 
              dataKey="day" 
              domain={['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']} 
              allowDuplicatedCategory={false} />
            <ZAxis 
              type="number" 
              dataKey="total" 
              range={[10, 1000]} 
              name="호출횟수" unit="회" />
            {/* <CartesianGrid /> */}
            <Scatter 
              name="API 호출 분포" 
              data={rows}
              fillOpacity={0.7} 
              shape="circle"
              fill="#418cff" />
            <Tooltip position={{ x: 150, y: 10 }}></Tooltip>

            {/* <Legend/> */}
            {/* <ReferenceArea x1={250} x2={300} alwaysShow label="any label" />
            <ReferenceLine x={159} stroke="red"/>
            <ReferenceLine y={237.5} stroke="red"/>
            <ReferenceDot x={170} y={290} r={15} label="AB" stroke="none" fill="red" isFront/> */}
          </ScatterChart>


          </ResponsiveContainer>
    </React.Fragment>
  );
}
