import React from 'react'
import { RotatingLines } from 'react-loader-spinner'

function Loading({ load, children }) {
    return (
        <>{
            load ?
                <div className="center">
                    <RotatingLines
                        strokeColor="green"
                        strokeWidth="5"
                        animationDuration="0.75"
                        width="45"
                        visible={true}
                    />
                </div> :
                children
        }
        </>
    )
}

export default Loading