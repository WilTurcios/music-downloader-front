import React, { useState } from "react";
import { SongItem } from "./SongItem";
import { Song } from "../services/SongService";

interface SongListProps {
  songs: Song[];
  handleDownloads: (urls: string[]) => void
}

export default function SongList({ songs, handleDownloads }: SongListProps) {
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);

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
      {songs.map((song) => (
        <SongItem
          key={song.videoId}
          song={song}
          onToggleDownload={handleToggleDownload}
        />
      ))}
      <div className="mt-4">
        <strong>Selected Songs for Download:</strong>
        <ul className="list-disc pl-6">
          {selectedSongs.map((song) => (
            <li key={song.videoId}>
              {song.title}
            </li>
          ))}
        </ul>
        {selectedSongs.length && (
            <button
              onClick={() => handleDownloads(selectedSongs.map(s => s.videoUrl))}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Descargar Canciones
            </button>
          )}
      </div>
    </div>
  );
}
