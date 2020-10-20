/**
 * @category Services.Timeline
 */
export interface ITimelineEvents {
	'timeline:update_sequence': ISequenceMeta
	'timeline:change_status': string
	'timeline:progress': {
		current_frame: number
		current_time: number
		fps: number
	}
}

/**
 * @category Services.Timeline
 */
export interface ISequenceMeta {
	start: number
	end: number
	durate: number
	frames: number
	framerate: number
}
