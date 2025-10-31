import * as React from 'react'
import type { SVGProps } from 'react'

const MusicNoteTwo = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  (props, ref) => (
    <svg
      ref={ref}
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0,0,256,256'
      width='144px'
      height='144px'
      fillRule='nonzero'
      className='svg-icon-two'
      {...props}
    >
      <g
        fill='none'
        fillRule='nonzero'
        stroke='#b4befe'
        strokeWidth='3'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeMiterlimit='10'
        strokeDasharray=''
        strokeDashoffset='0'
        fontFamily='none'
        fontWeight='none'
        fontSize='none'
      >
        <g transform='scale(5.33333,5.33333)'>
          <path
            className='path-one'
            data-animation='stop'
            d='M40.5,15.5v-8l-19.7,4.5c-1.4,0.3 -2.3,1.5 -2.3,2.9v5.6l15,-3.4'
          >
          </path>
          <path className='path-one' data-animation='stop' d='M18.5,15.5v21'></path>
          <path className='path-one' data-animation='stop' d='M40.5,12.5v20'></path>
          <path
            className='path-one'
            data-animation='stop'
            d='M14.1,31.6c2.6,0.6 4.4,2.5 4.4,4.9c0,2.8 -2.7,5 -6,5c-3.3,0 -6,-2.2 -6,-5c0,-0.9 0.3,-1.7 0.7,-2.4'
          >
          </path>
          <ellipse cx='34.5' cy='32.5' rx='6' ry='5'></ellipse>
        </g>
      </g>
    </svg>
  )
)

MusicNoteTwo.displayName = 'MusicNoteTwo'

export default MusicNoteTwo
