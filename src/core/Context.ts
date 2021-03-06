import SimplexNoise from 'simplex-noise'

import { ERepetitionType, IRepetition } from '@core/types/scene-child'

import SceneChild from '@core/SceneChild'
import { vec2 } from 'gl-matrix'

/**
 * @internal
 * @ignore
 */
const noises: {
	[key: string]: SimplexNoise
} = {
	random: new SimplexNoise(Math.random),
}

/**
 * Utilities function passed to <a href="[base_url]/ISceneChildPropArguments">ISceneChildPropArguments</a>
 *
 * @category Core.Utilities
 * @example
 * ```javascript
 * const circle = new Urpflanze.Circle({
 * 	distance: ({ context, repetition }) => context.noise('seed', repetition.index) * 200
 * })
 * ```
 */
const Context = {
	/**
	 * <a href="https://github.com/jwagner/simplex-noise.js" target="_blank">SimplexNoise</a>
	 * Use 'random' as seed property for random seed.
	 * Return value between -1 and 1
	 *
	 * @param {string} [seed='random']
	 * @param {number} [x=0]
	 * @param {number} [y=0]
	 * @param {number} [z=0]
	 * @returns {number}
	 */
	noise: (seed = 'random', x = 0, y = 0, z = 0): number => {
		if (!noises[seed]) {
			noises[seed] = new SimplexNoise(seed)
		}

		return noises[seed].noise3D(x, y, z)
	},

	/**
	 * Return angle (atan) from offset (or center) for matrix repetition.
	 * Offset is array between [-1, -1] and [1, 1].
	 * The return value is bettween -Math.PI / 2 and Math.PI / 2
	 *
	 * @param {IRepetition} repetition
	 * @param {vec2} offsetFromCenter
	 * @returns {number}
	 */
	angle: (repetition: IRepetition, offsetFromCenter: vec2 = [0, 0]): number => {
		if (repetition.type == ERepetitionType.Matrix) {
			const centerMatrix = vec2.fromValues(
				((repetition.col.count as number) - 1) / 2,
				((repetition.row.count as number) - 1) / 2
			)

			centerMatrix[0] += centerMatrix[0] * offsetFromCenter[0]
			centerMatrix[1] += centerMatrix[1] * offsetFromCenter[1]

			const x = (repetition.col.index as number) - 1 - centerMatrix[0]
			const y = (repetition.row.index as number) - 1 - centerMatrix[1]

			return x === 0 ? 0 : Math.atan(y / x)
		}

		return repetition.angle
	},

	/**
	 * Return angle (atan2, 4 quadrants) from offset (or center) for matrix repetition.
	 * Offset is array between [-1, -1] and [1, 1].
	 * The return value is bettween -Math.PI an Math.PI
	 *
	 * @param {IRepetition} repetition
	 * @param {vec2} offsetFromCenter
	 * @returns {number}
	 */
	angle2: (repetition: IRepetition, offsetFromCenter: vec2 = [0, 0]): number => {
		if (repetition.type == ERepetitionType.Matrix) {
			const centerMatrix = vec2.fromValues(
				((repetition.col.count as number) - 1) / 2,
				((repetition.row.count as number) - 1) / 2
			)

			centerMatrix[0] += centerMatrix[0] * offsetFromCenter[0]
			centerMatrix[1] += centerMatrix[1] * offsetFromCenter[1]

			const x = (repetition.col.index as number) - 1 - centerMatrix[0]
			const y = (repetition.col.index as number) - 1 - centerMatrix[1]

			return x === 0 ? 0 : Math.atan2(y, x)
		}

		return repetition.angle
	},

	/**
	 * Return distance from offset (or center) for matrix repetition.
	 * The return value is between 0 and 1
	 *
	 * @param {IRepetition} repetition
	 * @param {vec2} offsetFromCenter offset relative to distance prop
	 * @returns {number}
	 */
	distance: (repetition: IRepetition, offsetFromCenter: vec2 = [0, 0]): number => {
		if (repetition.type == ERepetitionType.Matrix) {
			const centerMatrix = vec2.fromValues(0.5, 0.5)

			centerMatrix[0] += centerMatrix[0] * offsetFromCenter[0]
			centerMatrix[1] += centerMatrix[1] * offsetFromCenter[1]

			const current = vec2.fromValues(
				repetition.col.offset - 0.5 / repetition.col.count,
				repetition.row.offset - 0.5 / repetition.row.count
			)

			return vec2.distance(current, centerMatrix)
		}

		return 1
	},

	/**
	 * Get value percentage of scene width.
	 *
	 * @param {number} percentage
	 * @param {SceneChild} sceneChild
	 * @returns {number}
	 */
	percW: (percentage: number, sceneChild: SceneChild): number => {
		return sceneChild && sceneChild.scene ? (sceneChild.scene.width * percentage) / 100 : percentage
	},

	/**
	 * Get value percentage of scene height.
	 *
	 * @param {number} percentage
	 * @param {SceneChild} sceneChild
	 * @returns {number}
	 */
	percH: (percentage: number, sceneChild: SceneChild): number => {
		return sceneChild && sceneChild.scene ? (sceneChild.scene.height * percentage) / 100 : percentage
	},
}

export default Context
