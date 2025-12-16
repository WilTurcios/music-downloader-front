import React, { useState } from "react";
import { SongItem } from "./SongItem";
import { Song } from "../services/SongService";

interface SongListProps {
  songs: Song[];
  handleDownloads: (urls: string[]) => void
  isDownloading?: boolean;
}

export default function SongList({ songs, handleDownloads, isDownloading = false }: SongListProps) {
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);

  const isAllSelected = songs.length > 0 && selectedSongs.length === songs.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedSongs([]);
    } else {
      setSelectedSongs(songs.slice());
    }
  };

  const handleToggleDownload = (song: Song, isSelected: boolean) => {
    setSelectedSongs((prev) =>
      isSelected ? [...prev, song] : prev.filter((s) => s.videoId !== song.videoId)
    );
  };

  if (!songs || songs.length === 0) {
    return <p className="text-gray-600">No songs available.</p>;
  }

  return (
    <div className="space-y-4">
      {songs.map((song) => {
        const isSelected = selectedSongs.some((s) => s.videoId === song.videoId);
        return (
          <SongItem
            key={song.videoId}
            song={song}
            onToggleDownload={handleToggleDownload}
            isDownloading={isDownloading}
            isSelected={isSelected}
          />
        );
      })}
      <div className="flex items-center space-x-2 mt-2">
        <button
          onClick={toggleSelectAll}
          disabled={isDownloading}
          className={`px-3 py-1 rounded text-sm ${isAllSelected ? 'bg-gray-300 text-gray-800' : 'bg-blue-500 text-white hover:bg-blue-600'} ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isAllSelected ? 'Clear selection' : 'Select all'}
        </button>
        <button
          onClick={() => setSelectedSongs([])}
          disabled={isDownloading || selectedSongs.length === 0}
          className={`px-3 py-1 rounded text-sm bg-red-500 text-white hover:bg-red-600 ${isDownloading || selectedSongs.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Clear selections
        </button>
        <div className="text-sm text-gray-600">{selectedSongs.length} selected</div>
      </div>
      <div className="mt-4">
        <strong>Selected Songs for Download:</strong>
        <ul className="list-disc pl-6">
          {selectedSongs.map((song) => (
            <li key={song.videoId}>
              {song.title}
            </li>
          ))}
        </ul>
        {selectedSongs.length > 0 && (
            <button
              onClick={() => handleDownloads(selectedSongs.map(s => s.videoUrl))}
              disabled={isDownloading}
              className={`mt-4 px-4 py-2 text-white rounded ${isDownloading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
            >
              {isDownloading ? 'Downloading...' : 'Descargar Canciones'}
            </button>
          )}
      </div>
    </div>
  );
}
