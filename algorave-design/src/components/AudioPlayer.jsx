import React from 'react';

export default function AudioPlayer({ musicFile }) {
    return (
        <div className="audio-player">
            <audio controls src={musicFile}/>
        </div>
    );
}