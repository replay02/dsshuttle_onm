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
import clsx from "clsx";
import { green } from "@material-ui/core/colors";
import CircularProgress from "@material-ui/core/CircularProgress";
import Checkbox from "@material-ui/core/Checkbox";
import SnackBar from "@material-ui/core/Snackbar";

function createData(_id, writer, password, content) {
  return { _id, writer, password, content };
}

const useStyles = makeStyles(theme => ({
  parent: {
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
    alignItems: "center",
    justifyContent: "right"
  },
  wrapper: {
    margin: theme.spacing(1),
    position: "relative"
  },
  buttonSuccess: {
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[700]
    }
  },
  fabProgress: {
    color: green[500],
    position: "absolute",
    top: -6,
    left: -6,
    zIndex: 1
  },
  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12
  }
}));

export default function FreeBoard() {
  const classes = useStyles();

  const [rows, setRows] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);

  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const [selected, setSelected] = React.useState([]);

  var freeBoardApi = "http://3.16.116.97:8088/ss/onm/getFreeBoard";
  var freeBoardDeleteApi = "http://3.16.116.97:8088/ss/onm/deleteFreeBoard";

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success
  });

  const handleClickSave = () => {
    if (selected.length <= 0) {
      setSnackbarOpen("삭제할 게시글을 선택해 주세요");
      return;
    }
    setOpen(true);
  };

  function handleClose() {
    if (selected.length > 0) {
      handleDeleteBoard();
    }

    setOpen(false);
  }

  function handleDeleteBoard() {
    const fetchData = async () => {

      const result = await axios.post(
        freeBoardDeleteApi,
        {
          ids : selected
        }
        // {
        //   headers: {
        //     "Content-Type": "application/json"
        //   }
        // }
      );
      console.log(result.data.resMsg);

      if (result.data.resCode == 200) {
        handleRefresh();
      } else {
        setSnackbarOpen(result.data.resMsg);
      }
    };
    fetchData();
  }

  const isSelected = _id => selected.indexOf(_id) !== -1;

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelecteds = rows.map(n => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, _id) => {
    const selectedIndex = selected.indexOf(_id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, _id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  function handleRefresh() {
    setRows([]);

    setSuccess(false);
    setLoading(true);

    const fetchData = async () => {
      const results = await axios.get(freeBoardApi, {
        // params: {
        //   foo: 'bar'
        // }
      });
      console.log(results.data);

      var datas = new Array();

      for (var data of results.data) {
        datas.push(
          createData(data._id, data.writer, data.password, data.content)
        );
      }
      setRows(datas);

      setSuccess(true);
      setLoading(false);

      setTimeout(function() {
        setSuccess(false);
      }, 1000);
    };

    setSelected([]);
    fetchData();
  }

  // function handleConfirmRegist(id) {
  //   console.log("id : " + id);

  //   const fetchData = async () => {
  //     let data = JSON.stringify({
  //       id: id
  //     });
  //     const result = await axios.post(confirmApi, data, {
  //       headers: {
  //         "Content-Type": "application/json"
  //       }
  //     });

  //     console.log("handleConfirmRegist : " + JSON.stringify(result));

  //     handleRefresh();
  //   };
  //   fetchData();
  // }

  useEffect(() => {
    const fetchData = async () => {
      const results = await axios.get(freeBoardApi, {
        // params: {
        //   foo: 'bar'
        // }
      });
      console.log(results.data);

      var datas = new Array();

      for (var data of results.data) {
        datas.push(
          createData(data._id, data.writer, data.password, data.content)
        );
      }
      setRows(datas);
      setSelected([]);
    };
    fetchData();
  }, []);

  return (
    <React.Fragment>
      <Grid container spacing={3} className={classes.parent}>
        <Grid id="title" className={classes.title}>
          <Title>자유게시판</Title>
        </Grid>

        <div className={classes.root}>
          <Button
            style={{ marginRight: 20 }}
            variant="outlined"
            color="primary"
            onClick={handleClickSave}
          >
            삭제
          </Button>

          <Grid id="button-refresh" className={classes.wrapper}>
            <Fab
              aria-label="save"
              color="primary"
              className={buttonClassname}
              onClick={success ? null : handleRefresh}
            >
              {success ? <CheckIcon width={68} /> : <RefreshIcon />}
            </Fab>
            {loading && (
              <CircularProgress size={68} className={classes.fabProgress} />
            )}
          </Grid>
        </div>

        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"관리자 승인"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              선택한 게시글을 정말 삭제 하시겠습니까? 삭제된 글은 복구할 수
              없습니다.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={() => handleClose()} color="primary">
              취소
            </Button>
            <Button onClick={() => handleClose()} color="primary">
              확인
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                indeterminate={
                  selected.length > 0 && selected.length < rows.length
                }
                checked={selected.length === rows.length}
                onChange={handleSelectAllClick}
                inputProps={{ "aria-label": "select all" }}
              />
            </TableCell>
            <TableCell align="center">작성자</TableCell>
            <TableCell align="center">내용</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows
            ? rows.map((row, index) => {
                const isItemSelected = isSelected(row._id);
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <TableRow
                    hover
                    onClick={event => handleClick(event, row._id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    height={50}
                    key={row._id}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </TableCell>
                    <TableCell style={{minWidth:200}} align="center">{row.writer}</TableCell>
                    <TableCell align="center">{row.content}</TableCell>
                  </TableRow>
                );
              })
            : null}
        </TableBody>
      </Table>

      <SnackBar
        open={snackbarOpen ? true : false}
        onClose={() => setSnackbarOpen(null)}
        ContentProps={{
          "aria-describedby": "message-id"
        }}
        autoHideDuration={2000}
        message={<span id="message-id">{snackbarOpen}</span>}
      ></SnackBar>
    </React.Fragment>
  );
}
