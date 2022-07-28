import { ThemeContext } from "./ThemeContext";
import React from 'react';
import { FaSun, FaMoon} from "react-icons/fa";

const DarkToggle = () => {
    const { theme, setTheme } = React.useContext(ThemeContext);

    return (
        <div className="">
            {theme === 'dark' ? (
                <FaSun
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="cursor-pointer" size = "1.7rem"
                />
            ) : (
                    <FaMoon
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="cursor-pointer" size= "1.7rem"
                    />
                )}
        </div>
    );
};

export default DarkToggle;