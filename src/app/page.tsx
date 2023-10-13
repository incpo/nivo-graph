"use client"
import {linearGradientDef} from "@nivo/core";
import {PointTooltipProps, ResponsiveLine} from "@nivo/line";
import React, {useState} from "react";
import dayjs from 'dayjs'
import {priceHistory} from "@/config";
import {AnimatePresence, motion} from "framer-motion";

// !CONSOLE WARNING https://github.com/plouc/nivo/issues/2415
export default function Home() {
  const [logScale, setLogScale] = useState(false)

    const formattedData = priceHistory.map((slice) => {
        return {
            x: dayjs.unix(slice?.date).valueOf(),
            y: slice.adjClose
        }
    })

    const maxY = Math.max.apply(null, formattedData.map((item) => {
            return typeof(item.y) !== "number"? 0 : item.y
        })
    )

    return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 sm:p-24">
        <p>LogarithmicScale : <span className={logScale ? 'text-green-300' : 'text-red-300'}>{logScale ? 'on' : 'off'}</span></p>
        <div className='h-64 select-none w-full max-w-[1280px] sm:h-96'>
          <ResponsiveLine
              curve="monotoneX"
              colors={['#4d88db','#0000FF']}
              data={[
                  {
                      id: 'fake corp. A',
                      data: formattedData
                  },
              ]}
              axisTop={null}
              axisBottom={null}
              axisRight={{}}
              xScale={{
                  type: 'linear',
                  max: 'auto',
                  min: 'auto',
              }}
              yScale={{
                  type: logScale ? 'symlog' : 'linear',
                  min: logScale ? 'auto' : 'auto',
                  max: logScale ? maxY :'auto',
                  stacked: false,
              }}
              enableGridX={false}
              enableCrosshair={true}
              isInteractive
              useMesh
              enableArea={true}
              enablePoints={false}
              crosshairType='x'
              defs={[
                  linearGradientDef('gradientA', [
                      { offset: 0, color: '#0000FF' },
                      { offset: 100, color: '#0000FF', opacity: 0 },
                  ]),
              ]}
              fill={[{ match: '*', id: 'gradientA' }]}
              tooltip={(props) => {
                  return (
                      <MyTooltip props={props}/>
                  )
              }}
              margin={{
                  right: 30,
                  top:20,
                  bottom: 20
              }}
              // Layers that will be rendered
              layers={[
                  'grid',
                  'axes',
                  'areas',
                  CustomPoint, // !! Be carefully with position, it's like z-index.
                  'crosshair',
                  'lines',
                  'mesh',
              ]}
              theme={{
                  textColor: '#3b4150',
                  grid: {
                      line: {
                          stroke: '#252932',
                      }
                  },
                  tooltip: {
                      container: {
                          background: '#20232D',
                          fontSize: '12px',
                          borderRadius: '14px'
                      }
                  },
                  crosshair: {
                      line: {
                          stroke: '#fff'
                      }
                  }
              }}
          />
      </div>
        <button onClick={()=> setLogScale(!logScale)} className='border p-2 rounded border-[#2e2e2e]'>toggle log scale</button>
    </main>
  )
}


const CustomPoint: React.FC<any> = ({currentPoint}) => { // No right type in the library!
    // it will show the current point
    return (
           // Sometimes AnimatePresence doesn't delete from React tree one or more elements, it's looks like a bug.
           <AnimatePresence>
               {currentPoint && (
                   <motion.circle
                       key={currentPoint.index}
                       initial={{r: 0, opacity: 0}}
                       animate={{r: 5, opacity: 1}}
                       transition={{ease: 'easeInOut', duration: 0.250}}
                       exit={{r: 0, opacity: 0}}
                       strokeWidth='1'
                       stroke='#1a6dfc'
                       fill='#1a6dfc'
                       fillOpacity={0.2}
                       cx={currentPoint.x}
                       cy={currentPoint.y}
                   />
               )}
           </AnimatePresence>
    )
};


const MyTooltip = ({props}: {props: PointTooltipProps}) => {
    return (
        <div className='py-1 px-4 text-sm flex flex-col space-y-0.5 text-center rounded-lg shadow bg-[#20232D]'>
            <span className='text-[#E1E7EF]'><>{props.point.data.y}</></span>
            <span className='text-[#7F8EA3] text-xs'>{dayjs(props.point.data.x).format("D MMM[']YY")}</span>
        </div>
    );
};


export type CurrentPoint = {
    borderColor: string
    color: string
    data: {x: number, y: number, xFormatted: string, yFormatted: string}
    id: string
    index: number
    serieColor: string
    serieId: string
    x: number
    y: number
}