import React from 'react'
import './AppMenu.css'
import {AppBar, Toolbar, IconButton, Select, MenuItem, Tooltip} from '@material-ui/core'
import Icon from '@mdi/react'
import { mdiFormatFontSizeDecrease, mdiFormatFontSizeIncrease, mdiLightbulb, mdiLightbulbOutline } from '@mdi/js'
import { withStyles } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useTheme } from '@material-ui/styles'
import FormControl from '@material-ui/core/FormControl'
import {Link} from 'react-router-dom'

const AdapterLink = React.forwardRef((props, ref) => <Link innerRef={ref} {...props} />)

const styles = theme => ({
  root: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  spacer: {
    flexGrow: 1
  },
  whiteText: {
    color: theme.palette.text
  }
})

const useStyles = makeStyles(theme => ({
  formControl: {
    marginRight: theme.spacing(2),
    minWidth: 120,
  }
}))

function ModeDropdown(props) {
  const classes = useStyles()
  const [values, setValues] = React.useState({
    mode: props.activeItem,
    selectedText: 'metamorphosis'
  })

  function handleChange(event) {
    setValues(oldValues => ({
      ...oldValues,
      [event.target.name]: event.target.value
    }))
    if (event.target.name === 'mode') {
      modeHandler(event.target.value)
    }
    if (event.target.name === 'selectedText') {
      longTextHandler(event.target.value)
    }
  }

  const {
    modeHandler,
    longTextHandler
  } = props

  return (
    <form autoComplete='off'>
      <FormControl className={classes.formControl}>
        <Select
          value={values.mode}
          onChange={handleChange}
          inputProps={{
            name: 'mode',
            id: 'modePicker'
          }}>
          <MenuItem value='practice' component={AdapterLink} to='/practice'>Random Words</MenuItem>
          <MenuItem value='smartExercise' component={AdapterLink} to='/smart-exercise'>Smart Exercise</MenuItem>
          <MenuItem value='speedTest' component={AdapterLink} to='/speed-test'>Speed Test</MenuItem>
          {/*<MenuItem value='longText'>Long Texts</MenuItem>*/}
        </Select>
      </FormControl>
      {
        values.mode === 'longText' ?
        <FormControl className={classes.formControl}>
          <Select
            value={values.selectedText}
            onChange={handleChange}
            inputProps={{
              name: 'selectedText',
              id: 'selectLongText'
            }}>
            <MenuItem value={'metamorphosis'}>The Metamorphosis</MenuItem>
            <MenuItem value={'aliceInWonderland'}>Alice in Wonderland</MenuItem>
            <MenuItem value={'tomSawyer'}>The Adventures of Tom Sawyer</MenuItem>
          </Select>
        </FormControl>
        :
        ''
      }
    </form>
  )
}

function AppMenu(props) {
  const theme = useTheme()
  const {
    zoomHandler,
    modeHandler,
    longTextHandler,
    classes,
    activeItem,
    longText,
    setDarkTheme
  } = props

  const darkTheme = theme.palette.type === 'dark'

  return (
    <AppBar position='static' className={classes.root} elevation={2}>
      <Toolbar variant='dense'>
        <ModeDropdown {...props}/>
        <div className={classes.spacer}/>
        <Tooltip title='Toggle dark theme'>
          <IconButton
            name='darkMode'
            onClick={() => setDarkTheme(!darkTheme)}>
            <Icon
              path={ darkTheme ? mdiLightbulb : mdiLightbulbOutline }
              color={ darkTheme ? '#fff' : '#000'}
              size={1} />
          </IconButton>
        </Tooltip>
        <Tooltip title='Increase font size'>
          <IconButton
            name='zoom in'
            onClick={() => zoomHandler('zoomIn')}>
            <Icon
              color={ darkTheme ? '#fff' : '#000'}
              path={mdiFormatFontSizeIncrease}
              size={1} />
          </IconButton>
          </Tooltip>
        <Tooltip title='Decrease font size'>
          <IconButton
            edge='end'
            name='zoom out'
            onClick={() => zoomHandler('zoomOut')}>
            <Icon
              path={mdiFormatFontSizeDecrease}
              color={ darkTheme ? '#fff' : '#000'}
              size={1} />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  )
}

export default withStyles(styles)(AppMenu)
