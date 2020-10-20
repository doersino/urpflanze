import { EShapePrimitiveAdaptMode } from '@core/types/shape-base'
import { IShapeLoopAnimation, IVertexCallbackAnimation, TAnimation, TCallableValue } from '@services/types/animation'
import { ISceneChildDrawerData, TDrawerValue } from './drawer-canvas'
import { TSceneChildProps } from './scene-utilities'

/**
 * @category Services.Export/Import
 */
export interface IProjectSequence {
	start: number
	end: number
	durate: number
	framerate: number
}

/**
 * @category Services.Export/Import
 */
export interface IProject {
	id: string
	name: string
	mainColor: string
	background: string

	width?: number
	height?: number
	resolution?: number

	// DrawOptions
	ratio: number
	backgroundImage?: string
	clearCanvas: boolean
	ghosts: number
	ghost_skip_time?: number
	ghost_skip_function?: number | string | CallableFunction

	// Timeline
	sequence: IProjectSequence

	// Scene
	scene: IProjectScene
}

/**
 * @category Services.Export/Import
 */
export interface IProjectScene {
	[key: string]: IProjectSceneChild
}

/**
 * @category Services.Export/Import
 */
export interface IProjectSceneChildData extends ISceneChildDrawerData {
	imported?: boolean
	fillColor?: { r: number; g: number; b: number; a: number }
	strokeColor?: { r: number; g: number; b: number; a: number }
}

/**
 * @category Services.Export/Import
 */
export type IProjectSceneChildDataProps = {
	[k in keyof Omit<
		TSceneChildProps,
		'id' | 'name' | 'order' | 'data' | 'adaptMode' | 'bCloseShape' | 'shape' | 'loop' | 'vertexCallback'
	>]: TAnimation | TCallableValue<number | Array<number> | string> | TDrawerValue
} & {
	loop?: IShapeLoopAnimation
	vertexCallback?: IVertexCallbackAnimation
}

/**
 * @category Services.Export/Import
 */
export interface IProjectSceneChild {
	type: string
	id: string
	name: string
	order: number
	data: IProjectSceneChildData
	adaptMode?: EShapePrimitiveAdaptMode
	bCloseShape?: boolean
	bUseParent?: boolean
	vertexCallback?: string
	shape?: Float32Array

	bPrimitive: boolean
	depth: number

	props: IProjectSceneChildDataProps
	parent_id?: string | number
	children?: Array<IProjectSceneChild>
}
