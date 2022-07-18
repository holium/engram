import { useContext, useEffect, useState } from "react"
import { ThemeContext } from "../../App.jsx"

function ConfigItem(props) {
  const theme = useContext(ThemeContext);

  const [value, setValue] = useState(theme.config[props.key].value)

  const handleChange = (event) => {
    setValue(event.target.value)
  }
  const implementChange = () => {
    Object.keys(theme.config[props.key].styles).forEach((style: string) => {
      document.documentElement.style.setProperty(
        style,
        theme.config[props.key].styles[style](value)
      )
    })
  }

  useEffect(() => {
    implementChange();
  }, [])

  return (
    <li key={props.key}>
    <dt>{ theme.config[props.key].display }</dt>
      <dd>
        <input value={value} type={theme.config[props.key].type} onChange={handleChange} onBlur={implementChange} />
      </dd>
    </li>
  )
}

export default ConfigItem;
