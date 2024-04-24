import React, { useState, useEffect } from 'react';

function shiftTime(timecode: string, shiftSeconds: number): string {
    const timeParts: string[] = timecode.split(':');
    const hours: number = parseInt(timeParts[0], 10);
    const minutes: number = parseInt(timeParts[1], 10);
    const seconds: number = parseInt(timeParts[2], 10) + shiftSeconds;

    // Convert any overflow seconds to minutes and hours
    let newSeconds: number = seconds % 60;
    let newMinutes: number = minutes + Math.floor(seconds / 60);
    let newHours: number = hours + Math.floor(newMinutes / 60);

    // Ensure values are within range
    newMinutes %= 60;
    newHours %= 24;

    // Format new timecode
    const newTimecode: string = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}:${String(newSeconds).padStart(2, '0')}`;
    return newTimecode;
}

const Upload: React.FC = () => {
    const [fileContent, setFileContent] = useState<string>('');
    const [adjustedFileContent, setAdjustedFileContent] = useState<string>('');
    const [timeInSeconds, setTimeInSeconds] = useState<number>(-10);

    useEffect(() => {
        if (fileContent) {
            adjustTime();
        }
    }, [fileContent, timeInSeconds]);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                setFileContent(content);
            };
            reader.readAsText(file);
        }
    };

    const handleTimeInSecondsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value);
        setTimeInSeconds(value);
    };

    const handleDownload = () => {
        const blob = new Blob([adjustedFileContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'adjusted.scc';
        a.click();
    }

    const adjustTime = () => {
        // Split data into lines
        const lines: string[] = fileContent.split('\n');

        // Iterate through each line
        const shiftedLines: string[] = lines.map(line => {
            // Check if line contains timecode
            if (line.match(/^\d{2}:\d{2}:\d{2};\d{2}/)) {
                // Extract timecode
                const [timecode, ...rest] = line.split(';');
                // Shift timecode
                const shiftedTimecode: string = shiftTime(timecode, timeInSeconds);
                // Reconstruct line
                return `${shiftedTimecode};${rest.join(' ')}`;
            }
            // Return unchanged line if not a timecode line
            return line;
        });

        // Reconstruct modified SCC data
        setAdjustedFileContent(shiftedLines.join('\n'));
    };

    return (
        <div className=" p-8">
            <div className="flex flex-wrap gap-8">
                <div className="flex flex-col items-left">
                    <label className="mr-2">File</label>
                    <input type="file" onChange={handleFileUpload} className="cursor:pointer file:border-0 file:font-medium file:px-4 file:py-2 file:bg-cyan-600 file:text-white file:rounded" />
                </div>
                <div className="flex flex-col items-left">
                    <label htmlFor="timeInSeconds" className="mr-2">Shift (seconds)</label>
                    <input type="number" id="timeInSeconds" value={timeInSeconds} onChange={handleTimeInSecondsChange} className="p-2 border border-gray-300 rounded" />
                </div>
                {adjustedFileContent && <div className="flex flex-col items-left">
                    <label htmlFor="timeInSeconds" className="mr-2 pointer-none select-none">&nbsp;</label>
                    <button onClick={handleDownload} className="px-4 py-2 bg-cyan-600 text-white rounded">Download</button>
                </div>}
            </div>
            {fileContent && <div className="grid grid-cols-2 gap-8 mt-8">
                <div className="flex flex-col items-left">
                    <label className="mr-2">Initial</label>
                    <div className="whitespace-pre text-left text-small p-2 border border-gray-300 rounded overflow-auto max-h-[300px]">{fileContent}</div>
                </div>
                <div className="flex flex-col items-left">
                    <label className="mr-2">Shifted</label>
                    <div className="whitespace-pre text-left text-small p-2 border border-gray-300 rounded overflow-auto max-h-[300px]">{adjustedFileContent}</div>
                </div>
            </div>}
        </div>
    );
};

export default Upload;