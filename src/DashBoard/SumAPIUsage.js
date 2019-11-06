/* eslint-disable no-script-url */

import React, { useEffect, useState } from "react";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Title from "../Title";
import {
  PieChart,
  Pie,
  Legend,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Sector,
  Label,
  LabelList
} from "recharts";
import { schemeCategory10 } from "d3-scale-chromatic";
import { scaleOrdinal } from "d3-scale";

import axios from "axios";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

const useStyles = makeStyles({
  depositContext: {
    flex: 1
  },
  root: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent:"space-between"
  },
  title: {
    paddingTop: "30px"
  },
});

const colors = scaleOrdinal(schemeCategory10).range();

const handlePieChartEnter = (a, b, c) => {
  console.log(a, b, c);
};

// const data01 = [
//   { name: 'Group A', value: 400, v: 89 },
//   { name: 'Group B', value: 300, v: 100 },
//   { name: 'Group C', value: 200, v: 200 },
//   { name: 'Group D', value: 200, v: 20 },
//   { name: 'Group E', value: 278, v: 40 },
//   { name: 'Group F', value: 189, v: 60 },
// ];

var data01 = [
  { _id: "/ss/api/regiUser", value: 0, name: "회원가입" },
  { _id: "/ss/api/logout", value: 0, name: "로그아웃" },
  { _id: "/ss/api/withraw", value: 0, name: "회원탈퇴" },
  { _id: "/ss/api/checkUserDupl", value: 0, name: "사번 중복체크(회원가입)" },
  { _id: "/ss/api/login", value: 0, name: "ID/PW 로그인" },
  { _id: "/ss/api/loginWithToken", value: 0, name: "로그인유지로 로그인" },
  { _id: "/ss/api/myInfo", value: 0, name: "내정보(사번) 조회" },
  { _id: "/ss/api/changePwd", value: 0, name: "비밀번호 변경" },
  { _id: "/ss/api/resetPwd", value: 0, name: "비밀번호 재설정" },
  { _id: "/ss/api/sendStuff", value: 0, name: "사송물품 보내기" },
  { _id: "/ss/api/regiPushToken", value: 0, name: "Push토큰 등록" },
  { _id: "/ss/api/checkPushUser", value: 0, name: "사송물품 수신인체크" },
  { _id: "/ss/api/boardcontents", value: 0, name: "게시판 조회" },
  { _id: "/ss/api/saveBoardcontents", value: 0, name: "게시판 글쓰기" },
  { _id: "/ss/api/deleteBoardcontents", value: 0, name: "게시판 글삭제" },
  { _id: "/ss/api/getSasongList", value: 0, name : "사송 조회"}
];

function compare(a, b) {
  if (a.value < b.value) {
    return 1;
  }
  if (a.value > b.value) {
    return -1;
  }
  return 0;
}

const renderActiveShape = props => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 20) * cos;
  const my = cy + (outerRadius + 20) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 11;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >
        {`${payload.value}회`}
      </text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

var play;

export default function SumAPIUsage() {
  const classes = useStyles();

  const [activeIndex, setActiveIndex] = useState(0);
  const [rows, setRows] = useState([]);
  const [checked, setChecked] = useState({
    checked: false
  });

  const handleSwitch = name => event => {
    setChecked({ [name]: event.target.checked });

    
    if(event.target.checked === true) {
      play = setInterval(function() {
        getData();
      }, 30000);
    }
    else {
      clearInterval(play);
    }
  };

  const onPieEnter = (data, index, e) => {
    setActiveIndex(index);
  };

  var dataApi = "http://3.16.116.97:8088/ss/onm/apiTotalCnt";

  // const getAllApiCnt = () => {
  //   const promise1 = axios.get(dataApi);

  //   Promise.all([promise1]).then(function(values) {
  //     console.log(values);

  //       for(var d = 0; d < data01.length; d++) {
  //         if(data01[d]._id === row._id) {
  //           data01[d].value = row.total;
  //         }
  //       }
  //     setRows(data01);
  //   });
  // }

  function getData() {
    setRows([]);
    const fetchData = async () => {
      const results = await axios.get(dataApi, {
        // params: {
        //   foo: 'bar'
        // }
      });
      console.log(results.data);

      for (let row of results.data) {
        for (var d = 0; d < data01.length; d++) {
          if (data01[d]._id === row._id) {
            data01[d].value = row.total;
          }
        }
      }

      data01.sort(compare);

      setRows(data01);
    };
    fetchData();
  }
  useEffect(() => {
    getData();
    // play = setInterval(function() {
    //   getData();
    // }, 30000);
  }, []);

  return (
    <React.Fragment>
      <div className={classes.root}>
        <Title className={classes.title}>누적 API 사용 통계</Title>

        <FormControlLabel
          control={
            <Switch
              checked={checked.checked}
              onChange={handleSwitch("checked")}
              value="checked"
            />
          }
          label="30초 자동 갱신"
        />
      </div>

      <ResponsiveContainer>
        <PieChart onMouseEnter={handlePieChartEnter}>
          <Pie
            data={rows}
            dataKey="value"
            innerRadius="50%"
            outerRadius="75%"
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            onMouseEnter={onPieEnter}
            isAnimationActive={true}
          >
            {rows.map((entry, index) => (
              <Cell key={`slice-${index}`} fill={colors[index % 10]} />
            ))}
            {/* <Label value="test" /> */}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
