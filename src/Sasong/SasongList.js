/* eslint-disable no-script-url */

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import axios from "axios";
import React, { useEffect, useState } from "react";
import "react-circular-progressbar/dist/styles.css";
import Grid from "@material-ui/core/Grid";
import Title from "../Title";
import Button from "@material-ui/core/Button";

import IconButton from "@material-ui/core/IconButton";
import RefreshIcon from "@material-ui/icons/Refresh";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Fab from "@material-ui/core/Fab";
import CheckIcon from "@material-ui/icons/Check";
import clsx from "clsx";
import { green } from "@material-ui/core/colors";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Container } from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import SnackBar from "@material-ui/core/Snackbar";

function createData(_id, title, isAvailable) {
  return { _id, title, isAvailable };
}

const useStyles = makeStyles(theme => ({
  table: {
    flexDirection: "row"
  },
  table2: {
    flexDirection: "row",
    marginTop:50
  },

  parent: {
    // marginTop: "2px",
    marginBottom: "5px",
    // padding: "10px",
    flexGrow: 1,
    alignItems: "center",
    width: "100%",
    justifyContent: "center"
    // flexDirection: "column",
  },

  parent2: {
    marginTop: "2px",
    marginBottom: "5px",
    padding: "10px",
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "space-between"
  },

  title: {
    marginTop: "10px",
    marginLeft: "20px",
    alignItems: "center"
  },
  refresh: {
    marginLeft: "10px",
    // display: 'flex',
    alignItems: "center"
    // justifyContent: 'flex-end'
  },

  root: {
    display: "flex",
    alignItems: "center"
  },
  wrapper: {
    margin: theme.spacing(1),
    position: "relative"
  }
}));

export default function SasongList() {
  const date = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const classes = useStyles();

  const [edit, setEdit] = useState(false);
  const [rows, setRows] = useState(null);
  const [rows2, setRows2] = useState(null);
  const [open, setOpen] = useState(null);

  var getApi = "http://3.16.116.97:8088/ss/onm/getSasongList";
  var saveApi = "http://3.16.116.97:8088/ss/onm/saveSasongList";

  function handleSave() {
    const fetchData = async () => {
 
      let data = JSON.stringify({
        [date[0]]: {
          bundang: rows[0].datas,
          bangbae: rows2[0].datas
        },
        [date[1]]: {
          bundang: rows[1].datas,
          bangbae: rows2[1].datas
        },
        [date[2]]: {
          bundang: rows[2].datas,
          bangbae: rows2[2].datas
        },
        [date[3]]: {
          bundang: rows[3].datas,
          bangbae: rows2[3].datas
        },
        [date[4]]: {
          bundang: rows[4].datas,
          bangbae: rows2[4].datas
        },
        [date[5]]: {
          bundang: rows[5].datas,
          bangbae: rows2[5].datas
        },
        [date[6]]: {
          bundang: rows[6].datas,
          bangbae: rows2[6].datas
        }
      });

      const result = await axios.post(saveApi, data, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      console.log("handleSave : " + JSON.stringify(result));
      setOpen(result.data.resMsg);
      // setTimeout(function() {
      //   setOpen(null);
      // }, 2000);
    };

    fetchData().catch(err => {
      setOpen(err.toString());
    });
  }

  const handleBundangSwitch = (date, index) => event => {
    let array = [...rows]; // create TRUE copy
    array[date].datas[index].isAvailable = !array[date].datas[index].isAvailable;
    setRows(array);
  };

  const handleBangbaeSwitch = (date, index) => event => {
    let array2 = [...rows2]; // create TRUE copy
    array2[date].datas[index].isAvailable = !array2[date].datas[index].isAvailable;
    setRows2(array2);
  };

  useEffect(() => {
    const fetchData = async () => {
      const results = await axios.get(getApi, {
        // params: {
        //   foo: 'bar'
        // }
      });
      console.log(results.data[0]);

      var totalBundangDatas = new Array();
      var totalBangbaeDatas = new Array();
      for (var d of date) {
        var bundangDatas = new Array();
        var bangbaeDatas = new Array();
        let tmp = results.data[0][d].bundang;
        let tmp2 = results.data[0][d].bangbae;
        for (var data of tmp) {
          bundangDatas.push(createData(data._id, data.title, data.isAvailable));
        }

        for (var data of tmp2) {
          bangbaeDatas.push(createData(data._id, data.title, data.isAvailable));
        }

        totalBundangDatas.push({ key: d, datas: bundangDatas });
        totalBangbaeDatas.push({ key: d, datas: bangbaeDatas });
      }

      let str = JSON.stringify(totalBundangDatas);
      console.log("totalBundangDatas : " + str);

      setRows(totalBundangDatas);
      setRows2(totalBangbaeDatas);
    };
    fetchData();
  }, []);

  return (
    <React.Fragment>
      <Grid container spacing={3} className={classes.parent2}>
        <Grid id="title" className={classes.title}>
          {/* <Title>출발 시간표</Title> */}
        </Grid>
        <Grid id="button-refresh" className={classes.wrapper}>
          <Button variant="outlined" color="primary" onClick={handleSave}>
            저장
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={3} className={classes.parent}>
        {/* 분당->방배 */}
        <Grid>
          <Table className={classes.table} size="small">
            <TableHead>
              <TableRow>
                {rows ? <TableCell align="center"><Title>분당출발</Title></TableCell> : null}

                {rows
                  ? rows[0].datas.map((row, i) => (
                      <TableCell align="justify">{row.title}</TableCell>
                    ))
                  : null}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                ? date.map((dateRow, index) => (
                    <TableRow key={rows[index]._id}>
                      <TableCell align="center">{dateRow}</TableCell>
                      {rows[index].datas.map((row, i) => (
                        <TableCell align="right">
                          <FormControlLabel
                            control={
                              <Switch
                                checked={row.isAvailable}
                                onChange={handleBundangSwitch(index, i)}
                                value="row"
                              />
                            }
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                : null}
            </TableBody>
          </Table>
        </Grid>

        {/* 방배->분당 */}
        <Grid>
          <Table className={classes.table2} size="small">
            <TableHead>
              <TableRow>
                {rows2 ? <TableCell align="center"><Title>방배출발</Title></TableCell> : null}

                {rows2
                  ? rows2[0].datas.map((row, i) => (
                      <TableCell align="left">{row.title}</TableCell>
                    ))
                  : null}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows2
                ? date.map((dateRow, index) => (
                    <TableRow key={rows2[index]._id}>
                      <TableCell align="center">{dateRow}</TableCell>
                      {rows2[index].datas.map((row, i) => (
                        <TableCell align="right">
                          <FormControlLabel
                            control={
                              <Switch
                                checked={row.isAvailable}
                                onChange={handleBangbaeSwitch(index, i)}
                                value="row"
                              />
                            }
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                : null}
            </TableBody>
          </Table>
        </Grid>
      </Grid>
      <SnackBar
        open={open ? true : false}
        onClose={() => setOpen(null)}
        ContentProps={{
          "aria-describedby": "message-id"
        }}
        autoHideDuration={2000}
        message={<span id="message-id">{open}</span>}
      ></SnackBar>
    </React.Fragment>
  );
}
