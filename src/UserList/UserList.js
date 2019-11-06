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

import IconButton from "@material-ui/core/IconButton";
import RefreshIcon from "@material-ui/icons/Refresh";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";

import Fab from "@material-ui/core/Fab";
import CheckIcon from "@material-ui/icons/Check";
import SaveIcon from "@material-ui/icons/Save";
import clsx from 'clsx';
import { green } from '@material-ui/core/colors';
import CircularProgress from '@material-ui/core/CircularProgress';

function createData(
  _id,
  comNum,
  name,
  email,
  phone,
  lastLoginDate,
  emailYN,
  confirmYN
) {
  return { _id, comNum, name, email, phone, lastLoginDate, emailYN, confirmYN };
}

const useStyles = makeStyles(theme => ({
  parent: {
    marginTop: "2px",
    marginBottom: "5px",
    padding: '10px',
    flexGrow: 1,
    alignItems: "center",
    justifyContent: 'space-between'
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
    display: 'flex',
    alignItems: 'center',
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  fabProgress: {
    color: green[500],
    position: 'absolute',
    top: -6,
    left: -6,
    zIndex: 1,
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

export default function UserList() {
  const classes = useStyles();

  const [rows, setRows] = useState(null);
  const [open, setOpen] = React.useState(false);


  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  var userApi = "http://3.16.116.97:8088/ss/onm/user";
  var confirmApi = "http://3.16.116.97:8088/ss/onm/confirmUser";


  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });


  const handleClickOpen = () => {
    setOpen(true);
  };

  function handleClose(id) {
    console.log("id : " + id);

    if (id != null) {
      handleConfirmRegist(id);
    }
    setOpen(false);
  }

  function handleRefresh() {
    setRows(null);

    setSuccess(false);
    setLoading(true);

    const fetchData = async () => {
      const results = await axios.get(userApi, {
        // params: {
        //   foo: 'bar'
        // }
      });
      console.log(results.data[0]);

      var datas = new Array();

      for (var data of results.data) {
        datas.push(
          createData(
            data._id,
            data.id,
            data.name,
            data.email,
            data.phone,
            data.last_login_date,
            data.validate_email,
            data.register_confirm
          )
        );
      }
      setRows(datas);

      setSuccess(true);
      setLoading(false);

      setTimeout(function() {
        setSuccess(false);
      }, 1000);

    };
    fetchData();
  }

  function handleConfirmRegist(id) {
    console.log("id : " + id);

    const fetchData = async () => {
      let data = JSON.stringify({
        id: id
      });
      const result = await axios.post(confirmApi, data, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      console.log("handleConfirmRegist : " + JSON.stringify(result));

      handleRefresh();
    };
    fetchData();
  }

  useEffect(() => {
    const fetchData = async () => {
      const results = await axios.get(userApi, {
        // params: {
        //   foo: 'bar'
        // }
      });
      console.log(results.data[0]);

      var datas = new Array();

      for (var data of results.data) {
        datas.push(
          createData(
            data._id,
            data.id,
            data.name,
            data.email,
            data.phone,
            data.last_login_date,
            data.validate_email,
            data.register_confirm
          )
        );
      }
      setRows(datas);
    };
    fetchData();
  }, []);


  return (
    <React.Fragment>
      <Grid container spacing={3} className={classes.parent}>
        <Grid id="title" className={classes.title}>
          <Title>사용자 현황</Title>
        </Grid>
        <Grid id="button-refresh" className={classes.wrapper}>
          {/* <IconButton
            color="primary"
            className={classes.button}
            aria-label="다시 불러오기"
          >
            <RefreshIcon onClick={handleRefresh} />
          </IconButton> */}
          <Fab
            aria-label="save"
            color="primary"
            className={buttonClassname}
            onClick={success?null:handleRefresh}
          >
            {success ? <CheckIcon width={68}/> : <RefreshIcon />}
          </Fab>
          {loading && (
            <CircularProgress size={68} className={classes.fabProgress} />
          )}
        </Grid>
      </Grid>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell align="center">사번</TableCell>
            <TableCell align="center">이름</TableCell>
            <TableCell align="center">이메일</TableCell>
            <TableCell align="center">전화번호</TableCell>
            <TableCell align="center">최종 로그인</TableCell>
            <TableCell align="center">이메일 인증</TableCell>
            <TableCell align="center">관리자 확인</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows
            ? rows.map(row => (
                <TableRow height={50} key={row._id}>
                  <TableCell align="center">{row.comNum}</TableCell>
                  <TableCell align="center">{row.name}</TableCell>
                  <TableCell align="center">{row.email}</TableCell>
                  <TableCell align="center">{row.phone}</TableCell>
                  <TableCell align="center">{row.lastLoginDate}</TableCell>
                  <TableCell align="center">
                    {row.emailYN ? "완료" : "대기"}
                  </TableCell>
                  <TableCell align="center">
                    {row.confirmYN ? (
                      "완료"
                    ) : (
                      <div>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={handleClickOpen}
                        >
                          승인
                        </Button>
                        <Dialog
                          open={open}
                          onClose={handleClose}
                          aria-labelledby="alert-dialog-title"
                          aria-describedby="alert-dialog-description"
                        >
                          <DialogTitle id="alert-dialog-title">
                            {"관리자 승인"}
                          </DialogTitle>
                          <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                              사번, 이름, 전화번호 등의 정보를 확인 해 주세요.
                              확인 버튼 클릭 시, 가입이 완료 됩니다.
                            </DialogContentText>
                          </DialogContent>
                          <DialogActions>
                            <Button
                              onClick={() => handleClose(null)}
                              color="primary"
                            >
                              취소
                            </Button>
                            <Button
                              onClick={() => handleClose(row.comNum)}
                              color="primary"
                              autoFocus
                            >
                              확인
                            </Button>
                          </DialogActions>
                        </Dialog>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            : null}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}
