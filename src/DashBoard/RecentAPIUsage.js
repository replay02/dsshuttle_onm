import Title from "../Title";
import {
  ScatterChart,
  Scatter,
  CartesianGrid,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  ZAxis,
  ReferenceLine,
  ReferenceDot,
  ReferenceArea,
  ErrorBar,
  LabelList,
  ResponsiveContainer,
  BarChart,
  Bar,
  Brush,
  Cell
} from "recharts";

import axios from "axios";
import React, { useEffect, useState } from "react";

import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles } from '@material-ui/core/styles';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { scaleOrdinal } from 'd3-scale';


const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems:'center'
  },
  formControl: {
    // margin: theme.spacing(1),
    marginBottom:15,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  title: {
    paddingTop: "30px",
    // marginLeft: "20px",
  },
  intput: {
    // marginTop: "10px",
    marginLeft: "20px",
    // alignItems: "center"
  }
}));

function getDateString(tzOffset, option) {
  // option : 0이 오늘, 1은 어제 2는 그저께.... 
  var now = new Date();
  var tz =
  now.getTime() -
  option * 24 * 3600000 +
  now.getTimezoneOffset() * 60000 +
  tzOffset * 3600000;

  now.setTime(tz);

  var s =
    leadingZeros(now.getFullYear(), 4) +
    "-" +
    leadingZeros(now.getMonth() + 1, 2) +
    "-" +
    leadingZeros(now.getDate(), 2);

  return s;
}

function leadingZeros(n, digits) {
  var zero = "";
  // n = n.toString();

  n = String(n);

  if (n.length < digits) {
    for (var i = 0; i < digits - n.length; i++) {
      zero += "0";
    }
  }
  return zero + n;
}

