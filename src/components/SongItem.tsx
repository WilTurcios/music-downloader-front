import React from "react";
import { Song } from "../services/SongService";

export interface SongProps {
  song: Song;
  onToggleDownload: (song: Song, isSelected: boolean) => void;
}

export function SongItem({ song, onToggleDownload }: SongProps) {
  const {videoUrl, title, thumbnail, channelTitle, publishTime
  } = song;

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onToggleDownload(song, event.target.checked);
  };

  return (
    <div className="flex items-center p-4 border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
      <img
        src={thumbnail.url}
        alt={`${title} thumbnail`}
        className="w-16 h-16 rounded-lg object-cover"
      />
      <div className="ml-4 flex-1">
        <h2 className="text-lg font-semibold text-blue-600 hover:underline">
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {title}
          </a>
        </h2>
        <p className="text-sm text-gray-600">Channel: {channelTitle}</p>
        <p className="text-xs text-gray-500">Published: {new Date(publishTime).toDateString()}</p>
      </div>
      <div className="ml-4">
        <label className="flex items-center space-x-2 text-sm text-gray-800">
          <input
            type="checkbox"
            onChange={handleCheckboxChange}
            className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
          />
          <span>Select for download</span>
        </label>
      </div>
    </div>
  );
}
