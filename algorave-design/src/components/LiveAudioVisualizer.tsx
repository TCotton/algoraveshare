import React, {useState} from 'react';
import {LiveAudioVisualizer} from 'react-audio-visualize';

const Visualizer = () => {
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>();

    // set media recorder somewhere in code

    return (
        <div>
            {mediaRecorder && (
                <LiveAudioVisualizer
                    mediaRecorder={mediaRecorder}
                    width={200}
                    height={75}
                />
            )}
        </div>
    );
};
