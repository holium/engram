import React from 'react';
const Background = ( { children } ) =>
{
    return (
        <body className=" bg-gray-50 dark:bg-slate-400 dark:text-white duration-1000">
            {children}
        </body>
    )
}

export default Background;