import React from 'react';
import soundFile from '../assets/music/sample-pentangle.wav';

export default function AudioPlayer({ musicFile }) {
    return (
        <div className="audio-player">
            <audio controls src={musicFile}/>
        </div>
    );
}