export default function RecentAPIUsage() {
  const [rows, setRows] = useState([]);

  const [values, setValues] = React.useState({
    day: 3,
    array : [1,2,3]
  });

  var dataApi = "http://3.16.116.97:8088/ss/onm/apiUseCnt";
  // var dataApi2 = "http://3.16.116.97:8088/ss/onm/apiUseCntByDay";  // not use 향후 확장성을 위해 남겨둠

  let day1 = getDateString(+9, 0);
  let day2 = getDateString(+9, 1);
  let day3 = getDateString(+9, 2);
  let day7_1 = getDateString(+9, 0);
  let day7_2 = getDateString(+9, 1);
  let day7_3 = getDateString(+9, 2);
  let day7_4 = getDateString(+9, 3);
  let day7_5 = getDateString(+9, 4);
  let day7_6 = getDateString(+9, 5);
  let day7_7 = getDateString(+9, 6);


  var allAPIDatas = [
    { _id: "/ss/api/regiUser",            d1: 0, d2: 0, d3: 0 , name : "회원가입" },
    { _id: "/ss/api/logout",              d1: 0, d2: 0, d3: 0 , name : "로그아웃" },
    { _id: "/ss/api/withraw",             d1: 0, d2: 0, d3: 0 , name : "회원탈퇴"},
    { _id: "/ss/api/checkUserDupl",       d1: 0, d2: 0, d3: 0 , name : "사번 중복체크(회원가입)" },
    { _id: "/ss/api/login",               d1: 0, d2: 0, d3: 0 , name : "ID/PW 로그인" },
    { _id: "/ss/api/loginWithToken",      d1: 0, d2: 0, d3: 0 , name : "로그인유지로 로그인"},
    { _id: "/ss/api/myInfo",              d1: 0, d2: 0, d3: 0 , name : "내정보(사번) 조회"},
    { _id: "/ss/api/changePwd",           d1: 0, d2: 0, d3: 0 , name : "비밀번호 변경"},
    { _id: "/ss/api/resetPwd",            d1: 0, d2: 0, d3: 0 , name : "비밀번호 재설정"},
    { _id: "/ss/api/sendStuff",           d1: 0, d2: 0, d3: 0 , name : "사송물품 보내기"},
    { _id: "/ss/api/regiPushToken",       d1: 0, d2: 0, d3: 0 , name : "Push토큰 등록"},
    { _id: "/ss/api/checkPushUser",       d1: 0, d2: 0, d3: 0 , name : "사송물품 수신인체크"},
    { _id: "/ss/api/boardcontents",       d1: 0, d2: 0, d3: 0 , name : "게시판 조회"},
    { _id: "/ss/api/saveBoardcontents",   d1: 0, d2: 0, d3: 0 , name : "게시판 글쓰기"},
    { _id: "/ss/api/deleteBoardcontents", d1: 0, d2: 0, d3: 0 , name : "게시판 글삭제"},
    { _id: "/ss/api/getSasongList",       d1: 0, d2: 0, d3: 0 , name : "사송 조회"}
  ];

  var allAPIDatas2 = [
    { _id: "/ss/api/regiUser",            d1: 0, d2: 0, d3: 0 , d4: 0, d5: 0 ,d6: 0,d7: 0 , name : "회원가입" },
    { _id: "/ss/api/logout",              d1: 0, d2: 0, d3: 0 , d4: 0, d5: 0 ,d6: 0,d7: 0 , name : "로그아웃" },
    { _id: "/ss/api/withraw",             d1: 0, d2: 0, d3: 0 , d4: 0, d5: 0 ,d6: 0,d7: 0 , name : "회원탈퇴"},
    { _id: "/ss/api/checkUserDupl",       d1: 0, d2: 0, d3: 0 , d4: 0, d5: 0 ,d6: 0,d7: 0 , name : "사번 중복체크(회원가입)" },
    { _id: "/ss/api/login",               d1: 0, d2: 0, d3: 0 , d4: 0, d5: 0 ,d6: 0,d7: 0 , name : "ID/PW 로그인" },
    { _id: "/ss/api/loginWithToken",      d1: 0, d2: 0, d3: 0 , d4: 0, d5: 0 ,d6: 0,d7: 0 , name : "로그인유지로 로그인"},
    { _id: "/ss/api/myInfo",              d1: 0, d2: 0, d3: 0 , d4: 0, d5: 0 ,d6: 0,d7: 0 , name : "내정보(사번) 조회"},
    { _id: "/ss/api/changePwd",           d1: 0, d2: 0, d3: 0 , d4: 0, d5: 0 ,d6: 0,d7: 0 , name : "비밀번호 변경"},
    { _id: "/ss/api/resetPwd",            d1: 0, d2: 0, d3: 0 , d4: 0, d5: 0 ,d6: 0,d7: 0 , name : "비밀번호 재설정"},
    { _id: "/ss/api/sendStuff",           d1: 0, d2: 0, d3: 0 , d4: 0, d5: 0 ,d6: 0,d7: 0 , name : "사송물품 보내기"},
    { _id: "/ss/api/regiPushToken",       d1: 0, d2: 0, d3: 0 , d4: 0, d5: 0 ,d6: 0,d7: 0 , name : "Push토큰 등록"},
    { _id: "/ss/api/checkPushUser",       d1: 0, d2: 0, d3: 0 , d4: 0, d5: 0 ,d6: 0,d7: 0 , name : "사송물품 수신인체크"},
    { _id: "/ss/api/boardcontents",       d1: 0, d2: 0, d3: 0 , d4: 0, d5: 0 ,d6: 0,d7: 0 , name : "게시판 조회"},
    { _id: "/ss/api/saveBoardcontents",   d1: 0, d2: 0, d3: 0 , d4: 0, d5: 0 ,d6: 0,d7: 0 , name : "게시판 글쓰기"},
    { _id: "/ss/api/deleteBoardcontents", d1: 0, d2: 0, d3: 0 , d4: 0, d5: 0 ,d6: 0,d7: 0 , name : "게시판 글삭제"},
    { _id: "/ss/api/getSasongList",       d1: 0, d2: 0, d3: 0 , d4: 0, d5: 0 ,d6: 0,d7: 0 , name : "사송 조회"}
  ];


  const classes = useStyles();
  const inputLabel = React.useRef(null);

  const colors = scaleOrdinal(schemeCategory10).range();

  function makeDayBarChart(total,i) {

    var data = eval("'" + 'd' + (i+1) + "'");

    var day;
    if(i==total-1) {
      day = '오늘'; 
    }
    else {
      day = eval("'" + (total -1 - i)+ '일전' + "'");
    }

    return (
      <Bar dataKey={data} fill={colors[i % total]} radius={[5, 5, 0, 0]} name={day}/>
    )
  }

  const handleChange = event => {

    var d = event.target.value; 
    var array = [];

    console.log("event.target.value : " + event.target.value);
    if(d == 3) {
      array = [1,2,3]
    }
    else {
      array = [1,2,3,4,5,6,7]
    }

    setValues({
      // ...oldValues,
      // day : event.target.value ,
      array : array,
      [event.target.name]: event.target.value,
    });

    if(d == 3) {
      get3DaysData()
    }
    else {
      get7DaysData()
    }
  };

  const get7DaysData = () => {
    setRows([]);
    const promise1 = axios.post(dataApi, {
      date: day7_1
    });
    const promise2 = axios.post(dataApi, {
      date: day7_2
    });
    const promise3 = axios.post(dataApi, {
      date: day7_3
    });
    const promise4 = axios.post(dataApi, {
      date: day7_4
    });
    const promise5 = axios.post(dataApi, {
      date: day7_5
    });
    const promise6 = axios.post(dataApi, {
      date: day7_6
    });
    const promise7 = axios.post(dataApi, {
      date: day7_7
    });

    Promise.all([promise7, promise6, promise5,promise4,promise3,promise2,promise1]).then(function(values) {
      console.log(values);

      for(let j = 0; j < 7; j++) {
        var tmp = eval("'" + 'd' +(j+1) + "'");
        for(let row of values[j].data) {
          for(var d = 0; d < allAPIDatas2.length; d++) {
            if(allAPIDatas2[d]._id === row._id) {
              allAPIDatas2[d][tmp] = row.total;
              break;
            }
          }
        }
      }
      setRows(allAPIDatas2);
    });
  }


  const get3DaysData = () => {
    setRows([]);
    const promise1 = axios.post(dataApi, {
      date: day1
    });
    const promise2 = axios.post(dataApi, {
      date: day2
    });
    const promise3 = axios.post(dataApi, {
      date: day3
    });

    Promise.all([promise3, promise2, promise1]).then(function(values) {
      console.log(values);

      for(let j = 0; j < 3; j++) {
        var tmp = eval("'" + 'd' +(j+1) + "'");
        for(let row of values[j].data) {
          for(var d = 0; d < allAPIDatas.length; d++) {
            if(allAPIDatas[d]._id === row._id) {
              allAPIDatas[d][tmp] = row.total;
              break;
            }
          }
        }
      }

      setRows(allAPIDatas);
    });
  }
  
  useEffect(() => {
    get3DaysData();
  }, []);
  
  return (
    <React.Fragment>
      <div className={classes.root}>
        <Title className={classes.title}>최근 API 사용 현황</Title>
        <FormControl className={classes.formControl}>
          <InputLabel className={classes.intput} ref={inputLabel} htmlFor="age-simple">
            날짜선택
          </InputLabel>
          <Select
            className={classes.intput}
            value={values.day}
            onChange={handleChange}
            labelWidth={100}
            inputProps={{
              name: 'day',
              id: 'age-simple',
            }}
          >
            {/* <MenuItem value="">
              <em>None</em>
            </MenuItem> */}
            <MenuItem value={3}>최근 3일</MenuItem>
            <MenuItem value={7}>최근 7일</MenuItem>
          </Select>
        </FormControl>
      </div>


      <ResponsiveContainer>
        <BarChart
          // width={1100}
          // height={250}
          barGap={1}
          barSize={values.day==3 ? 12:5}
          data={rows}
          margin={{ top: 0, right: 30, bottom: 0, left: 0 }}
        >
          <XAxis dataKey="name" height={120} type="category" 
          angle={-45} textAnchor="middle" dy={50} interval={0}
              />
          <YAxis tickCount={7} />
          <Tooltip position={{ x: '50%', y: -50 }}></Tooltip>
          <Legend align='right' verticalAlign='top'></Legend>
          {/* <CartesianGrid /> */}

          {values.array.length > 0 ?values.array.map((row,index) => (   
            makeDayBarChart(values.array.length, index)
          )):null}
          
          {/* 확대 축소 */}
          {/* <Brush dataKey="name" height={20} /> */}
          <ReferenceLine type="horizontal" value={0} stroke="#666" /> 
          
        </BarChart>

      </ResponsiveContainer>
    </React.Fragment>
  );
}
