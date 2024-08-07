import React, { useEffect, useState } from 'react'
import { Chart as ChartJS } from 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import '../assets/css/Chart.css';
import crash from '../assets/images/crash.png';
import lose from '../assets/images/lose.png';
import onPlay from '../assets/sound/onPlay.mp3';
import error from '../assets/sound/error.mp3';
import buttonClick from '../assets/sound/button click.mp3';
import buttonClickCoins from '../assets/sound/coins.mp3';
import menu from '../assets/images/menu.png';

function CrashGAME() {

    // audio sound on play
    const [audio] = useState(new Audio(onPlay));
    const [audioFailed] = useState(new Audio(error));
    const [clicked] = useState(new Audio(buttonClick));
    const [coins] = useState(new Audio(buttonClickCoins));

    // initialize label on x and y axes
    const [resultTimes, setResultTimes] = useState(0);
    const [maxLimitX, setMaxLimitX] = useState(20);
    const [maxLimitY, setMaxLimitY] = useState(10);

    // set bet ammount
    const [number, setNumber] = useState(0);
    const [progress, setProgress] = useState(0); // progress
    const [progressValue, setProgressValue] = useState(null);
    // balance money
    const [balance, setBalance] = useState(500);

    // start and cashout checker
    const [buttonStart, setButtonStart] = useState(false);
    const [cashOut, setCashOut] = useState(false);
    const [waiting, setWaiting] = useState(false);

    // when button start clicked generate new random number
    const [generateNew, setGenerateNew] = useState(false);
    // new randome number 
    const [randNumber, setRandNumber] = useState(1);

    // initialize hidden for failed image
    const [failedImage, setFailedImage] = useState(false);

    // set animation starts in
    const [animationData, setAnimationData] = useState({ x: 0, y: 1 });

    // max and min on seconds
    const [secondsMin, setSecondsMin] = useState(80);
    const [secondsMax, setSecondsMax] = useState(60);

    // failed result
    const [count, setCount] = useState(0);
    const [isCounting, setIsCounting] = useState(false);
    const finalResult = number * parseInt(resultTimes);

    useEffect(() => {
        if (isCounting) {
            const intervalId = setInterval(() => {
                if (count < finalResult) {
                    setCount((prevCount) => prevCount + 1);
                } else {
                    clearInterval(intervalId);
                }
            }, 50);

            // Clean up the interval when the component unmounts or when isCounting changes to false.
            return () => clearInterval(intervalId);
        }
    }, [count, isCounting, finalResult]);

    const options = {
        scales: {

            x: {
                type: 'linear',
                position: 'bottom',
                grid: {
                    display: false
                },
                min: 0,
                max: maxLimitX,
                ticks: {
                    stepSize: 5,
                    callback: function (value) {
                        if (value || value === 0) {
                            return value + 's';
                        }
                        else if (value > 20) {
                            setMaxLimitX(value + 1);
                        }
                        else {
                            return '';
                        }
                    },
                    font: {
                        size: 18
                    },
                }
            },

            y: {
                type: 'linear',
                position: 'left',
                grid: {
                    display: false
                },
                min: 1,
                max: maxLimitY,
                ticks: {
                    stepSize: 3,
                    callback: function (value) {
                        if (value) {
                            return value + 'x';
                        }
                        else if (value > 20) {
                            setMaxLimitY(value + 1);
                        } else {
                            return '';
                        }
                    },
                    font: {
                        size: 18
                    },

                },
            },

        },

        plugins: {
            legend: {
                display: false,
            },
        },
    };

    // initialize data
    const initialData = {
        labels: [],
        datasets: [
            {
                label: 'Height (1n cm)',
                data: [], // Empty array for data points
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 5,
                fill: true, // Fill the area under the line
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Fill color
            },
        ],
    };

    // initialize chartData
    const [chartData, setChartData] = useState(initialData);

    // animation
    useEffect(() => {

        if (buttonStart) {

            const interval = setInterval(() => {
                if (animationData.x < secondsMin || animationData.y < secondsMax) {
                    setAnimationData({
                        x: Math.min(animationData.x + (secondsMin / 40000) * 25, secondsMin),
                        y: Math.min(animationData.y + (secondsMax / 40000) * 10, secondsMax),
                    });

                    if (maxLimitY < animationData.y) {
                        setMaxLimitY(parseInt(animationData.y));
                    }
                    if (maxLimitX < animationData.x) {
                        setMaxLimitX(parseInt(animationData.x));
                    }

                    setChartData((progressed) => ({
                        ...progressed,
                        datasets: [
                            {
                                ...progressed.datasets[0],
                                data: [
                                    { x: animationData.x, y: animationData.y },
                                    ...progressed.datasets[0].data,
                                ],
                            },
                        ],
                    }));

                    const progressY = (animationData.y / secondsMax) + 1;
                    // Do something with progressY
                    // setResultTimes(animationData.y);
                    setResultTimes((prev) => prev + 0.01);
                    // console.log(parseInt(animationData.y));

                    // if (parseInt(progress) > 0) {
                    //     if (parseInt(progressValue) === animationData.y) {
                    //         console.log('testin');
                    //     }
                    // }

                    if (parseInt(animationData.y) === randNumber) {

                        setChartData((progressed) => ({
                            ...progressed,
                            datasets: [
                                {
                                    ...progressed.datasets[0],
                                    backgroundColor: 'rgb(189, 26, 26)',
                                    borderColor: 'rgb(119, 40, 40)'
                                },
                            ],
                        }));

                        setAnimationData({ x: 0, y: 1 });
                        // reset the datasets
                        // setChartData(initialData);

                        clearInterval(interval);
                        setButtonStart(false);
                        setCashOut(false);
                        setWaiting(false);

                        // stop the starting audio
                        audio.pause();
                        audio.currentTime = 0;

                        // reset number
                        setNumber(0);

                        audioFailed.play();
                    }
                } else {
                    clearInterval(interval);
                    // Animation completed
                }
            }, 50);

            return () => {
                clearInterval(interval);
            };
        }
    }, [buttonStart, animationData]);

    const [expandBalance, setExpandBalance] = useState(false); // expand balance number

    // start button
    const start = () => {

        if (number > balance) {
            alert("Low funds alert!");
            setNumber(0);
        }
        else {
            // reset the maxLimitX and Y
            setMaxLimitX(20);
            setMaxLimitY(10);

            // conditions or random number for stop
            const randomNumber = Math.random() * 100;

            if (randomNumber <= 85) {
                // 85% chance
                const random = Math.floor(Math.random() * 6) + 1;
                setRandNumber(random);
            } else if (randomNumber <= 95) {
                // 10% chance
                const random = Math.floor(Math.random() * 5) + 6;
                setRandNumber(random);
            } else {
                // 10% chace
                const random = Math.floor(Math.random() * 20) + 11;
                setRandNumber(random);
            }

            // reset the datasets
            setChartData(initialData);

            // play the audio
            audio.play();
            setButtonStart(true);
            setCashOut(true);

            // hide failed image
            setFailedImage(false);

            // deduct the balance
            if (balance >= number) {
                setBalance(balance - number);
            }

            setProgressValue(progress);

        }
    };

    // cashout button
    const cashOutBtn = () => {
        setCashOut(false);
        setWaiting(true);

        coins.play();
        setExpandBalance(true);
        setBalance(parseInt((number * resultTimes) + balance));
        setTimeout(() => {
            setExpandBalance(false);
        }, 1000);
    }

    return (
        <div>
            <div className='chart'>
                <div className='chart-table' style={{ position: 'relative' }}>
                    <Line data={chartData} options={options} />
                </div>

                <div className='cash-out' style={{ display: cashOut ? 'block' : 'none' }} onClick={cashOutBtn}>
                    <span>Cash Out</span>
                </div>

                <div style={{ display: buttonStart ? 'none' : 'block' }} onClick={start} className='start'>
                    <span>START</span>
                </div>

                <div style={{ display: waiting ? 'block' : 'none' }} className='waiting'>
                    <span>Waiting...</span>
                </div>

                {/* result in times */}
                <div className='result-times' >
                    <span style={{ fontSize: '45px' }}>{resultTimes.toFixed(2)}x</span>
                </div>

                <div className='betting-area' style={{ alignItems: 'center', pointerEvents: buttonStart ? 'none' : '', filter: buttonStart ? 'blur(0.5px)' : '' }}>

                    <div className='plus-minus'>
                        <div className='minus' onClick={() => { setNumber(number - 1); clicked.play() }}>
                            <span>-</span>
                        </div>
                        <div className='number'>
                            <input type="number" value={number} onChange={(e) => setNumber(e.target.value)} />
                        </div>
                        <div className='plus' onClick={() => { setNumber(number + 1); clicked.play() }}>
                            <span style={{ pointerEvents: 'none' }}>+</span>
                        </div>
                    </div>

                    <div className='progress-bar-content'>
                        <div className='content-x'>
                            <span>{progress}x</span>
                        </div>
                        <input type="range" min='0' max='10' value={progress} onChange={(e) => setProgress(e.target.value)} className='progress-bar' />
                        <div className='progress-label'>
                            Auto Cash Out
                        </div>
                    </div>
                    <div className='balance-container'>
                        <div className='balance'>
                            <span style={{ fontSize: expandBalance ? '40px' : '30px', color: expandBalance ? 'red' : 'violet' }}>{balance}</span>
                        </div>
                        <hr className='hr' />
                        <span className='balance-label'>Balance</span>
                    </div>
                </div>


            </div>

            <div className='header'>
                <div className='game-name'>
                    <label >Crash<span className='span-name'>GAME</span></label>
                </div>
                <div className='image'>
                    <img src={crash} />
                </div>
                <div className='dashBoard'>
                    <img src={menu} />
                </div>
            </div>

            <div style={{ display: 'none' }}>
                <audio >
                    <source src={onPlay} type="audio/mpeg" />
                </audio>
            </div>
            <div style={{ display: 'none' }}>
                <audio >
                    <source src={error} type="audio/mpeg" />
                </audio>
            </div>

        </div >

    );
}

export default CrashGAME;
