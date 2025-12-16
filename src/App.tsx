import { useState } from 'react';
import { Search } from './components/Search';
import SongList from './components/SongList';
import './index.css';
import { SearchResult, Song, SongService } from './services/SongService';

function App() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [nextPage, setNextPage] = useState<string|null>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // auto-clear toaster after 5s
  if (errorMessage) {
    setTimeout(() => setErrorMessage(null), 5000);
  }

  const handleSearch = async (query: string) => {
    if (isDownloading) return;
    setSongs([])
    try {
      const result: SearchResult = await SongService.searchVideos(query);
      console.log(result)
      setSongs(result.songs);
      setNextPage(result.nextPageUrl);
    } catch (err) {
      console.error('Search error', err)
      setErrorMessage((err as Error).message || 'Error buscando resultados')
    }
  };

  const handleDownloads = async (urls: string[]) => {
    if (!urls || urls.length === 0) return;
    try {
      setIsDownloading(true);
      console.log('Starting download for', urls.length, 'items');
      await SongService.downloadAudio(urls);
      console.log('Download finished');
    } catch (err) {
      console.error('Download error', err);
      setErrorMessage((err as Error).message || 'Error al descargar')
    } finally {
      setIsDownloading(false);
    }
  }

  const handleLoadMore = async () => {
    if (isDownloading) return;
    if (nextPage) {
      try {
        const result: SearchResult = await SongService.searchVideosByNextPage(nextPage);
        setSongs((prevSongs) => [...prevSongs, ...result.songs]);
        setNextPage(result.nextPageUrl);
      } catch (err) {
        console.error('Load more error', err)
        setErrorMessage((err as Error).message || 'Error cargando más resultados')
      }
    };
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <Search onSearch={handleSearch} disabled={isDownloading} />
      {songs.length > 0 ? (
        <>
          <SongList songs={songs} handleDownloads={handleDownloads} isDownloading={isDownloading} />
          {nextPage && (
            <button
              onClick={handleLoadMore}
              disabled={isDownloading}
              className={`mt-4 px-4 py-2 text-white rounded ${isDownloading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
            >
              {isDownloading ? 'Downloading...' : 'Cargar más'}
            </button>
          )}
        </>
      ) : (
        <p className="text-gray-600">No se encontraron resultados.</p>
      )}
      {isDownloading && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="flex flex-col items-center space-y-4 bg-white bg-opacity-90 p-6 rounded">
            <div className="w-12 h-12 border-4 border-t-blue-600 border-gray-200 rounded-full animate-spin" />
            <div className="text-gray-800 font-medium">Downloading... Please wait</div>
          </div>
        </div>
      )}
      {errorMessage && (
        <div className="fixed top-4 right-4 z-60">
          <div className="bg-red-600 text-white px-4 py-2 rounded shadow-md">
            <div className="font-medium">{errorMessage}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App