import React, {Component} from 'react'
import './SpeedTest.css'
import TestResults from './TestResults'
import WordsToType from './WordsToType'
import { Button } from '@material-ui/core'
import * as ci from 'correcting-interval'
import ReactGA from 'react-ga'
import AddIcon from '@material-ui/icons/Add'
import RemoveIcon from '@material-ui/icons/Remove'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'

function TimePicker(props) {
  const { duration, setDuration } = props

  function addTime() {
    if (duration < 30) {
      setDuration(duration + 5)
    } else {
      setDuration(duration + 30)
    }
  }

  function subtractTime() {
    if (duration <= 5) {
      return
    }
    if (duration <= 30) {
      setDuration(duration - 5)
    } else {
      setDuration(duration - 30)
    }
  }

  function showMinutes() {
    const minutes = Math.floor(duration / 60)
    const seconds = duration % 60
    const secondsString = seconds < 10 ? '0' + seconds.toString() : seconds.toString()
    return (minutes.toString() + ':' + secondsString)
  }

  return (
    <span className='TimePicker'>
      <IconButton onClick={subtractTime}>
        <RemoveIcon />
      </IconButton>
      {showMinutes()}
      <IconButton onClick={addTime}>
        <AddIcon />
      </IconButton>
    </span>
  )
}

class SpeedTest extends Component {
  constructor(props) {
    super(props)
    this.state = {
      finalWPM: 0,
      timerStarted: false,
      testStarted: false,
      testComplete: false,
      totalSeconds: 60,
      elapsedSeconds: 0,
      numTypos: 0,
      numWordsTyped: 0
    }
    this.startTimer = this.startTimer.bind(this)
    this.beginTest = this.beginTest.bind(this)
    this.finishTest = this.finishTest.bind(this)
    this.setDuration = this.setDuration.bind(this)
  }

  setDuration(duration) {
    this.setState({totalSeconds: duration})
  }

  startTimer() {
    this.setState({
      elapsedSeconds: 0,
      timeStarted: Date.now(),
      timerStarted: true
    })
    ReactGA.event({
      category: 'Interaction',
      action: 'Started speed test'
    })
    console.log('Timer started')
    this.props.showProgress(true)
    this.timer = ci.setCorrectingInterval(() => {
      const {
        totalSeconds,
        elapsedSeconds,
        timeStarted,
      } = this.state

      const newElapsed = elapsedSeconds + 1

      this.setState({
        elapsedSeconds: (newElapsed <= totalSeconds ? newElapsed : totalSeconds),
      })
      this.props.updateProgress((elapsedSeconds) / totalSeconds * 100)
      if (elapsedSeconds >= totalSeconds) {
        this.finishTest()
      }
    }, 1000)
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.typedText !== prevProps.typedText && !prevState.timerStarted) {
      if (this.state.testStarted) {
        this.startTimer()
      }
    }
  }

  componentWillUnmount() {
    this.setState({timerStarted: false})
    ci.clearCorrectingInterval(this.timer)
  }

  beginTest() {
    ReactGA.event({
      category: 'Interaction',
      action: 'Clicked \'Start speed test\''
    })
    this.props.startFunction()
    this.setState({
      testStarted: true,
      testComplete: false
    })
  }

  finishTest() {
    const { totalSeconds } = this.state
    this.setState({
      timerStarted: false,
      testStarted: false,
      testComplete: true,
      numWordsTyped: this.props.numWordsTyped,
      numTypos: this.props.numTypos,
      finalWPM: Math.round(this.props.numWordsTyped / totalSeconds * 60)
    })
    ci.clearCorrectingInterval(this.timer)
    this.props.showProgress(false)
    this.props.updateProgress(0)
    this.props.endFunction()
    ReactGA.event({
      category: 'Interaction',
      action: 'Completed speed test'
    })
  }

  render() {
    const {
      numWordsTyped,
      numTypos,
      totalSeconds,
      finalWPM
    } = this.state

    return (
      <div className='SpeedTest'>
        <Grid container justify='center' direction='column'>
        { this.state.testComplete ?
          <Grid item>
            <TestResults
              key='testResults'
              wordsPerMinute={finalWPM}
              accuracy={Math.round(numWordsTyped / (numWordsTyped + numTypos) * 100)}
              numTypos={numTypos}
              totalSeconds={totalSeconds} />
              <Divider variant='middle' />
          </Grid>
          :
          ''
        }
        { !this.state.testStarted ?
          <Grid item>
            <div className='pre-test-container'>
              <TimePicker duration={totalSeconds} setDuration={this.setDuration} />
              <br/>
              <Tooltip title='Time will start when you begin typing'>
                <Button key='beginTest' onClick={this.beginTest}>
                  {this.state.testComplete ? 'Restart' : 'Start Speed Test'}
                </Button>
              </Tooltip>
            </div>
          </Grid>
          :
          <WordsToType key='wordsToType' {...this.props} />
        }
        </Grid>
      </div>
    )
  }
}

export default SpeedTest
