/**
 *  Copyright (c) 2016, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from "react";
import Ring from "ringjs";

import {
    TimeSeries,
    TimeRange,
    TimeEvent,
    Pipeline as pipeline,
    Stream,
    EventOut,
    percentile
} from "pondjs";

import {ChartContainer} from "react-timeseries-charts";
import {ChartRow} from "react-timeseries-charts";
import {Charts} from "react-timeseries-charts";
import {YAxis} from "react-timeseries-charts";
import {BandChart} from "react-timeseries-charts";
import {BarChart} from "react-timeseries-charts";
import {LineChart} from "react-timeseries-charts";

import {Resizable} from "react-timeseries-charts";
import {Legend} from "react-timeseries-charts";
import {styler} from "react-timeseries-charts";

// import realtime_docs from "./realtime_docs.md";
// import realtime_thumbnail from "./realtime_thumbnail.png";

const sec = 1000;
const minute = 60 * sec;
const hours = 60 * minute;
const rate = 1000;

class realtime extends React.Component {
    static displayName = "AggregatorDemo";

    state = {
        time: new Date(),
        events: new Ring(200),
        percentile50Out: new Ring(100)
    };

    getNewEvent = t => {
        const base = Math.sin(t.getTime() / 10000000) * 350 + 500;
        return new TimeEvent(t, parseInt(base + Math.random() * 1000, 10));
    };

    setWebSocket() {
        var ws = new WebSocket("ws://3.16.116.97:3001/websocket/realtime");

        // 연결이 수립되면 서버에 메시지를 전송한다
        ws.onopen = function(event) {
            ws.send("Client Connect!");
        }

        // 서버로 부터 메시지를 수신한다
        ws.onmessage = function(event) {
            console.log("Server message: ", event.data);
        }

        // error event handler
        ws.onerror = function(event) {
            console.log("Server error message: ", event.data);
        }
    }
    
    componentDidMount() {

        this.stream = new Stream();

        pipeline()
            .from(this.stream)
            .windowBy("5m")
            .emitOn("discard")
            .aggregate({
                value: { value: percentile(50) }
            })
            .to(EventOut, event => {
                const events = this.state.percentile50Out;
                events.push(event);
                this.setState({ percentile50Out: events });
            });

        const increment = sec;


        // get and set data
        this.interval = setInterval(() => {
            const t = new Date(this.state.time.getTime() + increment);
            const event = this.getNewEvent(t);

            // Raw events
            const newEvents = this.state.events;
            newEvents.push(event);
            this.setState({ time: t, events: newEvents });

            // Let our aggregators process the event
            this.stream.addEvent(event);
        }, rate);

        this.setWebSocket();
    }

    

    makeTimeString(date) {
        var yyyy = date.getFullYear().toString();
        var mm = (date.getMonth() + 1).toString();
        var dd = date.getDate().toString();

        var HH = date.getHours().toString();
        var m = date.getMinutes().toString();
        var s = date.getSeconds().toString();

        return  yyyy + "년 " + (mm[1] ? mm : "0" + mm[0]) + "월 " + (dd[1] ? dd : "0" + dd[0]) + "일 " + " " + HH + "시 " + m + "분 " + s + "초";
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        const latestTime = this.state.time;

        const lineStyle = {
            value: {
                stroke: "#a02c2c",
                opacity: 0.2
            }
        };
  
        const perc50Series = new TimeSeries({
            name: "five minute perc50",
            events: this.state.percentile50Out.toArray()
        });


        // Timerange for the chart axis
        const initialBeginTime = new Date();
        const timeWindow = 1 * hours;

        let beginTime;
        const endTime = new Date(this.state.time.getTime() + minute);
        if (endTime.getTime() - timeWindow < initialBeginTime.getTime()) {
            beginTime = initialBeginTime;
        } else {
            beginTime = new Date(endTime.getTime() - timeWindow);
        }
        const timeRange = new TimeRange(beginTime, endTime);


        // Charts (after a certain amount of time, just show hourly rollup)
        const charts = (
            <Charts>
                <LineChart axis="y" interpolation="curveBasis" series={perc50Series} style={lineStyle}/>
            </Charts>
        );

        const dateStyle = {
            fontSize: 15,
            color: "#AAA",
            borderWidth: 1,
            borderColor: "#F4F4F4"
        };

        const style = styler([
            { key: "perc50", color: "#C5DCB7", width: 1, dashed: true }
        ]);

        return (
            <div>
                <div className="row">
                    <div className="col-md-4">
                        <Legend
                            type="swatch"
                            style={style}
                            categories={[
                                {
                                    key: "perc50",
                                    label: "50th Percentile",
                                    style: { fill: "#C5DCB7" }
                                }
                            ]}
                        />
                    </div>
                    <div className="col-md-8">
                        <span style={dateStyle}>{this.makeTimeString(latestTime)}</span>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-md-12">
                        <Resizable>
                            <ChartContainer timeRange={timeRange}>
                                <ChartRow height="150">
                                    <YAxis
                                        id="y"
                                        label="Value"
                                        min={0}
                                        max={1500}
                                        width="70"
                                        type="linear"
                                    />
                                    {charts}
                                </ChartRow>
                            </ChartContainer>
                        </Resizable>
                    </div>
                </div>
            </div>
        );
    }
}

// Export example
// export default { realtime, realtime_docs, realtime_thumbnail };
export default realtime;