import { useContext, useEffect, useState } from "react"
import { ThemeContext } from "../../App.jsx"

function ConfigItem(props) {
  const { theme, setConfigItem } = useContext(ThemeContext);

  const handleChange = (event) => {
    console.log(props, event)
    setConfigItem(props.key, event.target.value);
  }

  useEffect(() => {
    console.log(theme.config[props.key])
  }, [theme])

  return (
    <li>
    <dt>{ props.display }</dt>
      <dd>
        <input value={props.value} type={props.type} onChange={handleChange} />
      </dd>
    </li>
  )
}

export default ConfigItem;
