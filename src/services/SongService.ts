import { BASE_API_URL } from '../constants/constants'

export interface Song {
	videoId: string
	videoUrl: string
	title: string
	description: string
	thumbnail: { url: string; width: number; height: number }
	channelTitle: string
	publishTime: string
}

export interface SearchResult {
	songs: Song[]
	nextPageUrl: string
}

export interface DownloadResult {
	url: string
	status: 'success' | 'error'
	file_path?: string
	error?: string
}

export class SongService {
	static async searchVideos(
		query: string,
		maxResults: number = 50
	): Promise<SearchResult> {
		const url = new URL(`${BASE_API_URL}/search`)
		url.searchParams.append('query', query)
		url.searchParams.append('maxResults', maxResults.toString())

		try {
			const response = await fetch(url.toString(), {
				method: 'GET'
			})

			let bodyText: string | null = null
			try {
				bodyText = await response.text()
			} catch (e) {
				bodyText = null
			}

			if (!response.ok) {
				// try to parse error details from JSON
				try {
					const errJson = bodyText ? JSON.parse(bodyText) : null
					const details = errJson?.details || errJson?.error || bodyText || response.statusText
					throw new Error(`Error en la búsqueda: ${details}`)
				} catch (e) {
					throw new Error(`Error en la búsqueda: ${bodyText || response.statusText}`)
				}
			}

			const data = bodyText ? JSON.parse(bodyText) : {}
			return data || []
		} catch (error) {
			console.error('Error al buscar videos:', error)
			throw new Error(
				(error as Error).message || 'No se pudieron buscar los videos. Por favor, inténtalo de nuevo.'
			)
		}
	}

	static async searchVideosByNextPage(
		nextPageUrl: string
	): Promise<SearchResult> {
		const url = new URL(`${BASE_API_URL}${nextPageUrl}`)

		try {
			const response = await fetch(url.toString(), {
				method: 'GET'
			})

			if (!response.ok) {
				throw new Error(`Error en la búsqueda: ${response.statusText}`)
			}

			const data = await response.json()
			return data || []
		} catch (error) {
			console.error('Error al buscar videos:', error)
			throw new Error(
				'No se pudieron buscar los videos. Por favor, inténtalo de nuevo.'
			)
		}
	}

	static async downloadAudio(urls: string[]): Promise<DownloadResult[]> {
		try {
			const response = await fetch(`${BASE_API_URL}/download`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ urls })
			})

			let bodyText: string | null = null
			try {
				bodyText = await response.text()
			} catch (e) {
				bodyText = null
			}

			if (!response.ok) {
				try {
					const errJson = bodyText ? JSON.parse(bodyText) : null
					const details = errJson?.details || errJson?.error || bodyText || response.statusText
					throw new Error(`Error en la descarga: ${details}`)
				} catch (e) {
					throw new Error(`Error en la descarga: ${bodyText || response.statusText}`)
				}
			}

			const data = bodyText ? JSON.parse(bodyText) : []
			return data || []
		} catch (error) {
			console.error('Error al descargar audio:', error)
			throw new Error(
				(error as Error).message || 'No se pudieron descargar los audios. Por favor, inténtalo de nuevo.'
			)
		}
	}
}
