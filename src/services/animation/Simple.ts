import ColorManager from '@pups/core/build/Models/Color/ColorManager'
import {
	ISimpleAnimation,
	TModeFunction,
	TSimpleAnimationLoop,
	TSimpleAnimationUncontrolledLoop,
	TSimpleAnimationStatic,
	TEasing,
} from '@services/types/animation'
import Easings from '@services/animation/Easings'
import { toArray } from 'src/Utilites'
import { ISceneChildPropArguments, TSceneChildProp } from '@core/types/scene-child'

/**
 * @category Services.Animation
 */
const Simple = {
	loop: (props: TSimpleAnimationLoop): TSceneChildProp<string | number | Array<number> | Float32Array> =>
		Simple.compose({ mode: 'sinusoidal', modeFunction: 'cos', ...props, type: 'loop', delay: undefined }),

	uncontrolledLoop: (
		props: TSimpleAnimationUncontrolledLoop
	): TSceneChildProp<string | number | Array<number> | Float32Array> =>
		Simple.compose({ mode: 'easing', modeFunction: 'linear', ...props, type: 'uncontrolled-loop' }),

	static: (props: TSimpleAnimationStatic): TSceneChildProp<string | number | Array<number> | Float32Array> =>
		Simple.compose({ mode: 'easing', modeFunction: 'linear', ...props, type: 'static' }),

	compose: (simpleAnimation: ISimpleAnimation): TSceneChildProp<string | number | Array<number> | Float32Array> => {
		if (typeof simpleAnimation.from !== 'string' && typeof simpleAnimation.to !== 'string') {
			const bArray = Array.isArray(simpleAnimation.from) || Array.isArray(simpleAnimation.to)

			const from = bArray ? toArray(simpleAnimation.from) : simpleAnimation.from
			const to = bArray ? toArray(simpleAnimation.to) : simpleAnimation.to

			const vCallback = bArray
				? (current_index: number, v: number) => {
						const a = (simpleAnimation.invertOdd && current_index % 2 == 1 ? to : from) as Array<number> | Float32Array
						const b = (simpleAnimation.invertOdd && current_index % 2 == 1 ? from : to) as Array<number> | Float32Array

						return simpleAnimation.typeValue === 'int'
							? [Math.round(a[0] + v * (b[0] - a[0])), Math.round(a[1] + v * (b[1] - a[1]))]
							: [a[0] + v * (b[0] - a[0]), a[1] + v * (b[1] - a[1])]
				  }
				: (current_index: number, v: number) => {
						const a = (simpleAnimation.invertOdd && current_index % 2 == 1 ? to : from) as number
						const b = (simpleAnimation.invertOdd && current_index % 2 == 1 ? from : to) as number

						return simpleAnimation.typeValue === 'int' ? Math.round(a + v * (b - a)) : a + v * (b - a)
				  }

			return createSimpleAnimationCallback<number | Array<number> | Float32Array>(simpleAnimation, (props, v) =>
				vCallback(props.repetition.index, v)
			)
		} else {
			const from = new ColorManager(simpleAnimation.from as string)
			const to = new ColorManager(simpleAnimation.to as string)

			const vCallback = simpleAnimation.colorTransitionMode == 'hue' ? interpolateColorHSL : interpolateColorRGB

			return createSimpleAnimationCallback<string>(simpleAnimation, (props, v) => {
				const a = simpleAnimation.invertOdd && props.repetition.index % 2 == 1 ? to : from
				const b = simpleAnimation.invertOdd && props.repetition.index % 2 == 1 ? from : to

				return vCallback(a, b, v)
			})
		}
	},
}
function createSimpleAnimationCallback<T>(
	animation: ISimpleAnimation,
	value: (props: ISceneChildPropArguments, currentInterpolation: number) => T
): TSceneChildProp<T> {
	const { durate, type, mode, modeFunction, delay } = animation as Required<ISimpleAnimation>

	if (type === 'static') {
		if (delay && delay > 0)
			return function SimpleAnimation(props: ISceneChildPropArguments) {
				return value(
					props,
					props.time <= delay
						? 0
						: props.time - delay >= durate
						? 1
						: Easings[modeFunction as TEasing](props.time - delay, 0, 1, durate)
				)
			}
		else
			return function SimpleAnimation(props: ISceneChildPropArguments) {
				return value(props, props.time <= durate ? Easings[modeFunction as TEasing](props.time, 0, 1 - 0, durate) : 1)
			}
	} else {
		if (type === 'loop') {
			if (mode == 'sinusoidal') {
				return function SimpleAnimation(props: ISceneChildPropArguments) {
					const frequency = ((props.time || 0) * 2 * Math.PI) / durate
					return value(props, 0.5 + Math[modeFunction as Exclude<TModeFunction, TEasing>](frequency) * 0.5)
				}
			} /* easing */ else {
				return function SimpleAnimation(props: ISceneChildPropArguments) {
					const d2 = durate / 2
					const t = props.time % durate
					return value(
						props,
						t <= d2
							? Easings[modeFunction as TEasing](t, 0, 1, d2)
							: Easings[modeFunction as TEasing](d2 - (t - d2), 0, 1, d2)
					)
				}
			}
		} // uncontrolled-loop
		else {
			if (mode == 'sinusoidal') {
				return function SimpleAnimation(props: ISceneChildPropArguments) {
					let time = props.time % (durate + delay)
					time = time <= delay ? 0 : time - delay
					const frequency = ((time || 0) * 2 * Math.PI) / durate
					return value(props, 0.5 + Math[modeFunction as Exclude<TModeFunction, TEasing>](frequency) * 0.5)
				}
			} else {
				if (delay && delay > 0)
					return function SimpleAnimation(props: ISceneChildPropArguments) {
						const time = props.time % (durate + delay)
						return value(
							props,
							time <= delay
								? 0
								: time - delay >= durate
								? 1
								: Easings[modeFunction as TEasing](time - delay, 0, 1, durate)
						)
					}
				else
					return function SimpleAnimation(props: ISceneChildPropArguments) {
						const time = props.time % durate
						return value(props, time <= durate ? Easings[modeFunction as TEasing](time, 0, 1 - 0, durate) : 1)
					}
			}
		}
	}
}

function interpolateColorRGB(start: ColorManager, end: ColorManager, v: number): string {
	const aAlpha = start.getAlpha()
	const bAlpha = end.getAlpha()
	const s = start.getRgb()
	const e = end.getRgb()

	const r = s.r + v * (e.r - s.r)
	const g = s.g + v * (e.g - s.g)
	const b = s.b + v * (e.b - s.b)
	const alpha = aAlpha + v * (bAlpha - aAlpha)

	return `rgba(${Math.floor(r)},${Math.floor(g)},${Math.floor(b)},${alpha <= 0 ? 0 : alpha >= 1 ? 1 : alpha})`
}

function interpolateColorHSL(start: ColorManager, end: ColorManager, v: number): string {
	const aAlpha = start.getAlpha()
	const bAlpha = end.getAlpha()
	const s = start.getHsl()
	const e = end.getHsl()

	const _h = s.h + v * (e.h - s.h)
	const _s = s.s + v * (e.s - s.s)
	const _l = s.l + v * (e.l - s.l)
	const alpha = aAlpha + v * (bAlpha - aAlpha)

	return `hsla(${Math.floor(_h * 360)},${Math.floor(_s * 100)}%,${Math.floor(_l * 100)}%,${
		alpha <= 0 ? 0 : alpha >= 1 ? 1 : alpha
	})`
}

export default Simple
