import React from 'react'
import { Oval } from 'react-loader-spinner'

function Loader() {
    return (
        <div className="big-loader">
            <Oval
                height={60}
                width={60}
                color="#4fa94d"
                visible={true}
                ariaLabel='oval-loading'
                secondaryColor="#4fa94d"
                strokeWidth={5}
                strokeWidthSecondary={5}
            />
        </div>
    )
}

export default Loader