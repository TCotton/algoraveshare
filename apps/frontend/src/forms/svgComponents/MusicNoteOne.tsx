import * as React from 'react'
import type { SVGProps } from 'react'

const MusicNoteOne = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  (props, ref) => (
    <svg
      ref={ref}
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0,0,256,256'
      width='144px'
      height='144px'
      fillRule='nonzero'
      className='svg-icon'
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
          <path className='path-one' data-animation='stop' d='M24.5,17.5v13.4'></path>
          <path
            className='path-two'
            data-animation='stop'
            d='M17.8,28.5c0.7,-0.3 1.5,-0.5 2.4,-0.5c2.4,0 4.4,1.5 4.4,3.3c0,1.8 -2,3.3 -4.4,3.3c-1.6,0 -3,-0.6 -3.7,-1.6'
          >
          </path>
          <path
            className='path-three'
            data-animation='stop'
            d='M29.5,20.6l2.4,0.6c0.6,0.2 1.3,-0.3 1.3,-1v-2.8c0,-1 -0.7,-1.9 -1.7,-2.1l-5.8,-1.6c-0.6,-0.2 -1.3,0.3 -1.3,1v4.5'
          >
          </path>
          <path
            className='path-four'
            data-animation='stop'
            d='M31,41.1c-2.2,0.9 -4.5,1.4 -7,1.4c-10.2,0 -18.5,-8.3 -18.5,-18.5c0,-3.9 1.2,-7.6 3.3,-10.6'
          >
          </path>
          <path
            className='path-five'
            data-animation='stop'
            d='M15.8,7.4c2.5,-1.2 5.2,-1.9 8.2,-1.9c10.2,0 18.5,8.3 18.5,18.5c0,4.8 -1.8,9.2 -4.8,12.5'
          >
          </path>
        </g>
      </g>
    </svg>
  )
)

MusicNoteOne.displayName = 'MusicNoteOne'

export default MusicNoteOne
