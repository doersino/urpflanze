import { TArray } from '@core/math/Vec2'
import SceneChild from '@core/SceneChild'
import ShapeBase from '@core/shapes/ShapeBase'
import ShapePrimitive from '@core/shapes/ShapePrimitive'

/**
 * Repetition type enumerator.
 *
 *
 * @export
 * @enum {number}
 */
export enum ERepetitionType {
	/**
	 * Defines the type of repetition of the shape, in a circular way starting from the center of the scene
	 */
	Ring = 1,

	/**
	 * Defines the type of repetition of the shape, on a nxm grid starting from the center of the scene
	 */
	Matrix = 2,

	/**
	 * Defines the type of shape generation
	 */
	Loop = 3,
	// Random = 4
}

// TODO: ShapeBasePropArgument repetition beacuse random_offset cannot calculate into index function (can't get distance for performance reason)

/**
 * Information about current shape repetition
 *
 * @type RepetitionLoop
 */
export interface IRepetition {
	count_row: number
	count_col: number
	count: number
	current_index: number
	current_offset: number
	type: ERepetitionType
	current_col: number
	current_col_offset: number
	current_row: number
	current_row_offset: number
	current_angle: number
	// random_offset: Array<number>
}

/**
 * Props interface.
 * Remember: any size refere to dimension of a scene.
 */
export interface ISceneChildProps {
	/**
	 * It defines the type of repetition.
	 * If a number is passed the repetition will be Ring.
	 * If an array (1) is passed the repetition will be nxn,
	 * if an array (2) the repetition will be nxm
	 *
	 * @type {(TSceneChildProp<number | Array<number>>)}
	 * @memberof ISceneChildProps
	 */
	repetitions?: TSceneChildProp<number | Array<number>> // number of shape repetitions

	/**
	 * If the repeat is Ring, pass a numerical value referring to the distance from the center.
	 * If the repeat is Matrix, pass an array (2) which refers to the distance between columns and rows.
	 *
	 * @type {(TSceneChildProp<number | Array<number>>)}
	 * @memberof ISceneChildProps
	 */
	distance?: TSceneChildProp<number | Array<number>>

	/**
	 * For Ring repeats, define the starting angle of the repeat
	 *
	 * @type {TSceneChildProp<number>}
	 * @memberof ISceneChildProps
	 */
	displace?: TSceneChildProp<number>

	/**
	 * skewX transformation.
	 *
	 * @type {TSceneChildProp<number>}
	 * @memberof ISceneChildProps
	 */
	skewX?: TSceneChildProp<number>

	/**
	 * skewY transformation
	 *
	 * @type {TSceneChildProp<number>}
	 * @memberof ISceneChildProps
	 */
	skewY?: TSceneChildProp<number>

	/**
	 * squeezeX transformation
	 *
	 * @type {TSceneChildProp<number>}
	 * @memberof ISceneChildProps
	 */
	squeezeX?: TSceneChildProp<number>

	/**
	 * squeezeY transformation
	 *
	 * @type {TSceneChildProp<number>}
	 * @memberof ISceneChildProps
	 */
	squeezeY?: TSceneChildProp<number>

	/**
	 * rotateX transformation
	 *
	 * @type {TSceneChildProp<number>}
	 * @memberof ISceneChildProps
	 */
	rotateX?: TSceneChildProp<number>

	/**
	 * rotateY transformation
	 *
	 * @type {TSceneChildProp<number>}
	 * @memberof ISceneChildProps
	 */
	rotateY?: TSceneChildProp<number>

	/**
	 * rotateZ transformation
	 *
	 * @type {TSceneChildProp<number>}
	 * @memberof ISceneChildProps
	 */
	rotateZ?: TSceneChildProp<number>

	/**
	 * scale transformation
	 *
	 * @type {(TSceneChildProp<number | Array<number>>)}
	 * @memberof ISceneChildProps
	 */
	scale?: TSceneChildProp<number | Array<number>>

	/**
	 * tranlsate transformation
	 *
	 * @type {(TSceneChildProp<number | Array<number>>)}
	 * @memberof ISceneChildProps
	 */
	translate?: TSceneChildProp<number | Array<number>>

	/**
	 * Origin transformation, between [-1, -1] and [1, 1]
	 *
	 * @type {(TSceneChildProp<number | Array<number>>)}
	 * @memberof ISceneChildProps
	 */
	rotationOrigin?: TSceneChildProp<number | Array<number>>
	// randomSeed?: string
}

/**
 * Object
 *
 * @export
 * @interface ISceneChildSettings
 * @extends {ISceneChildProps}
 */
export interface ISceneChildSettings extends ISceneChildProps {
	id?: string | number
	name?: string
	order?: number
	type?: string
	data?: any
}

/**
 *
 *
 * @export
 * @interface IContext
 */
export interface IContext {
	noise: (seed: string, x: number, y: number, z: number) => number

	angle: (repetition: IRepetition, offsetFromCenter: number | TArray) => number

	angle2: (repetition: IRepetition, offsetFromCenter: number | TArray) => number

	distance: (repetition: IRepetition, offsetFromCenter: number | TArray) => number

	percW: (percentage: number, shape: SceneChild) => number

	percH: (percentage: number, shape: SceneChild) => number
}

/**
 * Object argument for sceneChild props
 *
 * @export
 * @interface ISceneChildPropArguments
 */
export interface ISceneChildPropArguments {
	repetition: IRepetition
	shape_loop?: IRepetition
	context: IContext
	time: number
	shape?: ShapeBase
	data?: any

	parent?: Partial<ISceneChildPropArguments>
}

export type TSceneChildProp<T> = T | { (prop_arguments: ISceneChildPropArguments): T }

/**
 * Object for index the buffer
 *
 * @type ShapeBaseStreamIndexing
 */
export type ISceneChildStreamIndexing = {
	shape: ShapeBase
	parent?: ISceneChildStreamIndexing
	buffer_length: number
	repetition: IRepetition
}

export type ISceneChildStreamArguments = {
	shape: ShapePrimitive
	parent?: ISceneChildStreamIndexing

	data?: any

	lineWidth: number
	fillColor: string
	strokeColor: string

	buffer: Float32Array
	buffer_length: number
	current_buffer_index: number

	current_shape_index: number
	total_shapes: number

	repetition: IRepetition
}
