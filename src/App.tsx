import { useState } from 'react';
import { Search } from './components/Search';
import SongList from './components/SongList';
import './index.css';
import { SearchResult, Song, SongService } from './services/SongService';

function App() {
   const [songs, setSongs] = useState<Song[]>([]);
   const [nextPage, setNextPage] = useState<string|null>(null);

  const handleSearch = async (query: string) => {
    setSongs([])
    const result: SearchResult = await SongService.searchVideos(query);
    console.log(result)
    setSongs(result.songs);
    setNextPage(result.nextPageUrl);
  };

  const handleDownloads = async (urls: string[]) => {
    await SongService.downloadAudio(urls)
  }

  const handleLoadMore = async () => {
    if (nextPage) {
      const result: SearchResult = await SongService.searchVideosByNextPage(nextPage);
      setSongs((prevSongs) => [...prevSongs, ...result.songs]);
      setNextPage(result.nextPageUrl);
    };
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <Search onSearch={handleSearch} />
      {songs.length > 0 ? (
        <>
          <SongList songs={songs} handleDownloads={handleDownloads} />
          {nextPage && (
            <button
              onClick={handleLoadMore}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Cargar más
            </button>
          )}
        </>
      ) : (
        <p className="text-gray-600">No se encontraron resultados.</p>
      )}
    </div>
  );
}

export default App